import { getBlockSettings, type RosterPlayer } from "@/lib/blocks/settings";
import type { TeamSpace } from "@/lib/types";

/** Athletes list from Attendance block roster (shared by achievements, results, birthdays). */
export function rosterFromTeam(team: TeamSpace): RosterPlayer[] {
  const att = team.blocks.find((b) => b.type === "attendance");
  if (!att) return [];
  return (getBlockSettings<{ roster: RosterPlayer[] }>(att).roster ?? []).filter((p) => p.name?.trim());
}

/** Lookup athlete photo by roster id or name (lowercase). */
export function athletePhotoMap(team: TeamSpace): Record<string, string> {
  const map: Record<string, string> = {};
  for (const p of rosterFromTeam(team)) {
    const url = p.photoUrl?.trim();
    if (!url) continue;
    if (p.id) map[p.id] = url;
    if (p.name) map[p.name.trim().toLowerCase()] = url;
  }
  return map;
}
