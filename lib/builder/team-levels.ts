import { builderCompletionPercent } from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";

export type TeamLevelId = "rookie" | "growing" | "active" | "established" | "elite";

export type TeamLevel = {
  id: TeamLevelId;
  emoji: string;
  label: string;
  tagline: string;
  minPercent: number;
};

export const TEAM_LEVELS: TeamLevel[] = [
  { id: "rookie", emoji: "🚀", label: "Rookie Team", tagline: "Your digital home is taking shape", minPercent: 0 },
  { id: "growing", emoji: "⭐", label: "Growing Team", tagline: "Parents can already see who you are", minPercent: 35 },
  { id: "active", emoji: "🏆", label: "Active Team", tagline: "A living page with real team content", minPercent: 55 },
  { id: "established", emoji: "🥇", label: "Established Team", tagline: "Trusted by families and athletes", minPercent: 75 },
  { id: "elite", emoji: "👑", label: "Elite Team", tagline: "A complete digital home for your team", minPercent: 90 },
];

export function getTeamLevel(team: TeamSpace): TeamLevel {
  const percent = builderCompletionPercent(team);
  let level = TEAM_LEVELS[0]!;
  for (const candidate of TEAM_LEVELS) {
    if (percent >= candidate.minPercent) level = candidate;
  }
  return level;
}

export function getNextTeamLevel(current: TeamLevel): TeamLevel | null {
  const idx = TEAM_LEVELS.findIndex((l) => l.id === current.id);
  if (idx < 0 || idx >= TEAM_LEVELS.length - 1) return null;
  return TEAM_LEVELS[idx + 1] ?? null;
}
