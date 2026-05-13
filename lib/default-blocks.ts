import type { BlockInstance, BlockType } from "./types";

const ORDERED_BLOCKS: BlockType[] = [
  "announcement_bar",
  "hero",
  "calendar",
  "schedule",
  "results",
  "achievements",
  "team_feed",
  "attendance",
  "camp_trip",
  "contacts",
  "documents",
  "polls",
  "gallery",
  "sponsors",
  "weather",
  "countdown",
  "birthdays",
  "quick_links",
];

export function createDefaultBlocks(): BlockInstance[] {
  return ORDERED_BLOCKS.map((type, i) => ({
    id: `blk_${type}_${i}`,
    type,
    enabled: [
      "announcement_bar",
      "hero",
      "calendar",
      "results",
      "camp_trip",
      "contacts",
      "quick_links",
    ].includes(type),
    order: i,
  }));
}
