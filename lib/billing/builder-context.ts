import { loadCoachEntitlements } from "@/lib/billing/coach-subscription";
import type { SupabaseClient } from "@supabase/supabase-js";

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
  canEdit: boolean;
  lockReason: BuilderLockReason;
  showUpgradeCta: boolean;
  publishStatus: "draft" | "published";
};

export async function loadBuilderBillingContext(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
  team: {
    plan_edit_locked?: boolean | null;
    publish_status?: string | null;
  },
): Promise<BuilderBillingContext> {
  const ent = await loadCoachEntitlements(supabase, userId);

  const { data: canEditRaw } = await supabase.rpc("coach_subscription_allows_edit", {
    p_user_id: userId,
    p_team_id: teamId,
  });

  const canEdit = Boolean(canEditRaw);
  const billingActive = ent.billingActive;
  const planType = ent.subscription?.planType;
  const isAcademy = planType === "academy";

  let lockReason: BuilderLockReason = "none";
  if (!canEdit) {
    if (!billingActive) {
      lockReason = "subscription_inactive";
    } else if (team.plan_edit_locked) {
      lockReason = "team_plan_locked";
    } else {
      lockReason = "not_active_team";
    }
  }

  const showUpgradeCta =
    !isAcademy &&
    (lockReason === "team_plan_locked" || lockReason === "not_active_team" || ent.needsPrimaryTeamSelection);

  return {
    planLabel: ent.planLabel,
    teamsUsed: ent.teamsUsed,
    teamLimit: ent.teamLimit,
    billingActive,
    canEdit,
    lockReason,
    showUpgradeCta,
    publishStatus: team.publish_status === "published" ? "published" : "draft",
  };
}

export function builderLockMessage(reason: BuilderLockReason): string | null {
  switch (reason) {
    case "subscription_inactive":
      return "Your subscription is not active. Please update your billing to continue editing your team page.";
    case "team_plan_locked":
      return "This team page is locked on your current plan. Choose your active team in the dashboard or upgrade to Academy.";
    case "not_active_team":
      return "Your Single Team plan includes one active team page. Switch your active team in the dashboard or upgrade to Academy.";
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
