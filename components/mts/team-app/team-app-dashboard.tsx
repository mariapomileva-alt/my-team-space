"use client";

import {
  AchievementsRail,
  AnnouncementDashboardCard,
  AttendanceDashboardCard,
  CompactStatCard,
  GalleryStackCard,
  PollDashboardCard,
  ResultsRail,
  RulesDashboardCard,
  ScheduleDashboardCard,
  TripsDashboardCard,
} from "@/components/mts/team-app/dashboard-widgets";
import { buildDashboardRows, type DashboardRow } from "@/lib/blocks/dashboard-layout";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import type { ReactNode } from "react";

function SoloWidget({
  team,
  block,
  onOpen,
  index,
  compact,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: (id: string) => void;
  index: number;
  compact?: boolean;
}) {
  const open = () => onOpen(block.id);
  switch (block.type) {
    case "schedule":
      return <ScheduleDashboardCard team={team} block={block} onOpen={open} index={index} compact={compact} />;
    case "attendance":
      return <AttendanceDashboardCard team={team} block={block} onOpen={open} index={index} compact={compact} />;
    case "camp_trip":
      return <TripsDashboardCard team={team} block={block} onOpen={open} index={index} />;
    case "documents":
      return <RulesDashboardCard team={team} block={block} onOpen={open} index={index} />;
    case "polls":
      return <PollDashboardCard team={team} block={block} onOpen={open} index={index} />;
    case "team_feed":
      return <AnnouncementDashboardCard team={team} block={block} onOpen={open} index={index} />;
    default:
      return <CompactStatCard team={team} block={block} onOpen={open} index={index} />;
  }
}

function PairCell({
  team,
  block,
  variant,
  side,
  onOpen,
  index,
}: {
  team: TeamSpace;
  block: BlockInstance;
  variant: "schedule-attendance" | "trips-rules" | "poll-announcement";
  side: "left" | "right";
  onOpen: (id: string) => void;
  index: number;
}) {
  if (variant === "schedule-attendance") {
    return side === "left" ? (
      <ScheduleDashboardCard team={team} block={block} onOpen={() => onOpen(block.id)} index={index} compact />
    ) : (
      <AttendanceDashboardCard team={team} block={block} onOpen={() => onOpen(block.id)} index={index} compact />
    );
  }
  if (variant === "trips-rules") {
    return side === "left" ? (
      <TripsDashboardCard team={team} block={block} onOpen={() => onOpen(block.id)} index={index} />
    ) : (
      <RulesDashboardCard team={team} block={block} onOpen={() => onOpen(block.id)} index={index} />
    );
  }
  return side === "left" ? (
    <PollDashboardCard team={team} block={block} onOpen={() => onOpen(block.id)} index={index} />
  ) : (
    <AnnouncementDashboardCard team={team} block={block} onOpen={() => onOpen(block.id)} index={index} />
  );
}

function PreviewAnchor({ blockId, children }: { blockId: string; children: React.ReactNode }) {
  return (
    <div data-preview-block-id={blockId} className="h-full rounded-[inherit]">
      {children}
    </div>
  );
}

function DashboardRowView({
  row,
  team,
  onOpen,
  rowIndex,
}: {
  row: DashboardRow;
  team: TeamSpace;
  onOpen: (id: string) => void;
  rowIndex: number;
}) {
  const base = rowIndex * 2;

  if (row.kind === "pair") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        <PreviewAnchor blockId={row.left.id}>
          <div className="min-h-[148px]">
            <PairCell team={team} block={row.left} variant={row.variant} side="left" onOpen={onOpen} index={base} />
          </div>
        </PreviewAnchor>
        <PreviewAnchor blockId={row.right.id}>
          <div className="min-h-[148px]">
            <PairCell team={team} block={row.right} variant={row.variant} side="right" onOpen={onOpen} index={base + 1} />
          </div>
        </PreviewAnchor>
      </div>
    );
  }

  if (row.kind === "wide") {
    if (row.variant === "achievements") {
      return (
        <PreviewAnchor blockId={row.block.id}>
          <AchievementsRail team={team} block={row.block} onOpen={() => onOpen(row.block.id)} index={base} />
        </PreviewAnchor>
      );
    }
    if (row.variant === "gallery") {
      return (
        <PreviewAnchor blockId={row.block.id}>
          <GalleryStackCard team={team} block={row.block} onOpen={() => onOpen(row.block.id)} index={base} />
        </PreviewAnchor>
      );
    }
    return (
      <PreviewAnchor blockId={row.block.id}>
        <ResultsRail team={team} block={row.block} onOpen={() => onOpen(row.block.id)} index={base} />
      </PreviewAnchor>
    );
  }

  if (row.kind === "pair-compact") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        <PreviewAnchor blockId={row.left.id}>
          <div className="min-h-[108px]">
            <SoloWidget team={team} block={row.left} onOpen={onOpen} index={base} compact />
          </div>
        </PreviewAnchor>
        <PreviewAnchor blockId={row.right.id}>
          <div className="min-h-[108px]">
            <SoloWidget team={team} block={row.right} onOpen={onOpen} index={base + 1} compact />
          </div>
        </PreviewAnchor>
      </div>
    );
  }

  return (
    <PreviewAnchor blockId={row.block.id}>
      <SoloWidget team={team} block={row.block} onOpen={onOpen} index={base} />
    </PreviewAnchor>
  );
}

export function TeamAppDashboard({
  team,
  blocks,
  onOpenBlock,
}: {
  team: TeamSpace;
  blocks: BlockInstance[];
  onOpenBlock: (id: string) => void;
  previewBlockId?: string | null;
}) {
  const rows = buildDashboardRows(blocks);

  return (
    <div className="team-app-dashboard mt-4 flex flex-col gap-3 sm:gap-3.5">
      {rows.map((row, i) => (
        <DashboardRowView key={`row-${i}-${row.kind}`} row={row} team={team} onOpen={onOpenBlock} rowIndex={i} />
      ))}
    </div>
  );
}
