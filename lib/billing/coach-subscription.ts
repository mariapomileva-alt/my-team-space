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
  const { data, error } = await supabase
    .from("coach_subscriptions")
    .select(
      "user_id, lemon_customer_id, lemon_subscription_id, lemon_variant_id, plan_type, subscription_status, team_limit, current_team_count, primary_team_id, current_period_end",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return mapCoachSubscriptionRow(data as CoachSubRow);
}

function effectiveTeamLimit(sub: CoachSubscription | null): number {
  if (!sub?.planType) return 1;
  if (!coachStatusAllowsBillingFeatures(sub.subscriptionStatus)) {
    return sub.currentTeamCount;
  }
  if (sub.planType === "academy") {
    return sub.teamLimit ?? ACADEMY_TEAM_LIMIT;
  }
  return 1;
}

function planLabel(sub: CoachSubscription | null): string {
  if (!sub?.planType) return "Team Plan";
  if (sub.planType === "academy") return "Academy Plan";
  return "Team Plan";
}

export function buildCoachEntitlements(
  sub: CoachSubscription | null,
  teamsUsed: number,
  ownedTeamIds: string[],
): CoachEntitlements {
  const teamLimit = effectiveTeamLimit(sub);
  const billingActive = sub ? coachStatusAllowsEdit(sub.subscriptionStatus) : true;
  const canCreateTeam = teamsUsed < teamLimit && (sub ? coachStatusAllowsBillingFeatures(sub.subscriptionStatus) : teamsUsed < 1);

  const needsPrimaryTeamSelection =
    Boolean(
      sub?.planType === "single_team" &&
        coachStatusAllowsBillingFeatures(sub.subscriptionStatus) &&
        ownedTeamIds.length > 1 &&
        !sub.primaryTeamId,
    ) ||
    Boolean(
      sub?.planType === "single_team" &&
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
