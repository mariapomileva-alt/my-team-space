"use client";

import { BlockSettingsEditor } from "@/components/builder/block-settings-editor";
import { BUILDER_PANEL_SURFACE } from "@/lib/builder/layout";
import {
  getPageStructureNav,
  PAGE_STRUCTURE_BLOCK_MAP,
  type PageStructureNavId,
} from "@/lib/builder/page-structure";
import { BLOCK_META } from "@/lib/blocks/meta";
import type { BlockInstance, BlockType, TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const FOCUSED_NAV_IDS = new Set<PageStructureNavId>([
  "gallery",
  "schedule",
  "results",
  "contacts",
  "sponsors",
]);

const SECTION_LABELS: Record<PageStructureNavId, string> = {
  header: "Header",
  about: "About Team",
  gallery: "Gallery",
  schedule: "Schedule",
  results: "Results",
  contacts: "Contacts",
  sponsors: "Sponsors",
};

export function isFocusedSectionNav(id: PageStructureNavId | null): id is PageStructureNavId {
  return id != null && FOCUSED_NAV_IDS.has(id);
}

function resolveBlock(team: TeamSpace, id: PageStructureNavId): BlockInstance | undefined {
  if (id === "header" || id === "about") return undefined;
  const types = PAGE_STRUCTURE_BLOCK_MAP[id];
  return (
    team.blocks.find((b) => b.type === "schedule" && types.includes(b.type)) ??
    team.blocks.find((b) => types.includes(b.type))
  );
}

export function FocusedSectionPanel({
  navId,
  team,
  onPatchBlock,
  onPatchTeam,
  onPreviewBlock,
  onEnableBlock,
  className,
}: {
  navId: PageStructureNavId;
  team: TeamSpace;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
  onPreviewBlock: (id: string) => void;
  onEnableBlock: (type: BlockType) => void;
  className?: string;
}) {
  const items = getPageStructureNav(team);
  const item = items.find((i) => i.id === navId);
  const label = item?.label ?? SECTION_LABELS[navId];
  const block = resolveBlock(team, navId);
  const meta = block ? BLOCK_META[block.type] : undefined;

  if (!block) {
    return (
      <div className={cn(BUILDER_PANEL_SURFACE, "px-5 py-6", className)}>
        <p className="text-sm text-zinc-600">{label} is not available on this page.</p>
      </div>
    );
  }

  if (!block.enabled) {
    return (
      <div className={cn(BUILDER_PANEL_SURFACE, "px-5 py-8 text-center", className)}>
        <p className="text-base font-semibold text-zinc-900">{label} is not on your page yet.</p>
        <p className="mt-2 text-sm text-zinc-500">
          Add it so parents can see {label.toLowerCase()} on your team page.
        </p>
        <button
          type="button"
          onClick={() => onEnableBlock(block.type)}
          className="mt-5 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          Add {label}
        </button>
      </div>
    );
  }

  return (
    <div className={cn(BUILDER_PANEL_SURFACE, "overflow-hidden", className)} data-focused-section>
      <div className="border-b border-zinc-100/80 px-5 py-4">
        <h2 className="text-base font-bold text-zinc-900">{label}</h2>
        {meta ? <p className="mt-1 text-[13px] text-zinc-500">{meta.description}</p> : null}
      </div>
      <BlockSettingsEditor
        block={block}
        team={team}
        onPatchBlock={onPatchBlock}
        onPatchTeam={onPatchTeam}
        onPreviewBlock={onPreviewBlock}
      />
    </div>
  );
}
