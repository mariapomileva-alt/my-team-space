import type { PlanType } from "@/lib/billing/types";

/**
 * Lemon Squeezy variant IDs — set in environment (one source of truth).
 * LEMONSQUEEZY_TEAM_VARIANT_ID is preferred; SINGLE_TEAM_VARIANT_ID is legacy alias.
 */
export const TEAM_VARIANT_ID =
  process.env.LEMONSQUEEZY_TEAM_VARIANT_ID ??
  process.env.LEMONSQUEEZY_SINGLE_TEAM_VARIANT_ID ??
  "";

export const ACADEMY_VARIANT_ID = process.env.LEMONSQUEEZY_ACADEMY_VARIANT_ID ?? "";

/** @deprecated use TEAM_VARIANT_ID */
export const SINGLE_TEAM_VARIANT_ID = TEAM_VARIANT_ID;

/** Legacy single-variant env (falls back to Team plan). */
const LEGACY_VARIANT_ID = process.env.LEMONSQUEEZY_VARIANT_ID ?? "";

export const ACADEMY_TEAM_LIMIT = 20;

export function variantIdForPlan(plan: PlanType): string {
  if (plan === "academy") return ACADEMY_VARIANT_ID;
  return TEAM_VARIANT_ID || LEGACY_VARIANT_ID;
}

export function planFromVariantId(variantId: string | null | undefined): {
  planType: PlanType;
  teamLimit: number;
} | null {
  const id = variantId?.trim();
  if (!id) return null;
  if (ACADEMY_VARIANT_ID && id === ACADEMY_VARIANT_ID) {
    return { planType: "academy", teamLimit: ACADEMY_TEAM_LIMIT };
  }
  const teamId = TEAM_VARIANT_ID || LEGACY_VARIANT_ID;
  if (teamId && id === teamId) {
    return { planType: "single_team", teamLimit: 1 };
  }
  return null;
}

export function isBillingConfigured(): boolean {
  return Boolean(
    process.env.LEMONSQUEEZY_API_KEY &&
      process.env.LEMONSQUEEZY_STORE_ID &&
      (TEAM_VARIANT_ID || LEGACY_VARIANT_ID) &&
      ACADEMY_VARIANT_ID &&
      process.env.NEXT_PUBLIC_APP_URL,
  );
}

export function isSingleTeamVariantConfigured(): boolean {
  return Boolean(TEAM_VARIANT_ID || LEGACY_VARIANT_ID);
}
