"use client";

import { effectiveBlockLayout } from "@/lib/blocks/block-layout";
import { athletePhotoMap } from "@/lib/blocks/roster";
import {
  computeResultsBoard,
  resolveResultsBoardSettings,
  resultsBoardHasContent,
} from "@/lib/blocks/results-board";
import type { BlockInstance, BlockLayout, TeamSpace } from "@/lib/types";
import { SectionAction, SectionListRow } from "@/components/mts/team-app/dashboard-card";
import { mtsTypeItemTitle, mtsTypeSectionMeta, mtsTypeSectionNote, mtsTypeSectionTitle } from "@/lib/typography";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import { useMemo } from "react";

function TeaserAvatar({
  name,
  photoUrl,
  size = "lg",
}: {
  name: string;
  photoUrl?: string;
  size?: "sm" | "lg";
}) {
  const cls =
    size === "sm"
      ? "h-10 w-10 rounded-xl text-sm ring-1"
      : "h-14 w-14 rounded-2xl text-lg ring-2";
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className={`${cls} shrink-0 object-cover ring-amber-200/80 shadow-md`}
      />
    );
  }
  return (
    <span
      className={`flex ${cls} shrink-0 items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 font-bold text-white shadow-md ring-white`}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function ResultsBoardTeaser({
  team,
  block,
  onOpen,
  index = 0,
  layout: layoutOverride,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: () => void;
  index?: number;
  layout?: BlockLayout;
}) {
  const layout = layoutOverride ?? effectiveBlockLayout(block);
  const settings = useMemo(
    () => resolveResultsBoardSettings(block),
    [block.settings, block.id],
  );
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
  const leaderPhoto = leader
    ? photos[leader.athleteId] ?? photos[leader.athleteName.toLowerCase()]
    : undefined;
  const title = settings.blockTitle?.trim() || "Results";

  const motionProps = {
    type: "button" as const,
    onClick: onOpen,
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.03 },
  };

  if (!hasContent) {
    return null;
  }

  if (layout === "card") {
    return (
      <motion.button
        {...motionProps}
        key={`${block.id}-card`}
        className="team-page-section group w-full text-left"
      >
        <div className="team-page-section__head flex items-center justify-between gap-3">
          <h2 className={mtsTypeSectionTitle}>{title}</h2>
          <span className="team-page-section__action-slot">
            <SectionAction />
          </span>
        </div>
        <p className={cn(mtsTypeItemTitle, "mt-1")}>{leader?.athleteName ?? settings.seasonName}</p>
        {leader ? (
          <p className={cn(mtsTypeSectionMeta, "mt-1")}>{leader.totalPoints} pts · {settings.seasonName}</p>
        ) : null}
      </motion.button>
    );
  }

  if (layout === "half") {
    return (
      <motion.button
        {...motionProps}
        key={`${block.id}-half`}
        className="team-page-section group w-full text-left"
      >
        <div className="team-page-section__head flex items-center justify-between gap-3">
          <h2 className={mtsTypeSectionTitle}>{title}</h2>
          <span className="team-page-section__action-slot">
            <SectionAction />
          </span>
        </div>
        {leader ? (
          <div className="team-page-section__body mt-1 flex items-center gap-3">
            <TeaserAvatar name={leader.athleteName} photoUrl={leaderPhoto} size="sm" />
            <div className="min-w-0 flex-1">
              <p className={cn(mtsTypeItemTitle, "line-clamp-2")}>{leader.athleteName}</p>
              <p className={cn(mtsTypeSectionMeta, "mt-1")}>{leader.totalPoints} pts</p>
            </div>
          </div>
        ) : null}
        {latest ? (
          <p className={cn(mtsTypeSectionNote, "mt-2 line-clamp-2")}>
            Latest: {latest.name}
            {topHighlight ? ` · ${topHighlight.name}` : ""}
          </p>
        ) : null}
      </motion.button>
    );
  }

  if (layout === "full") {
    return (
      <motion.button
        {...motionProps}
        key={`${block.id}-full`}
        className="team-page-section group w-full text-left"
      >
        <div className="team-page-section__head flex items-center justify-between gap-3">
          <h2 className={mtsTypeSectionTitle}>{title}</h2>
          <span className="team-page-section__action-slot">
            <SectionAction />
          </span>
        </div>
        <p className={cn(mtsTypeSectionNote, "mt-0.5")}>{settings.seasonName}</p>
        {leader ? (
          <div className="team-page-section__featured mt-2 flex items-center gap-3">
            <TeaserAvatar name={leader.athleteName} photoUrl={leaderPhoto} />
            <div className="min-w-0 flex-1">
              <p className={mtsTypeItemTitle}>{leader.athleteName}</p>
              <p className={cn(mtsTypeSectionMeta, "mt-0.5")}>
                {leader.totalPoints} pts
                {leader.gold + leader.silver + leader.bronze > 0
                  ? ` · ${leader.gold}🥇 ${leader.silver}🥈 ${leader.bronze}🥉`
                  : ""}
              </p>
            </div>
          </div>
        ) : null}
        {miniBoard.length > 0 ? (
          <div className="mt-3 border-t border-[color:var(--mts-section-divider,var(--mts-card-border))] pt-1">
            {miniBoard.map((row) => (
              <SectionListRow
                key={row.athleteKey}
                title={`#${row.rank} ${row.athleteName}`}
                meta={String(row.totalPoints)}
              />
            ))}
          </div>
        ) : null}
      </motion.button>
    );
  }

  // Featured — richest section
  return (
    <motion.button
      {...motionProps}
      key={`${block.id}-featured`}
      className="team-page-section group w-full text-left"
    >
      <div className="team-page-section__head flex items-center justify-between gap-3">
        <h2 className={mtsTypeSectionTitle}>{title}</h2>
        <span className="team-page-section__action-slot">
          <SectionAction />
        </span>
      </div>
      <p className={cn(mtsTypeSectionNote, "mt-0.5")}>{settings.seasonName}</p>

      {leader ? (
        <div className="team-page-section__featured mt-2 flex items-center gap-3">
          <TeaserAvatar name={leader.athleteName} photoUrl={leaderPhoto} />
          <div className="min-w-0 flex-1">
            <p className={mtsTypeItemTitle}>{leader.athleteName}</p>
            <p className={cn(mtsTypeSectionMeta, "mt-0.5")}>
              {leader.totalPoints} pts
              {leader.gold + leader.silver + leader.bronze > 0
                ? ` · ${leader.gold}🥇 ${leader.silver}🥈 ${leader.bronze}🥉`
                : ""}
            </p>
          </div>
        </div>
      ) : null}

      {latest ? (
        <div className="mt-3">
          <p className={mtsTypeSectionNote}>Latest competition</p>
          <p className={cn(mtsTypeItemTitle, "mt-1")}>{latest.name}</p>
          {topHighlight ? (
            <p className={cn(mtsTypeSectionMeta, "mt-0.5")}>
              {topHighlight.medal} {topHighlight.name}
            </p>
          ) : null}
        </div>
      ) : null}

      {miniBoard.length > 0 ? (
        <div className="mt-3 border-t border-[color:var(--mts-section-divider,var(--mts-card-border))] pt-1">
          {miniBoard.map((row) => (
            <SectionListRow
              key={row.athleteKey}
              title={`#${row.rank} ${row.athleteName}`}
              meta={String(row.totalPoints)}
            />
          ))}
        </div>
      ) : null}
    </motion.button>
  );
}
