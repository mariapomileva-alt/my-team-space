"use server";

import { isBillingConfigured, variantIdForPlan, isSingleTeamVariantConfigured } from "@/lib/billing/config";
import type { PlanType } from "@/lib/billing/types";
import { requireAuth } from "@/lib/auth/require-auth";
import { redirect } from "next/navigation";

const LEMON_API = "https://api.lemonsqueezy.com/v1";

function pricingRedirect(plan: PlanType = "single_team", reason?: string): never {
  const q = new URLSearchParams({ startPlan: plan });
  if (reason) q.set("billing", reason);
  redirect(`/pricing?${q.toString()}`);
}

export async function startCheckoutForPlan(plan: PlanType) {
  const { user } = await requireAuth();

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = variantIdForPlan(plan);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!apiKey || !storeId || !variantId || !appUrl) {
    pricingRedirect(plan, "not_configured");
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
    pricingRedirect(plan, "checkout_failed");
  }

  const json = (await res.json()) as { data?: { attributes?: { url?: string } } };
  const url = json?.data?.attributes?.url?.trim();
  if (url) {
    redirect(url);
  }
  pricingRedirect(plan, "checkout_failed");
}

/** @deprecated Per-team checkout — use startCheckoutForPlan */
export async function startCheckoutSession(teamId: string) {
  void teamId;
  if (!isSingleTeamVariantConfigured()) {
    pricingRedirect("single_team", "not_configured");
  }
  await startCheckoutForPlan("single_team");
}

/** Opens Lemon customer portal, or pricing if no paid subscription yet. Never throws. */
export async function openBillingPortal() {
  const { supabase, user } = await requireAuth();

  if (!isBillingConfigured()) {
    pricingRedirect("single_team", "not_configured");
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY!;

  const { data: subRow, error } = await supabase
    .from("coach_subscriptions")
    .select("lemon_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    redirect("/admin?billing=error");
  }

  const subId = (subRow?.lemon_subscription_id as string | undefined)?.trim();
  if (!subId) {
    pricingRedirect("single_team", "no_subscription");
  }

  const lemonSubId = subId;
  const res = await fetch(`${LEMON_API}/subscriptions/${encodeURIComponent(lemonSubId)}`, {
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    pricingRedirect("single_team", "portal_unavailable");
  }

  const json = (await res.json()) as {
    data?: { attributes?: { urls?: { customer_portal?: string | null } } };
  };
  const portal = json?.data?.attributes?.urls?.customer_portal?.trim();
  if (!portal) {
    redirect("/admin?billing=no_portal");
  }
  redirect(portal);
}

/** @deprecated Use openBillingPortal() — billing is account-level */
export async function openBillingPortalForTeam(teamId: string) {
  void teamId;
  return openBillingPortal();
}
