import { BLOCK_META } from "@/lib/blocks/meta";
import type { BlockType } from "@/lib/types";

/** Coach-friendly section names — UI only; does not change block types or data. */
export const BUILDER_BLOCK_DISPLAY_LABELS: Partial<Record<BlockType, string>> = {
  hero: "Header",
  announcement_bar: "Announcements",
  calendar: "External calendar",
  schedule: "Schedule",
  results: "Results",
  achievements: "Results",
  gallery: "Gallery",
  payments: "Payments",
  quick_links: "Social Links",
  contacts: "Contacts",
  team_feed: "About",
  polls: "Polls",
  documents: "Documents",
  attendance: "Attendance",
  camp_trip: "Trips",
  team_shop: "Shop",
  quick_actions: "Quick actions",
  integrations: "Integrations",
  resources: "Resources",
};

export function builderBlockDisplayLabel(type: BlockType): string {
  return BUILDER_BLOCK_DISPLAY_LABELS[type] ?? BLOCK_META[type].title;
}
