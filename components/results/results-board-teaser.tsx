"use client";

import { effectiveBlockLayout } from "@/lib/blocks/block-layout";
import { contentLevelForInstance, sectionLevelClass } from "@/lib/blocks/content-hierarchy";
import {
  computeResultsBoard,
  resolveResultsBoardSettings,
  resultsBoardHasContent,
} from "@/lib/blocks/results-board";
import type { BlockInstance, BlockLayout, TeamSpace } from "@/lib/types";
import { SectionAction, SectionBody, SectionFeaturedItem } from "@/components/mts/team-app/dashboard-card";
import { mtsTypeSectionMeta, mtsTypeSectionNote, mtsTypeSectionTitle } from "@/lib/typography";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import { useMemo } from "react";

export function ResultsBoardTeaser({
  team: _team,
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
  const level = contentLevelForInstance(block);
  const settings = useMemo(
    () => resolveResultsBoardSettings(block),
    [block.settings, block.id],
  );
  const data = useMemo(
    () => computeResultsBoard(settings, { categoryId: "all", period: "season" }),
    [settings],
  );

  const hasContent = resultsBoardHasContent(settings);
  const leader = data.leaderboard[0];
  const latest = data.competitions[0];
  const topHighlight = latest?.topThree[0];
  const title = settings.blockTitle?.trim() || "Results";
  const season = settings.seasonName?.trim();

  const achievementTitle = topHighlight
    ? `${topHighlight.medal} ${topHighlight.name}`
    : leader
      ? leader.athleteName
      : latest?.name;

  const achievementMeta = topHighlight
    ? latest?.name
    : leader
      ? `#1 · ${leader.totalPoints} pts`
      : season;

  const achievementNote =
    topHighlight && leader
      ? `Season leader · ${leader.athleteName} · ${leader.totalPoints} pts`
      : !topHighlight && leader && latest
        ? `Latest · ${latest.name}`
        : season && !achievementMeta?.includes(season)
          ? season
          : undefined;

  const motionProps = {
    type: "button" as const,
    onClick: onOpen,
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.03 },
  };

  if (!hasContent || !achievementTitle) {
    return null;
  }

  const compact = layout === "card" || layout === "half";

  return (
    <motion.button
      {...motionProps}
      key={`${block.id}-${layout}`}
      className={cn("team-page-section group w-full text-left", sectionLevelClass(level))}
    >
      <div className="team-page-section__head flex items-center justify-between gap-3">
        <h2 className={mtsTypeSectionTitle}>{title}</h2>
        <span className="team-page-section__action-slot">
          <SectionAction />
        </span>
      </div>
      <SectionBody className={compact ? "mt-0.5" : "mt-1"}>
        <SectionFeaturedItem
          title={achievementTitle}
          meta={achievementMeta || undefined}
          note={compact ? undefined : achievementNote}
        />
        {compact && achievementNote ? (
          <p className={cn(mtsTypeSectionNote, "mt-1 line-clamp-2")}>{achievementNote}</p>
        ) : null}
      </SectionBody>
    </motion.button>
  );
}
