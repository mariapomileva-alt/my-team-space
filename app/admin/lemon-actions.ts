"use server";

import { requireAuth } from "@/lib/auth/require-auth";
import { redirect } from "next/navigation";

const LEMON_API = "https://api.lemonsqueezy.com/v1";

export async function startCheckoutSession(teamId: string) {
  const { supabase, user } = await requireAuth();
  const { data: mem } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!mem || mem.role !== "coach") throw new Error("Only the team owner can manage billing");

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!apiKey || !storeId || !variantId || !appUrl) {
    throw new Error("Lemon Squeezy not configured (LEMONSQUEEZY_API_KEY, STORE_ID, VARIANT_ID, NEXT_PUBLIC_APP_URL)");
  }

  const checkout_data: Record<string, unknown> = {
    custom: { team_id: teamId },
  };
  if (user.email) checkout_data.email = user.email;

  const res = await fetch(`${LEMON_API}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            redirect_url: `${appUrl}/admin/team/${teamId}?checkout=success`,
          },
          checkout_data,
        },
        relationships: {
          store: { data: { type: "stores", id: String(storeId) } },
          variant: { data: { type: "variants", id: String(variantId) } },
        },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text.slice(0, 240) || `Checkout API ${res.status}`);
  }

  const json = (await res.json()) as { data?: { attributes?: { url?: string } } };
  const url = json?.data?.attributes?.url;
  if (!url) throw new Error("No checkout URL in Lemon Squeezy response");
  redirect(url);
}

export async function openBillingPortal(teamId: string) {
  const { supabase, user } = await requireAuth();
  const { data: mem } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!mem || mem.role !== "coach") throw new Error("Only the team owner can manage billing");

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) throw new Error("Lemon Squeezy not configured");

  const { data: bill } = await supabase
    .from("team_billing")
    .select("lemon_subscription_id")
    .eq("team_id", teamId)
    .single();
  const subId = bill?.lemon_subscription_id as string | undefined;
  if (!subId) throw new Error("No subscription yet — complete checkout first");

  const res = await fetch(`${LEMON_API}/subscriptions/${encodeURIComponent(subId)}`, {
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text.slice(0, 240) || `Subscription API ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: { attributes?: { urls?: { customer_portal?: string | null } } };
  };
  const portal = json?.data?.attributes?.urls?.customer_portal;
  if (!portal) throw new Error("No customer portal URL — check Lemon Squeezy subscription");
  redirect(portal);
}
