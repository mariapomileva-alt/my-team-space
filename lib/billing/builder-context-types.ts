/** Client-safe billing types and copy helpers (no Supabase / server imports). */

export type BuilderLockReason =
  | "none"
  | "subscription_inactive"
  | "team_plan_locked"
  | "not_active_team";

/** Serializable billing state for the team page builder (server → client). */
export type BuilderBillingContext = {
  planLabel: string;
  teamsUsed: number;
  teamLimit: number;
  billingActive: boolean;
  /** True when coach has a Lemon Squeezy subscription id (paid / trialing via Lemon). */
  hasLemonSubscription: boolean;
  canEdit: boolean;
  lockReason: BuilderLockReason;
  showUpgradeCta: boolean;
  publishStatus: "draft" | "published";
};

export function builderLockMessage(reason: BuilderLockReason): string | null {
  switch (reason) {
    case "subscription_inactive":
      return "Your subscription is not active. Please update your billing to continue editing your team page.";
    case "team_plan_locked":
      return "This team page is not your active page on the Single Team plan. Use “Make this my active team” below.";
    case "not_active_team":
      return "This team page is not your active page on the Single Team plan. Use “Make this my active team” below.";
    default:
      return null;
  }
}

export function builderUsageLabel(teamsUsed: number, teamLimit: number, planLabel: string): string {
  if (planLabel === "Academy Plan") {
    return teamLimit >= 20 ? `${teamsUsed} teams created` : `${teamsUsed} / ${teamLimit} teams used`;
  }
  return `${Math.min(teamsUsed, 1)} / 1 team used`;
}

export function defaultBuilderBillingContext(
  publishStatus: "draft" | "published" = "draft",
): BuilderBillingContext {
  return {
    planLabel: "Single Team Plan",
    teamsUsed: 1,
    teamLimit: 1,
    billingActive: true,
    hasLemonSubscription: false,
    canEdit: true,
    lockReason: "none",
    showUpgradeCta: false,
    publishStatus,
  };
}
