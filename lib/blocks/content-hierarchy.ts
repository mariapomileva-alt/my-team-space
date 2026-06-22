import type { BlockInstance, BlockType } from "@/lib/types";

/** How visually dominant a block is on the public team page. */
export type ContentLevel = "core" | "supporting" | "optional";

const CORE_TYPES = new Set<BlockType>([
  "schedule",
  "contacts",
  "results",
  "team_feed",
  "calendar",
]);

const SUPPORTING_TYPES = new Set<BlockType>([
  "gallery",
  "camp_trip",
  "documents",
  "resources",
  "attendance",
  "achievements",
  "quick_actions",
  "quick_links",
  "integrations",
  "countdown",
]);

const OPTIONAL_TYPES = new Set<BlockType>([
  "polls",
  "sponsors",
  "team_shop",
  "payments",
  "weather",
  "birthdays",
]);

const LEVEL_RANK: Record<ContentLevel, number> = {
  core: 0,
  supporting: 1,
  optional: 2,
};

/** Default editorial priority for each block type on the public page. */
export function contentLevelForBlock(type: BlockType): ContentLevel {
  if (CORE_TYPES.has(type)) return "core";
  if (OPTIONAL_TYPES.has(type)) return "optional";
  if (SUPPORTING_TYPES.has(type)) return "supporting";
  return "supporting";
}

export function contentLevelForInstance(block: BlockInstance): ContentLevel {
  return contentLevelForBlock(block.type);
}

/** Strongest level wins when a row contains multiple blocks. */
export function dominantContentLevel(...levels: ContentLevel[]): ContentLevel {
  if (levels.length === 0) return "supporting";
  return levels.reduce((best, level) =>
    LEVEL_RANK[level] < LEVEL_RANK[best] ? level : best,
  );
}

export function sectionLevelClass(level: ContentLevel): string {
  return `team-page-section--${level}`;
}

export function rowLevelClass(level: ContentLevel): string {
  return `team-page-row--${level}`;
}
