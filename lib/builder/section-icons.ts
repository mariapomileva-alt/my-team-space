import type { BlockType } from "@/lib/types";
import type { PageStructureNavId } from "@/lib/builder/page-structure";

/** Lucide-style stroke icons used across the builder. */
export type BuilderIconId =
  | "layout-panel"
  | "users"
  | "image"
  | "calendar"
  | "trophy"
  | "phone"
  | "handshake"
  | "megaphone"
  | "link"
  | "credit-card"
  | "shopping-bag"
  | "zap"
  | "puzzle"
  | "bar-chart"
  | "message-square"
  | "user-check"
  | "bus"
  | "file-text"
  | "book-open"
  | "cake"
  | "cloud-sun"
  | "timer"
  | "settings"
  | "layers";

export const PAGE_STRUCTURE_ICON: Partial<Record<PageStructureNavId, BuilderIconId>> = {
  header: "layout-panel",
  gallery: "image",
  schedule: "calendar",
  results: "trophy",
  contacts: "phone",
  sponsors: "handshake",
};

const BLOCK_TYPE_ICON: Partial<Record<BlockType, BuilderIconId>> = {
  announcement_bar: "megaphone",
  hero: "layout-panel",
  calendar: "calendar",
  schedule: "calendar",
  contacts: "phone",
  quick_links: "link",
  payments: "credit-card",
  team_shop: "shopping-bag",
  quick_actions: "zap",
  integrations: "puzzle",
  gallery: "image",
  polls: "bar-chart",
  achievements: "trophy",
  results: "trophy",
  team_feed: "message-square",
  attendance: "user-check",
  camp_trip: "bus",
  documents: "file-text",
  resources: "book-open",
  birthdays: "cake",
  sponsors: "handshake",
  weather: "cloud-sun",
  countdown: "timer",
};

export function iconForPageStructure(id: PageStructureNavId): BuilderIconId {
  if (id === "header") return PAGE_STRUCTURE_ICON.header ?? "layout-panel";
  if (id === "schedule") return "calendar";
  return iconForBlockType(id);
}

export function iconForBlockType(type: BlockType): BuilderIconId {
  return BLOCK_TYPE_ICON[type] ?? "layers";
}
