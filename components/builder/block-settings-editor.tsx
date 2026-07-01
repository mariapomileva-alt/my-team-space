"use client";

import { BlockAudiencePicker } from "@/components/builder/block-audience-picker";
import { effectiveBlockLayout, normalizeBuilderLayout } from "@/lib/blocks/block-layout";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { AnnouncementBarEditor } from "./editors/announcement-bar-editor";
import { AchievementsEditor } from "./editors/achievements-editor";
import { GalleryEditor } from "./editors/gallery-editor";
import { HeroIdentityEditor } from "./editors/hero-identity-editor";
import { LayoutPicker } from "./editors/layout-picker";
import { LogisticsEditor } from "./editors/logistics-editor";
import { PollsEditor } from "./editors/polls-editor";
import { RosterEditor } from "./editors/roster-editor";
import { ScheduleEditor } from "./editors/schedule-editor";
import { ResultsBoardEditor } from "./editors/results-board-editor";
import { SimpleBlocksEditor } from "./editors/simple-blocks-editor";
import { QuickLinksEditor } from "./editors/quick-links-editor";
import { PaymentLinkEditor } from "./editors/payment-link-editor";
import { QuickActionsEditor } from "./editors/quick-actions-editor";
import { TeamShopEditor } from "./editors/team-shop-editor";
import { EmbedEditor } from "./editors/embed-editor";
import { ResourcesEditor } from "./editors/resources-editor";

type Props = {
  block: BlockInstance;
  team: TeamSpace;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
  onPatchLogo?: (url: string) => void;
  onPreviewBlock?: (id: string) => void;
};

const SIMPLE_TYPES = new Set([
  "contacts",
  "documents",
  "team_feed",
  "sponsors",
  "countdown",
  "weather",
]);

export function BlockSettingsEditor({ block, team, onPatchBlock, onPatchTeam, onPatchLogo, onPreviewBlock }: Props) {
  return (
    <div className="space-y-4 border-t border-indigo-100/60 bg-gradient-to-b from-indigo-50/25 via-white to-white px-4 py-5 sm:px-5">
      <BlockAudiencePicker team={team} block={block} onPatchBlock={onPatchBlock} />
      <LayoutPicker
        layout={normalizeBuilderLayout(effectiveBlockLayout(block))}
        onChange={(layout) => {
          onPatchBlock(block.id, { layout });
          onPreviewBlock?.(block.id);
        }}
      />

      {block.type === "announcement_bar" ? (
        <AnnouncementBarEditor block={block} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "hero" ? (
        <HeroIdentityEditor
          block={block}
          team={team}
          onPatchBlock={onPatchBlock}
          onPatchTeam={onPatchTeam}
          onPatchLogo={onPatchLogo}
        />
      ) : null}
      {block.type === "quick_links" ? <QuickLinksEditor block={block} onPatchBlock={onPatchBlock} /> : null}
      {block.type === "payments" ? <PaymentLinkEditor block={block} onPatchBlock={onPatchBlock} /> : null}
      {block.type === "quick_actions" ? (
        <QuickActionsEditor block={block} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "team_shop" ? (
        <TeamShopEditor block={block} teamId={team.id} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "schedule" || block.type === "calendar" ? (
        <ScheduleEditor block={block} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "gallery" ? (
        <GalleryEditor block={block} teamId={team.id} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "integrations" ? <EmbedEditor block={block} onPatchBlock={onPatchBlock} /> : null}
      {block.type === "resources" ? (
        <ResourcesEditor block={block} teamId={team.id} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "achievements" ? (
        <AchievementsEditor block={block} team={team} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "results" ? (
        <ResultsBoardEditor block={block} team={team} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "attendance" || block.type === "birthdays" ? (
        <RosterEditor block={block} team={team} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "camp_trip" ? <LogisticsEditor block={block} onPatchBlock={onPatchBlock} /> : null}
      {block.type === "polls" ? (
        <PollsEditor block={block} team={team} onPatchBlock={onPatchBlock} onPatchTeam={onPatchTeam} />
      ) : null}
      {SIMPLE_TYPES.has(block.type) ? (
        <SimpleBlocksEditor block={block} teamId={team.id} onPatchBlock={onPatchBlock} />
      ) : null}
    </div>
  );
}
