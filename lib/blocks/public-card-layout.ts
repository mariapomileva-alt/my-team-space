import type { BlockInstance, BlockType, TeamPageSettings } from "@/lib/types";

export type PublicCompactDensity = "single" | "double";

/**
 * Content-heavy blocks always span the full row so text never squeezes
 * into a narrow column (mobile, tablet, or desktop).
 */
const ALWAYS_FULL_ROW_TYPES = new Set<BlockType>([
  "schedule",
  "payments",
  "results",
  "gallery",
  "camp_trip",
  "polls",
  "achievements",
  "team_feed",
]);

/** Compact blocks that may share a row on tablet (768px+) when enabled. */
const COMPACT_ELIGIBLE_TYPES = new Set<BlockType>([
  "contacts",
  "integrations",
  "quick_links",
  "quick_actions",
  "weather",
  "countdown",
  "birthdays",
  "sponsors",
  "calendar",
  "documents",
  "attendance",
  "team_shop",
  "resources",
]);

/** Coach setting: optional 2-per-row on tablet only (<768px is always 1-per-row). */
export function resolveCompactDensity(settings?: TeamPageSettings): PublicCompactDensity {
  return settings?.mobileCardColumns === "double" ? "double" : "single";
}

/** Grid item span class for a block on the public page. */
export function publicCardGridItemClass(
  block: BlockInstance,
  density: PublicCompactDensity,
): string {
  if (ALWAYS_FULL_ROW_TYPES.has(block.type)) {
    return "team-module-grid__item--full";
  }
  if (
    density === "double" &&
    COMPACT_ELIGIBLE_TYPES.has(block.type) &&
    (block.layout === "half" || block.layout === "card")
  ) {
    return "team-module-grid__item--half";
  }
  return "";
}

const DETAIL_FOOTER: Partial<Record<BlockType, string>> = {
  schedule: "View full schedule",
  results: "Full results & history",
  gallery: "View all photos",
  contacts: "All contacts",
  camp_trip: "Trip details",
  documents: "All documents",
  team_feed: "All news",
  achievements: "All achievements",
  attendance: "Full roster",
  integrations: "All links",
  resources: "All resources",
  team_shop: "View shop",
  polls: "View results",
};

export function publicCardFooterLabel(type: BlockType): string {
  return DETAIL_FOOTER[type] ?? "View all";
}

export function publicCardNeedsDetail(
  block: BlockInstance,
  counts: { total: number; preview: number },
): boolean {
  if (block.type === "results") return true;
  if (block.type === "gallery") return counts.total > counts.preview || counts.preview === 0;
  if (block.type === "payments" || block.type === "polls") return false;
  if (counts.total > counts.preview) return true;
  if (block.type === "integrations" || block.type === "resources") return counts.total > 2;
  return false;
}

export function moduleLevelClass(level: "core" | "supporting" | "optional"): string {
  return `team-module-card--${level}`;
}
