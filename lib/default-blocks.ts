import { BLOCK_META } from "./blocks/meta";
import { defaultSettingsForType } from "./blocks/settings";
import type { BlockInstance, BlockType } from "./types";

/** Order matches builder sections (essential → engagement → advanced) */
const ORDERED_BLOCKS: BlockType[] = [
  "announcement_bar",
  "hero",
  "calendar",
  "schedule",
  "contacts",
  "quick_links",
  "integrations",
  "gallery",
  "polls",
  "achievements",
  "results",
  "team_feed",
  "attendance",
  "camp_trip",
  "documents",
  "resources",
  "birthdays",
  "sponsors",
  "weather",
  "countdown",
];

export function createDefaultBlocks(): BlockInstance[] {
  return ORDERED_BLOCKS.map((type, i) => ({
    id: `blk_${type}_${i}`,
    type,
    enabled: ["announcement_bar", "hero", "quick_links"].includes(type),
    order: i,
    layout: BLOCK_META[type].defaultLayout,
    settings: defaultSettingsForType(type),
  }));
}
