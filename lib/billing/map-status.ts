import type { CoachSubscriptionStatus } from "@/lib/billing/types";

/** Map Lemon Squeezy subscription.status → coach_subscriptions.subscription_status */
export function lemonStatusToCoachStatus(lsStatus: string | undefined): CoachSubscriptionStatus {
  switch (lsStatus) {
    case "active":
      return "active";
    case "on_trial":
      return "trialing";
    case "past_due":
      return "past_due";
    case "cancelled":
      return "cancelled";
    case "expired":
      return "expired";
    case "unpaid":
      return "unpaid";
    case "paused":
    default:
      return "inactive";
  }
}

export function coachStatusAllowsEdit(status: CoachSubscriptionStatus): boolean {
  return status === "active" || status === "trialing";
}

export function coachStatusAllowsBillingFeatures(status: CoachSubscriptionStatus): boolean {
  return coachStatusAllowsEdit(status);
}

/** Denormalized teams.subscription_status (legacy CHECK values). */
export function coachStatusToTeamStatus(status: CoachSubscriptionStatus): string {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "cancelled":
    case "expired":
      return "canceled";
    default:
      return "inactive";
  }
}
