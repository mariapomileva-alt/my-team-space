"use server";

import { requireAuth } from "@/lib/auth/require-auth";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export async function startCheckoutSession(teamId: string) {
  const { supabase, user } = await requireAuth();
  const { data: mem } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!mem) throw new Error("Forbidden");

  const secret = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!secret || !price || !appUrl) throw new Error("Stripe not configured");

  const stripe = new Stripe(secret);
  const { data: bill } = await supabase.from("team_billing").select("*").eq("team_id", teamId).maybeSingle();
  let customerId = bill?.stripe_customer_id as string | undefined;
  if (!customerId) {
    const c = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = c.id;
    await supabase.from("team_billing").upsert(
      {
        team_id: teamId,
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "team_id" }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    success_url: `${appUrl}/admin/team/${teamId}?checkout=1`,
    cancel_url: `${appUrl}/admin/team/${teamId}?checkout=cancel`,
    metadata: { team_id: teamId },
    subscription_data: { metadata: { team_id: teamId } },
  });
  if (session.url) redirect(session.url);
}

export async function openBillingPortal(teamId: string) {
  const { supabase, user } = await requireAuth();
  const { data: mem } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!mem) throw new Error("Forbidden");
  const secret = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!secret || !appUrl) throw new Error("Stripe not configured");
  const { data: bill } = await supabase.from("team_billing").select("stripe_customer_id").eq("team_id", teamId).single();
  if (!bill?.stripe_customer_id) throw new Error("No billing customer");
  const stripe = new Stripe(secret);
  const session = await stripe.billingPortal.sessions.create({
    customer: bill.stripe_customer_id,
    return_url: `${appUrl}/admin/team/${teamId}`,
  });
  redirect(session.url);
}
