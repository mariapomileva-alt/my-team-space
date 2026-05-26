import { getBlockSettings, type RosterPlayer } from "@/lib/blocks/settings";
import type { TeamSpace } from "@/lib/types";

/** Athletes list from Attendance block roster (shared by achievements, results, birthdays). */
export function rosterFromTeam(team: TeamSpace): RosterPlayer[] {
  const att = team.blocks.find((b) => b.type === "attendance");
  if (!att) return [];
  return (getBlockSettings<{ roster: RosterPlayer[] }>(att).roster ?? []).filter((p) => p.name?.trim());
}
