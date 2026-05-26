import type { LeaderboardRow } from "@/lib/blocks/results-board";

export type AthleteCelebration = {
  newLeader: boolean;
  firstMedal: boolean;
  personalBest: boolean;
  rankUp: boolean;
  newBadges: string[];
};

export type ResultsCelebrationMap = Record<string, AthleteCelebration>;

type SnapshotAthlete = {
  rank: number;
  badges: string[];
  medals: number;
  points: number;
};

export type ResultsSnapshot = {
  leaderKey: string | null;
  athletes: Record<string, SnapshotAthlete>;
};

export function resultsSnapshotKey(parts: {
  teamSlug: string;
  blockId: string;
  categoryId: string;
  period: string;
}): string {
  return `mts-results:${parts.teamSlug}:${parts.blockId}:${parts.categoryId}:${parts.period}`;
}

export function loadResultsSnapshot(key: string): ResultsSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResultsSnapshot;
    if (!parsed || typeof parsed !== "object" || !parsed.athletes) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveResultsSnapshot(key: string, leaderboard: LeaderboardRow[]): void {
  if (typeof window === "undefined") return;
  try {
    const leader = leaderboard.find((r) => r.rank === 1);
    const athletes: ResultsSnapshot["athletes"] = {};
    for (const r of leaderboard) {
      athletes[r.athleteKey] = {
        rank: r.rank,
        badges: [...r.badges],
        medals: r.gold + r.silver + r.bronze,
        points: r.totalPoints,
      };
    }
    const snap: ResultsSnapshot = {
      leaderKey: leader?.athleteKey ?? null,
      athletes,
    };
    localStorage.setItem(key, JSON.stringify(snap));
  } catch {
    /* quota / private mode */
  }
}

export function diffResultsCelebrations(
  leaderboard: LeaderboardRow[],
  previous: ResultsSnapshot | null,
): { map: ResultsCelebrationMap; heroNewLeader: boolean } {
  const map: ResultsCelebrationMap = {};
  if (!previous || leaderboard.length === 0) {
    return { map, heroNewLeader: false };
  }

  const currentLeader = leaderboard.find((r) => r.rank === 1);
  const heroNewLeader = Boolean(
    currentLeader &&
      previous.leaderKey &&
      currentLeader.athleteKey !== previous.leaderKey,
  );

  for (const row of leaderboard) {
    const prev = previous.athletes[row.athleteKey];
    if (!prev) continue;

    const medals = row.gold + row.silver + row.bronze;
    const newBadges = row.badges.filter((b) => !prev.badges.includes(b));
    const rankUp = row.rank < prev.rank;
    const firstMedal = prev.medals === 0 && medals > 0;
    const personalBest = row.badges.includes("personal_best") && !prev.badges.includes("personal_best");
    const newLeader = heroNewLeader && row.rank === 1;

    if (newLeader || firstMedal || personalBest || rankUp || newBadges.length > 0) {
      map[row.athleteKey] = {
        newLeader,
        firstMedal,
        personalBest,
        rankUp,
        newBadges,
      };
    }
  }

  return { map, heroNewLeader };
}

export function emptyCelebration(): AthleteCelebration {
  return {
    newLeader: false,
    firstMedal: false,
    personalBest: false,
    rankUp: false,
    newBadges: [],
  };
}

export function getCelebration(rowKey: string, map: ResultsCelebrationMap): AthleteCelebration {
  return map[rowKey] ?? emptyCelebration();
}
