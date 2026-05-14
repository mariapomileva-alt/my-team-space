/** Map Lemon Squeezy subscription.status to teams.subscription_status CHECK values. */
export function lemonStatusToTeamStatus(lsStatus: string | undefined): string {
  switch (lsStatus) {
    case "active":
      return "active";
    case "on_trial":
      return "trialing";
    case "past_due":
      return "past_due";
    case "cancelled":
    case "expired":
      return "canceled";
    case "paused":
    case "unpaid":
    default:
      return "inactive";
  }
}
