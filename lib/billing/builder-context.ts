import { ensureCoachTeamEditAccess } from "@/lib/billing/ensure-team-access";
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
  const planType = ent.subscription?.planType ?? "single_team";
  const isAcademy = planType === "academy";

  if (!isAcademy) {
    await ensureCoachTeamEditAccess(supabase, teamId);
  }

  const { data: canEditRaw, error: rpcError } = await supabase.rpc("coach_subscription_allows_edit", {
    p_user_id: userId,
    p_team_id: teamId,
  });

  if (rpcError) {
    console.error("[loadBuilderBillingContext] coach_subscription_allows_edit:", rpcError.message);
  }

  let canEdit = rpcError ? ent.teamsUsed <= 1 : Boolean(canEditRaw);
  const billingActive = ent.billingActive;

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

  /** Academy upsell only when the coach already has more than one team page. */
  const showUpgradeCta = !isAcademy && ent.teamsUsed > 1;

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
