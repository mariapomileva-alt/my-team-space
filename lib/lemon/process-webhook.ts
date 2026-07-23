import { planFromVariantId } from "@/lib/billing/config";
import { lemonStatusToCoachStatus } from "@/lib/billing/map-status";
import type { PlanType } from "@/lib/billing/types";
import {
  buildLemonWebhookEventKey,
  extractLemonCurrentPeriodEnd,
  extractLemonUpdatedAt,
  shouldApplyLemonSubscriptionUpdate,
  type LemonWebhookBody,
} from "@/lib/lemon/webhook-payload";
import { mergeMonitoringContext, MonitoringEvents, trackEvent } from "@/lib/monitoring";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { publicTeamCacheTag, revalidatePublicTeamPaths } from "@/lib/teams/public";
import { revalidatePath, revalidateTag } from "next/cache";

export type { LemonWebhookBody, LemonWebhookMeta } from "@/lib/lemon/webhook-payload";

export const LEMON_SUBSCRIPTION_EVENTS = new Set([
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_expired",
  "subscription_payment_success",
  "subscription_payment_failed",
]);

function readUserId(custom: Record<string, unknown>): string | undefined {
  const raw = custom.user_id ?? custom.userId;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (typeof raw === "number") return String(raw);
  return undefined;
}

async function invalidateCoachTeams(
  admin: ReturnType<typeof createServiceRoleClient>,
  userId: string,
) {
  const { data: memberships } = await admin
    .from("team_members")
    .select("team_id, teams(slug)")
    .eq("user_id", userId)
    .eq("role", "coach");

  for (const row of memberships ?? []) {
    const slug = (row.teams as { slug?: string } | null)?.slug;
    if (!slug) continue;
    revalidatePublicTeamPaths(slug);
    revalidateTag(publicTeamCacheTag(slug), "default");
  }
  revalidatePath("/admin");
}

async function claimWebhookDelivery(
  admin: ReturnType<typeof createServiceRoleClient>,
  payload: LemonWebhookBody,
): Promise<"claimed" | "duplicate" | "unkeyed"> {
  const eventKey = buildLemonWebhookEventKey(payload);
  if (!eventKey) return "unkeyed";

  const { data, error } = await admin.rpc("claim_lemon_webhook_event", {
    p_event_key: eventKey,
    p_event_name: payload.meta?.event_name ?? null,
    p_subscription_id: payload.data?.id != null ? String(payload.data.id) : null,
  });

  if (error) {
    // Migration not applied yet — process without dedup rather than fail billing.
    if (
      error.message?.includes("claim_lemon_webhook_event") ||
      error.code === "42883" ||
      error.code === "42P01"
    ) {
      console.warn("[lemon-webhook] claim_lemon_webhook_event missing; continuing without dedup");
      trackEvent(MonitoringEvents.webhook_processed, { status: "dedup_unavailable" });
      return "unkeyed";
    }
    throw error;
  }

  return data === true ? "claimed" : "duplicate";
}

async function syncCoachSubscription(
  admin: ReturnType<typeof createServiceRoleClient>,
  payload: LemonWebhookBody,
) {
  const data = payload.data;
  if (!data || data.type !== "subscriptions" || !data.id) return;

  const claim = await claimWebhookDelivery(admin, payload);
  if (claim === "duplicate") {
    trackEvent(MonitoringEvents.webhook_duplicate, {
      event_name: payload.meta?.event_name ?? "unknown",
      status: "duplicate",
    });
    return;
  }

  const subId = String(data.id);
  const attrs = data.attributes ?? {};
  const lsStatus = attrs.status;
  const customerId = attrs.customer_id != null ? String(attrs.customer_id) : null;
  const variantId = attrs.variant_id != null ? String(attrs.variant_id) : null;
  const currentPeriodEnd = extractLemonCurrentPeriodEnd(attrs);
  const lemonUpdatedAt = extractLemonUpdatedAt(attrs);

  const custom = payload.meta?.custom_data ?? {};
  let userId = readUserId(custom);

  if (!userId) {
    const { data: existing } = await admin
      .from("coach_subscriptions")
      .select("user_id")
      .eq("lemon_subscription_id", subId)
      .maybeSingle();
    userId = existing?.user_id ?? undefined;
  }

  if (!userId) {
    const legacyTeamId =
      (typeof custom.team_id === "string" && custom.team_id) ||
      (typeof custom.team_id === "number" && String(custom.team_id)) ||
      undefined;
    if (legacyTeamId) {
      const { data: coach } = await admin
        .from("team_members")
        .select("user_id")
        .eq("team_id", legacyTeamId)
        .eq("role", "coach")
        .maybeSingle();
      userId = coach?.user_id ?? undefined;
    }
  }

  if (!userId) return;

  mergeMonitoringContext({
    user_id: userId,
    subscription_id: subId,
  });

  const { data: existingSub } = await admin
    .from("coach_subscriptions")
    .select("lemon_updated_at, subscription_status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (
    !shouldApplyLemonSubscriptionUpdate(
      existingSub?.lemon_updated_at as string | null | undefined,
      lemonUpdatedAt,
    )
  ) {
    trackEvent(MonitoringEvents.webhook_stale, {
      event_name: payload.meta?.event_name ?? "unknown",
      status: "stale",
    });
    return;
  }

  const mappedStatus = lemonStatusToCoachStatus(lsStatus);
  const planInfo = planFromVariantId(variantId);
  const planType: PlanType | null = planInfo?.planType ?? null;
  const teamLimit = planInfo?.teamLimit ?? null;

  const { error } = await admin.rpc("upsert_coach_subscription_from_lemon", {
    p_user_id: userId,
    p_customer_id: customerId,
    p_subscription_id: subId,
    p_variant_id: variantId,
    p_plan_type: planType,
    p_subscription_status: mappedStatus,
    p_team_limit: teamLimit,
    p_current_period_end: currentPeriodEnd,
    p_lemon_updated_at: lemonUpdatedAt,
  });

  if (error) {
    // Rolling deploy: 9-arg RPC may not exist yet — retry without lemon_updated_at.
    if (error.message?.includes("p_lemon_updated_at") || error.code === "42883") {
      const { error: legacyErr } = await admin.rpc("upsert_coach_subscription_from_lemon", {
        p_user_id: userId,
        p_customer_id: customerId,
        p_subscription_id: subId,
        p_variant_id: variantId,
        p_plan_type: planType,
        p_subscription_status: mappedStatus,
        p_team_limit: teamLimit,
        p_current_period_end: currentPeriodEnd,
      });
      if (legacyErr) throw legacyErr;
    } else {
      throw error;
    }
  }

  await invalidateCoachTeams(admin, userId);

  const eventName = payload.meta?.event_name ?? "";
  if (eventName === "subscription_created" || mappedStatus === "trialing" || mappedStatus === "active") {
    if (eventName === "subscription_created") {
      trackEvent(MonitoringEvents.subscription_created, { status: mappedStatus });
    }
  }
  if (eventName === "subscription_cancelled" || mappedStatus === "cancelled" || mappedStatus === "expired") {
    trackEvent(MonitoringEvents.subscription_cancelled, { status: mappedStatus });
  }
  trackEvent(MonitoringEvents.webhook_processed, {
    event_name: eventName || "unknown",
    status: mappedStatus,
  });
}

export async function processLemonSqueezyWebhook(payload: LemonWebhookBody) {
  const eventName = payload.meta?.event_name ?? "";

  if (
    payload.data?.type === "subscriptions" &&
    (eventName.startsWith("subscription_") || LEMON_SUBSCRIPTION_EVENTS.has(eventName))
  ) {
    const admin = createServiceRoleClient();
    await syncCoachSubscription(admin, payload);
  }
}
