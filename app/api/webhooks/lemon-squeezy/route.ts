import { planFromVariantId } from "@/lib/billing/config";
import { lemonStatusToCoachStatus } from "@/lib/billing/map-status";
import type { PlanType } from "@/lib/billing/types";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { publicTeamCacheTag } from "@/lib/teams/public";
import { verifyLemonWebhookSignature } from "@/lib/lemon/verify-webhook-signature";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LemonMeta = {
  event_name?: string;
  custom_data?: Record<string, unknown>;
};

type LemonWebhookBody = {
  meta?: LemonMeta;
  data?: {
    id?: string;
    type?: string;
    attributes?: {
      status?: string;
      customer_id?: number;
      variant_id?: number;
    };
  };
};

const SUBSCRIPTION_EVENTS = new Set([
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
    revalidatePath(`/team/${slug}`);
    revalidateTag(publicTeamCacheTag(slug), "default");
  }
  revalidatePath("/admin");
}

async function syncCoachSubscription(
  admin: ReturnType<typeof createServiceRoleClient>,
  payload: LemonWebhookBody,
) {
  const data = payload.data;
  if (!data || data.type !== "subscriptions" || !data.id) return;

  const subId = String(data.id);
  const attrs = data.attributes ?? {};
  const lsStatus = attrs.status;
  const customerId = attrs.customer_id != null ? String(attrs.customer_id) : null;
  const variantId = attrs.variant_id != null ? String(attrs.variant_id) : null;

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

  const mappedStatus = lemonStatusToCoachStatus(lsStatus);
  const planInfo = planFromVariantId(variantId);
  const planType: PlanType | null = planInfo?.planType ?? null;
  const teamLimit = planInfo?.teamLimit ?? null;

  await admin.rpc("upsert_coach_subscription_from_lemon", {
    p_user_id: userId,
    p_customer_id: customerId,
    p_subscription_id: subId,
    p_variant_id: variantId,
    p_plan_type: planType,
    p_subscription_status: mappedStatus,
    p_team_limit: teamLimit,
  });

  await invalidateCoachTeams(admin, userId);
}

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Lemon Squeezy webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const sig = request.headers.get("X-Signature");
  if (!verifyLemonWebhookSignature(rawBody, sig, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: LemonWebhookBody;
  try {
    payload = JSON.parse(rawBody) as LemonWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name ?? "";
  const admin = createServiceRoleClient();

  try {
    if (
      payload.data?.type === "subscriptions" &&
      (eventName.startsWith("subscription_") || SUBSCRIPTION_EVENTS.has(eventName))
    ) {
      await syncCoachSubscription(admin, payload);
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
