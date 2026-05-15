"use client";

import type { BlockInstance, TeamSpace } from "@/lib/types";
import { AnnouncementBarEditor } from "./editors/announcement-bar-editor";
import { AchievementsEditor } from "./editors/achievements-editor";
import { GalleryEditor } from "./editors/gallery-editor";
import { HeroIdentityEditor } from "./editors/hero-identity-editor";
import { LayoutPicker } from "./editors/layout-picker";
import { PlaceholderEditor } from "./editors/placeholder-editor";
import { QuickLinksEditor } from "./editors/quick-links-editor";
import { RosterEditor } from "./editors/roster-editor";
import { ScheduleEditor } from "./editors/schedule-editor";

type Props = {
  block: BlockInstance;
  team: TeamSpace;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
};

const RICH_EDITORS = new Set([
  "announcement_bar",
  "hero",
  "quick_links",
  "schedule",
  "calendar",
  "gallery",
  "achievements",
  "attendance",
  "birthdays",
]);

export function BlockSettingsEditor({ block, team, onPatchBlock, onPatchTeam }: Props) {
  return (
    <div className="space-y-4 border-t border-zinc-100 bg-gradient-to-b from-indigo-50/30 to-white px-4 py-4 sm:px-5">
      <LayoutPicker
        layout={block.layout ?? "full"}
        onChange={(layout) => onPatchBlock(block.id, { layout })}
      />

      {block.type === "announcement_bar" ? (
        <AnnouncementBarEditor block={block} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "hero" ? (
        <HeroIdentityEditor block={block} team={team} onPatchBlock={onPatchBlock} onPatchTeam={onPatchTeam} />
      ) : null}
      {block.type === "quick_links" ? <QuickLinksEditor block={block} onPatchBlock={onPatchBlock} /> : null}
      {block.type === "schedule" || block.type === "calendar" ? (
        <ScheduleEditor block={block} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "gallery" ? <GalleryEditor block={block} onPatchBlock={onPatchBlock} /> : null}
      {block.type === "achievements" ? (
        <AchievementsEditor block={block} team={team} onPatchBlock={onPatchBlock} />
      ) : null}
      {block.type === "attendance" || block.type === "birthdays" ? (
        <RosterEditor block={block} team={team} onPatchBlock={onPatchBlock} />
      ) : null}

      {!RICH_EDITORS.has(block.type) ? <PlaceholderEditor type={block.type} /> : null}
    </div>
  );
}
