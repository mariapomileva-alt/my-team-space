import { createServiceRoleClient } from "@/lib/supabase/admin";
import { publicTeamCacheTag } from "@/lib/teams/public";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

async function invalidatePublicTeamById(
  admin: ReturnType<typeof createServiceRoleClient>,
  teamId: string
) {
  const { data } = await admin.from("teams").select("slug").eq("id", teamId).maybeSingle();
  if (!data?.slug) return;
  revalidatePath(`/team/${data.slug}`);
  revalidateTag(publicTeamCacheTag(data.slug), "default");
}

function mapStripeStatus(status: Stripe.Subscription.Status): string {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "canceled";
    default:
      return "inactive";
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !whSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }
  const stripe = new Stripe(secret);
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createServiceRoleClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const teamId = session.metadata?.team_id;
        const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
        const custId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        if (teamId && subId && custId) {
          await admin.from("team_billing").upsert(
            {
              team_id: teamId,
              stripe_customer_id: custId,
              stripe_subscription_id: subId,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "team_id" }
          );
          await admin.from("teams").update({ subscription_status: "active" }).eq("id", teamId);
          await invalidatePublicTeamById(admin, teamId);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        let teamId = sub.metadata?.team_id;
        if (!teamId) {
          const { data: bill } = await admin.from("team_billing").select("team_id").eq("stripe_subscription_id", sub.id).maybeSingle();
          teamId = bill?.team_id ?? undefined;
        }
        if (teamId) {
          const status = event.type.endsWith("deleted") ? "canceled" : mapStripeStatus(sub.status);
          await admin.from("teams").update({ subscription_status: status }).eq("id", teamId);
          await admin
            .from("team_billing")
            .update({
              stripe_subscription_id: sub.id,
              updated_at: new Date().toISOString(),
            })
            .eq("team_id", teamId);
          await invalidatePublicTeamById(admin, teamId);
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
