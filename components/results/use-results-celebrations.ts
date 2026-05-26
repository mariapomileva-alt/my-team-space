"use client";

import {
  diffResultsCelebrations,
  loadResultsSnapshot,
  resultsSnapshotKey,
  saveResultsSnapshot,
  type ResultsCelebrationMap,
} from "@/lib/results/celebrations";
import type { LeaderboardRow } from "@/lib/blocks/results-board";
import { useEffect, useMemo, useState } from "react";

const SAVE_DELAY_MS = 1400;

export function useResultsCelebrations({
  enabled,
  teamSlug,
  blockId,
  categoryId,
  period,
  leaderboard,
}: {
  enabled: boolean;
  teamSlug?: string;
  blockId: string;
  categoryId: string;
  period: string;
  leaderboard: LeaderboardRow[];
}) {
  const [map, setMap] = useState<ResultsCelebrationMap>({});
  const [heroNewLeader, setHeroNewLeader] = useState(false);
  const [ready, setReady] = useState(false);

  const leaderboardKey = useMemo(
    () =>
      leaderboard
        .map((r) => `${r.athleteKey}:${r.rank}:${r.totalPoints}:${r.gold}${r.silver}${r.bronze}:${r.badges.join(".")}`)
        .join("|"),
    [leaderboard],
  );

  useEffect(() => {
    if (!enabled || !teamSlug) {
      setMap({});
      setHeroNewLeader(false);
      setReady(true);
      return;
    }

    const key = resultsSnapshotKey({ teamSlug, blockId, categoryId, period });
    const previous = loadResultsSnapshot(key);
    const { map: next, heroNewLeader: leader } = diffResultsCelebrations(leaderboard, previous);
    setMap(next);
    setHeroNewLeader(leader);
    setReady(true);

    const t = window.setTimeout(() => saveResultsSnapshot(key, leaderboard), SAVE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [enabled, teamSlug, blockId, categoryId, period, leaderboardKey, leaderboard]);

  return { celebrations: map, heroNewLeader, ready };
}
