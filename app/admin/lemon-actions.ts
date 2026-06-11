"use server";

import { variantIdForPlan, isSingleTeamVariantConfigured } from "@/lib/billing/config";
import type { PlanType } from "@/lib/billing/types";
import { requireAuth } from "@/lib/auth/require-auth";
import { redirect } from "next/navigation";

const LEMON_API = "https://api.lemonsqueezy.com/v1";

function adminBillingRedirect(reason: string, plan?: PlanType): never {
  const q = new URLSearchParams({ billing: reason });
  if (plan) q.set("startPlan", plan);
  redirect(`/admin?${q.toString()}`);
}

export async function startCheckoutForPlan(plan: PlanType) {
  const { user } = await requireAuth();

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = variantIdForPlan(plan);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!apiKey || !storeId || !variantId || !appUrl) {
    console.error("[lemon] checkout not configured", {
      hasApiKey: Boolean(apiKey),
      hasStoreId: Boolean(storeId),
      hasVariantId: Boolean(variantId),
      hasAppUrl: Boolean(appUrl),
      plan,
    });
    adminBillingRedirect("not_configured", plan);
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
    const errBody = await res.text().catch(() => "");
    console.error("[lemon] checkout API failed", res.status, errBody);
    adminBillingRedirect("checkout_failed", plan);
  }

  const json = (await res.json()) as { data?: { attributes?: { url?: string } } };
  const url = json?.data?.attributes?.url?.trim();
  if (url) {
    redirect(url);
  }
  console.error("[lemon] checkout API returned no URL", json);
  adminBillingRedirect("checkout_failed", plan);
}

/** @deprecated Per-team checkout — use startCheckoutForPlan */
export async function startCheckoutSession(teamId: string) {
  void teamId;
  if (!isSingleTeamVariantConfigured()) {
    adminBillingRedirect("not_configured", "single_team");
  }
  await startCheckoutForPlan("single_team");
}

/** Opens Lemon customer portal, or pricing if no paid subscription yet. Never throws. */
export async function openBillingPortal() {
  const { supabase, user } = await requireAuth();

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    adminBillingRedirect("not_configured", "single_team");
  }

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
    await startCheckoutForPlan("single_team");
    return;
  }

  const lemonSubId = subId;
  const res = await fetch(`${LEMON_API}/subscriptions/${encodeURIComponent(lemonSubId)}`, {
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    console.error("[lemon] subscription fetch failed", res.status);
    adminBillingRedirect("portal_unavailable", "single_team");
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
