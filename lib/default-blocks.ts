import { BLOCK_META } from "./blocks/meta";
import { defaultSettingsForType } from "./blocks/settings";
import type { BlockInstance, BlockType } from "./types";

/** Order matches builder sections (essential → engagement → advanced) */
const ORDERED_BLOCKS: BlockType[] = [
  "announcement_bar",
  "hero",
  "calendar",
  "schedule",
  "results",
  "team_feed",
  "gallery",
  "payments",
  "team_shop",
  "quick_actions",
  "contacts",
  "quick_links",
  "integrations",
  "polls",
  "achievements",
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
