import type { PlanType } from "@/lib/billing/types";

/** Canonical plan definitions — billing, checkout, and marketing must stay aligned. */
export type PlanSpec = {
  planType: PlanType;
  label: string;
  /** Display price on pricing cards, e.g. €29 */
  displayPrice: string;
  /** Whole euros per month — used by regression tests */
  monthlyEuro: 29 | 199;
  teamLimit: number;
  startPlanQuery: PlanType;
};

export const PLAN_CATALOG: Record<PlanType, PlanSpec> = {
  single_team: {
    planType: "single_team",
    label: "Team Plan",
    displayPrice: "€29",
    monthlyEuro: 29,
    teamLimit: 1,
    startPlanQuery: "single_team",
  },
  academy: {
    planType: "academy",
    label: "Academy Plan",
    displayPrice: "€199",
    monthlyEuro: 199,
    teamLimit: 20,
    startPlanQuery: "academy",
  },
};

export function getPlanSpec(plan: PlanType): PlanSpec {
  return PLAN_CATALOG[plan];
}
