"use client";

import {
  AchievementsRail,
  AnnouncementDashboardCard,
  AttendanceDashboardCard,
  CompactStatCard,
  PaymentDashboardCard,
  QuickActionsDashboardCard,
  TeamShopDashboardCard,
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
import { cn } from "@/lib/utils/cn";

const PAIR_GRID = "dashboard-grid-pair";
const TILE_SHELL = "dashboard-tile-shell";

function SoloWidget({
  team,
  block,
  onOpen,
  index,
  compact,
  featured,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpen: (id: string) => void;
  index: number;
  compact?: boolean;
  featured?: boolean;
}) {
  const open = () => onOpen(block.id);
  const cardCompact = featured ? false : compact;
  switch (block.type) {
    case "schedule":
      return (
        <ScheduleDashboardCard
          team={team}
          block={block}
          onOpen={open}
          index={index}
          compact={cardCompact}
          featured={featured}
        />
      );
    case "attendance":
      return (
        <AttendanceDashboardCard
          team={team}
          block={block}
          onOpen={open}
          index={index}
          compact={cardCompact}
          featured={featured}
        />
      );
    case "camp_trip":
      return <TripsDashboardCard team={team} block={block} onOpen={open} index={index} />;
    case "documents":
      return <RulesDashboardCard team={team} block={block} onOpen={open} index={index} />;
    case "polls":
      return <PollDashboardCard team={team} block={block} onOpen={open} index={index} />;
    case "team_feed":
      return <AnnouncementDashboardCard team={team} block={block} onOpen={open} index={index} />;
    case "payments":
      return (
        <PaymentDashboardCard
          team={team}
          block={block}
          onOpen={open}
          index={index}
          compact={cardCompact}
          featured={featured}
        />
      );
    case "quick_actions":
      return (
        <QuickActionsDashboardCard
          team={team}
          block={block}
          onOpen={open}
          index={index}
          compact={cardCompact}
          featured={featured}
        />
      );
    case "team_shop":
      return (
        <TeamShopDashboardCard
          team={team}
          block={block}
          onOpen={open}
          index={index}
          compact={cardCompact}
          featured={featured}
        />
      );
    default:
      return (
        <CompactStatCard
          team={team}
          block={block}
          onOpen={open}
          index={index}
          compact={cardCompact}
          featured={featured}
        />
      );
  }
}

function PairCell({
  team,
  block,
  variant,
  side,
  onOpen,
  index,
  compact = true,
}: {
  team: TeamSpace;
  block: BlockInstance;
  variant: "schedule-attendance" | "trips-rules" | "poll-announcement";
  side: "left" | "right";
  onOpen: (id: string) => void;
  index: number;
  compact?: boolean;
}) {
  if (variant === "schedule-attendance") {
    return side === "left" ? (
      <ScheduleDashboardCard
        team={team}
        block={block}
        onOpen={() => onOpen(block.id)}
        index={index}
        compact={compact}
      />
    ) : (
      <AttendanceDashboardCard
        team={team}
        block={block}
        onOpen={() => onOpen(block.id)}
        index={index}
        compact={compact}
      />
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
    <div data-preview-block-id={blockId} className={cn(TILE_SHELL, "rounded-[inherit]")}>
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
  const rowWrap = (content: React.ReactNode) => (
    <div className={cn("team-page-row", rowIndex > 0 && "team-page-row--divided")}>{content}</div>
  );

  if (row.kind === "results") {
    const content = (
      <ResultsRail
        team={team}
        block={row.block}
        onOpen={() => onOpen(row.block.id)}
        index={base}
        layout={row.layout}
      />
    );
    return rowWrap(<PreviewAnchor blockId={row.block.id}>{content}</PreviewAnchor>);
  }

  if (row.kind === "pair") {
    return rowWrap(
      <div className={PAIR_GRID}>
        <PreviewAnchor blockId={row.left.id}>
          <PairCell
            team={team}
            block={row.left}
            variant={row.variant}
            side="left"
            onOpen={onOpen}
            index={base}
            compact={row.compact}
          />
        </PreviewAnchor>
        <PreviewAnchor blockId={row.right.id}>
          <PairCell
            team={team}
            block={row.right}
            variant={row.variant}
            side="right"
            onOpen={onOpen}
            index={base + 1}
            compact={row.compact}
          />
        </PreviewAnchor>
      </div>,
    );
  }

  if (row.kind === "wide") {
    const minH = row.featured ? "min-h-0" : undefined;
    if (row.variant === "achievements") {
      return rowWrap(
        <PreviewAnchor blockId={row.block.id}>
          <div className={minH}>
            <AchievementsRail team={team} block={row.block} onOpen={() => onOpen(row.block.id)} index={base} />
          </div>
        </PreviewAnchor>,
      );
    }
    if (row.variant === "gallery") {
      return rowWrap(
        <PreviewAnchor blockId={row.block.id}>
          <div className={minH}>
            <GalleryStackCard team={team} block={row.block} onOpen={() => onOpen(row.block.id)} index={base} />
          </div>
        </PreviewAnchor>,
      );
    }
    return rowWrap(
      <PreviewAnchor blockId={row.block.id}>
        <div className={minH}>
          <ResultsRail team={team} block={row.block} onOpen={() => onOpen(row.block.id)} index={base} />
        </div>
      </PreviewAnchor>,
    );
  }

  if (row.kind === "pair-compact") {
    return rowWrap(
      <div className={PAIR_GRID}>
        <PreviewAnchor blockId={row.left.id}>
          <SoloWidget
            team={team}
            block={row.left}
            onOpen={onOpen}
            index={base}
            compact={row.compact}
          />
        </PreviewAnchor>
        <PreviewAnchor blockId={row.right.id}>
          <SoloWidget
            team={team}
            block={row.right}
            onOpen={onOpen}
            index={base + 1}
            compact={row.compact}
          />
        </PreviewAnchor>
      </div>,
    );
  }

  return rowWrap(
    <PreviewAnchor blockId={row.block.id}>
      <SoloWidget
        team={team}
        block={row.block}
        onOpen={onOpen}
        index={base}
        compact={row.compact}
        featured={row.featured}
      />
    </PreviewAnchor>,
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
    <div className="team-page-sections team-app-dashboard mt-7 flex flex-col gap-0 sm:mt-9">
      {rows.map((row, i) => {
        const rowKey =
          row.kind === "results"
            ? `${row.block.id}-${row.layout}`
            : row.kind === "pair"
            ? `${row.left.id}-${row.left.layout}-${row.right.id}-${row.right.layout}`
            : row.kind === "pair-compact"
              ? `${row.left.id}-${row.left.layout}-${row.right.id}-${row.right.layout}`
              : `${row.block.id}-${row.block.layout}-${row.kind}`;
        return (
          <DashboardRowView key={rowKey} row={row} team={team} onOpen={onOpenBlock} rowIndex={i} />
        );
      })}
    </div>
  );
}
