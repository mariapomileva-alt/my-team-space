import { lemonStatusToCoachStatus, coachStatusToTeamStatus } from "@/lib/billing/map-status";

/** @deprecated use lemonStatusToCoachStatus — kept for team-level helpers */
export function lemonStatusToTeamStatus(lsStatus: string | undefined): string {
  return coachStatusToTeamStatus(lemonStatusToCoachStatus(lsStatus));
}

export { lemonStatusToCoachStatus };
