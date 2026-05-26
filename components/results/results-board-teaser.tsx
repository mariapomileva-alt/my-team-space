"use client";

import { athletePhotoMap } from "@/lib/blocks/roster";
import {
  computeResultsBoard,
  getResultsBoardSettings,
  resultsBoardHasContent,
} from "@/lib/blocks/results-board";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { motion } from "framer-motion";
import { useMemo } from "react";

function TeaserAvatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-amber-200/80 shadow-md"
      />
    );
  }
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white shadow-md ring-2 ring-white">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function ResultsBoardTeaser({
  team,
  block,
  onOpen,
  index = 0,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index?: number;
}) {
  const settings = useMemo(() => getResultsBoardSettings(block), [block.settings, block.id]);
  const photos = athletePhotoMap(team);
  const data = useMemo(
    () => computeResultsBoard(settings, { categoryId: "all", period: "season" }),
    [settings],
  );

  const hasContent = resultsBoardHasContent(settings);
  const leader = data.leaderboard[0];
  const latest = data.competitions[0];
  const topHighlight = latest?.topThree[0];
  const miniBoard = data.leaderboard.slice(0, 3);
  const totalMedals = data.leaderboard.reduce((s, r) => s + r.gold + r.silver + r.bronze, 0);
  const leaderPhoto = leader
    ? photos[leader.athleteId] ?? photos[leader.athleteName.toLowerCase()]
    : undefined;
  const title = settings.blockTitle?.trim() || "Results";

  if (!hasContent) {
    return (
      <motion.button
        type="button"
        onClick={onOpen}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="col-span-1 w-full rounded-[1.35rem] border border-dashed border-neutral-200 bg-neutral-50/80 p-4 text-left active:scale-[0.99] sm:col-span-2"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{title}</p>
        <p className="mt-2 text-sm font-semibold text-neutral-700">Season results on the way</p>
        <p className="mt-1 text-[12px] text-neutral-500">Competitions and medals will show up here automatically.</p>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="col-span-1 w-full overflow-hidden rounded-[1.35rem] border border-amber-100/80 bg-gradient-to-br from-amber-50/90 via-white to-violet-50/40 p-4 text-left shadow-[0_8px_32px_-16px_rgba(251,191,36,0.25)] ring-1 ring-amber-100/60 active:scale-[0.99] sm:col-span-2"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800/70">{settings.seasonName}</p>
        <span className="text-[11px] font-semibold text-indigo-600">View full leaderboard ›</span>
      </div>

      {leader ? (
        <div className="mt-3 flex items-center gap-3">
          <TeaserAvatar name={leader.athleteName} photoUrl={leaderPhoto} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700/80">Season leader</p>
            <p className="truncate text-base font-bold text-neutral-900">{leader.athleteName}</p>
            <p className="mt-0.5 text-[12px] font-semibold text-indigo-700">
              {leader.totalPoints} pts · 🥇 {leader.gold} · 🥈 {leader.silver} · 🥉 {leader.bronze}
            </p>
          </div>
        </div>
      ) : null}

      {latest ? (
        <div className="mt-3 rounded-xl border border-white/80 bg-white/70 px-3 py-2.5 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">Latest competition</p>
          <p className="mt-1 text-[13px] font-bold text-neutral-900">{latest.name}</p>
          {topHighlight ? (
            <p className="mt-0.5 text-[12px] text-neutral-600">
              {topHighlight.medal} {topHighlight.name}
              {topHighlight.place === 1 ? " won gold" : topHighlight.place === 2 ? " got silver" : " took bronze"}
            </p>
          ) : null}
        </div>
      ) : null}

      {miniBoard.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {miniBoard.map((row) => (
            <li
              key={row.athleteKey}
              className="flex items-center justify-between rounded-lg bg-white/60 px-2.5 py-1.5 text-[12px]"
            >
              <span className="font-semibold text-neutral-800">
                <span className="mr-1.5 tabular-nums text-neutral-400">#{row.rank}</span>
                {row.athleteName}
              </span>
              <span className="font-bold tabular-nums text-indigo-700">{row.totalPoints}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-neutral-700 ring-1 ring-neutral-100">
          {totalMedals} team medals
        </span>
        {leader?.badges.slice(0, 2).map((b) => (
          <span
            key={b}
            className="rounded-full bg-amber-100/90 px-2.5 py-1 text-[10px] font-semibold text-amber-900 ring-1 ring-amber-200/60"
          >
            {data.badgeLabels[b] ?? b}
          </span>
        ))}
      </div>

      {leader ? (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[10px] font-medium text-neutral-500">
            <span>Season progress</span>
            <span>{leader.progressPercent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-indigo-500"
              style={{ width: `${leader.progressPercent}%` }}
            />
          </div>
        </div>
      ) : null}
    </motion.button>
  );
}
