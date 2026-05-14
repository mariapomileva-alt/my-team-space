import { createServiceRoleClient } from "@/lib/supabase/admin";
import { lemonStatusToTeamStatus } from "@/lib/lemon/map-subscription-status";
import { verifyLemonWebhookSignature } from "@/lib/lemon/verify-webhook-signature";
import { publicTeamCacheTag } from "@/lib/teams/public";
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
    };
  };
};

async function invalidatePublicTeamById(admin: ReturnType<typeof createServiceRoleClient>, teamId: string) {
  const { data } = await admin.from("teams").select("slug").eq("id", teamId).maybeSingle();
  if (!data?.slug) return;
  revalidatePath(`/team/${data.slug}`);
  revalidateTag(publicTeamCacheTag(data.slug), "default");
}

async function syncSubscriptionFromPayload(
  admin: ReturnType<typeof createServiceRoleClient>,
  payload: LemonWebhookBody
) {
  const data = payload.data;
  if (!data || data.type !== "subscriptions" || !data.id) return;

  const subId = String(data.id);
  const attrs = data.attributes ?? {};
  const lsStatus = attrs.status;
  const customerId = attrs.customer_id != null ? String(attrs.customer_id) : undefined;

  const custom = payload.meta?.custom_data ?? {};
  let teamId =
    (typeof custom.team_id === "string" && custom.team_id) ||
    (typeof custom.team_id === "number" && String(custom.team_id)) ||
    undefined;

  if (!teamId) {
    const { data: bill } = await admin.from("team_billing").select("team_id").eq("lemon_subscription_id", subId).maybeSingle();
    teamId = bill?.team_id ?? undefined;
  }
  if (!teamId) return;

  const row: {
    team_id: string;
    lemon_subscription_id: string;
    updated_at: string;
    lemon_customer_id?: string;
  } = {
    team_id: teamId,
    lemon_subscription_id: subId,
    updated_at: new Date().toISOString(),
  };
  if (customerId) row.lemon_customer_id = customerId;

  await admin.from("team_billing").upsert(row, { onConflict: "team_id" });

  const mapped = lemonStatusToTeamStatus(lsStatus);
  await admin.from("teams").update({ subscription_status: mapped }).eq("id", teamId);
  await invalidatePublicTeamById(admin, teamId);
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
    if (payload.data?.type === "subscriptions" && eventName.startsWith("subscription_")) {
      await syncSubscriptionFromPayload(admin, payload);
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
