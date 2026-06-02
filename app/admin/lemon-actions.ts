"use server";

import { variantIdForPlan, isSingleTeamVariantConfigured } from "@/lib/billing/config";
import type { PlanType } from "@/lib/billing/types";
import { requireAuth } from "@/lib/auth/require-auth";
import { redirect } from "next/navigation";

const LEMON_API = "https://api.lemonsqueezy.com/v1";

export async function startCheckoutForPlan(plan: PlanType) {
  const { user } = await requireAuth();

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = variantIdForPlan(plan);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!apiKey || !storeId || !variantId || !appUrl) {
    throw new Error(
      "Lemon Squeezy not configured. Set LEMONSQUEEZY_API_KEY, STORE_ID, SINGLE_TEAM + ACADEMY variant IDs, and NEXT_PUBLIC_APP_URL.",
    );
  }

  const checkout_data: Record<string, unknown> = {
    custom: {
      user_id: user.id,
      plan_type: plan,
    },
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
            redirect_url: `${appUrl}/admin?checkout=success&plan=${plan}`,
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

/** @deprecated Per-team checkout — use startCheckoutForPlan */
export async function startCheckoutSession(teamId: string) {
  if (!isSingleTeamVariantConfigured()) {
    throw new Error("Single Team variant not configured");
  }
  await startCheckoutForPlan("single_team");
}

export async function openBillingPortal() {
  const { supabase, user } = await requireAuth();

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) throw new Error("Lemon Squeezy not configured");

  const { data: subRow } = await supabase
    .from("coach_subscriptions")
    .select("lemon_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const subId = subRow?.lemon_subscription_id as string | undefined;
  if (!subId) throw new Error("No subscription yet — choose a plan on the pricing page first.");

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

/** @deprecated Use openBillingPortal() — billing is account-level */
export async function openBillingPortalForTeam(teamId: string) {
  void teamId;
  return openBillingPortal();
}
