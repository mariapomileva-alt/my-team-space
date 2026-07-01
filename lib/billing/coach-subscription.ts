import { ACADEMY_TEAM_LIMIT } from "@/lib/billing/config";
import { coachStatusAllowsBillingFeatures, coachStatusAllowsEdit } from "@/lib/billing/map-status";
import type {
  CoachEntitlements,
  CoachSubscription,
  CoachSubscriptionStatus,
  PlanType,
} from "@/lib/billing/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type CoachSubRow = {
  user_id: string;
  lemon_customer_id: string | null;
  lemon_subscription_id: string | null;
  lemon_variant_id: string | null;
  plan_type: PlanType | null;
  subscription_status: CoachSubscriptionStatus;
  team_limit: number | null;
  current_team_count: number;
  primary_team_id: string | null;
  current_period_end: string | null;
};

export function mapCoachSubscriptionRow(row: CoachSubRow): CoachSubscription {
  return {
    userId: row.user_id,
    lemonCustomerId: row.lemon_customer_id,
    lemonSubscriptionId: row.lemon_subscription_id,
    lemonVariantId: row.lemon_variant_id,
    planType: row.plan_type,
    subscriptionStatus: row.subscription_status,
    teamLimit: row.team_limit,
    currentTeamCount: row.current_team_count ?? 0,
    primaryTeamId: row.primary_team_id,
    currentPeriodEnd: row.current_period_end,
  };
}

export async function loadCoachSubscription(
  supabase: SupabaseClient,
  userId: string,
): Promise<CoachSubscription | null> {
  const fullColumns =
    "user_id, lemon_customer_id, lemon_subscription_id, lemon_variant_id, plan_type, subscription_status, team_limit, current_team_count, primary_team_id, current_period_end";

  const { data, error } = await supabase
    .from("coach_subscriptions")
    .select(fullColumns)
    .eq("user_id", userId)
    .maybeSingle();

  if (!error && data) return mapCoachSubscriptionRow(data as CoachSubRow);

  const missingPeriodEnd =
    error?.message?.includes("current_period_end") || error?.code === "42703";
  if (missingPeriodEnd) {
    const { data: legacy, error: legacyErr } = await supabase
      .from("coach_subscriptions")
      .select(
        "user_id, lemon_customer_id, lemon_subscription_id, lemon_variant_id, plan_type, subscription_status, team_limit, current_team_count, primary_team_id",
      )
      .eq("user_id", userId)
      .maybeSingle();
    if (!legacyErr && legacy) return mapCoachSubscriptionRow(legacy as CoachSubRow);
  }

  if (error) {
    console.error("[loadCoachSubscription]", error.message);
  }
  return null;
}

function effectivePlanType(sub: CoachSubscription | null): PlanType {
  return sub?.planType ?? "single_team";
}

/** Mirrors SQL effective_team_limit — uses live team count when billing is inactive. */
export function effectiveTeamLimit(sub: CoachSubscription | null, teamsUsed: number): number {
  if (!sub) return 1;

  if (!coachStatusAllowsBillingFeatures(sub.subscriptionStatus)) {
    return Math.max(teamsUsed, sub.currentTeamCount, 1);
  }

  const planType = effectivePlanType(sub);
  if (planType === "academy") {
    return sub.teamLimit ?? ACADEMY_TEAM_LIMIT;
  }
  return 1;
}

function planLabel(sub: CoachSubscription | null): string {
  if (effectivePlanType(sub) === "academy") return "Academy Plan";
  return "Team Plan";
}

export function buildCoachEntitlements(
  sub: CoachSubscription | null,
  teamsUsed: number,
  ownedTeamIds: string[],
): CoachEntitlements {
  const teamLimit = effectiveTeamLimit(sub, teamsUsed);
  const billingActive = sub ? coachStatusAllowsEdit(sub.subscriptionStatus) : true;
  const planType = effectivePlanType(sub);
  const isSingleTeam = planType === "single_team";
  const canCreateTeam =
    teamsUsed < teamLimit &&
    (sub ? coachStatusAllowsBillingFeatures(sub.subscriptionStatus) : teamsUsed < 1);

  const needsPrimaryTeamSelection =
    Boolean(
      isSingleTeam &&
        coachStatusAllowsBillingFeatures(sub?.subscriptionStatus ?? "inactive") &&
        ownedTeamIds.length > 1 &&
        !sub?.primaryTeamId,
    ) ||
    Boolean(
      isSingleTeam &&
        ownedTeamIds.length > 1 &&
        sub?.primaryTeamId &&
        !ownedTeamIds.includes(sub.primaryTeamId),
    );

  return {
    subscription: sub,
    canCreateTeam,
    canEditAnyTeam: billingActive,
    teamLimit,
    teamsUsed,
    needsPrimaryTeamSelection,
    billingActive: sub ? coachStatusAllowsEdit(sub.subscriptionStatus) : true,
    planLabel: planLabel(sub),
  };
}

export async function loadCoachEntitlements(
  supabase: SupabaseClient,
  userId: string,
): Promise<CoachEntitlements> {
  const sub = await loadCoachSubscription(supabase, userId);

  const { data: memberships } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("user_id", userId)
    .eq("role", "coach");

  const ownedTeamIds = (memberships ?? []).map((m) => m.team_id as string);
  const teamsUsed = ownedTeamIds.length;

  return buildCoachEntitlements(sub, teamsUsed, ownedTeamIds);
}
