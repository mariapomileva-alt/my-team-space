export type PlanType = "single_team" | "academy";

export type CoachSubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled"
  | "expired"
  | "unpaid"
  | "inactive";

export type CoachSubscription = {
  userId: string;
  lemonCustomerId: string | null;
  lemonSubscriptionId: string | null;
  lemonVariantId: string | null;
  planType: PlanType | null;
  subscriptionStatus: CoachSubscriptionStatus;
  teamLimit: number | null;
  currentTeamCount: number;
  primaryTeamId: string | null;
};

export type CoachEntitlements = {
  subscription: CoachSubscription | null;
  canCreateTeam: boolean;
  canEditAnyTeam: boolean;
  teamLimit: number;
  teamsUsed: number;
  needsPrimaryTeamSelection: boolean;
  billingActive: boolean;
  planLabel: string;
};
