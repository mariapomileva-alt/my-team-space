import { builderBlockDisplayLabel } from "@/lib/builder/display-labels";
import { BLOCK_META } from "@/lib/blocks/meta";
import { getBlockSettings } from "@/lib/blocks/settings";
import type { BlockType, TeamSpace } from "@/lib/types";

/** Hero uses a coach-friendly label; every other block type has its own nav id. */
export type PageStructureNavId = "header" | Exclude<BlockType, "hero">;

export type PageStructureNavItem = {
  id: PageStructureNavId;
  label: string;
  done: boolean;
  /** Block is on the public page */
  enabled: boolean;
  blockTypes: BlockType[];
  group: "core" | "more";
};

export const CORE_PAGE_NAV_IDS: PageStructureNavId[] = [
  "header",
  "gallery",
  "schedule",
  "results",
  "contacts",
];

/** Full builder sidebar order — announcements, payments, integrations, etc. */
export const BUILDER_NAV_ORDER: PageStructureNavId[] = [
  "header",
  "announcement_bar",
  "gallery",
  "schedule",
  "results",
  "achievements",
  "contacts",
  "quick_links",
  "payments",
  "quick_actions",
  "integrations",
  "team_shop",
  "polls",
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

type HeroSettings = {
  quote: string;
  description?: string;
  coverImageUrl: string;
  teamPhotoUrl?: string;
  city?: string;
  social?: Record<string, string | undefined>;
};

function heroSettings(team: TeamSpace) {
  const hero = team.blocks.find((b) => b.type === "hero");
  return hero ? getBlockSettings<HeroSettings>(hero) : undefined;
}

function blockOf(team: TeamSpace, type: BlockType) {
  return team.blocks.find((b) => b.type === type);
}

function firstBlockForNav(team: TeamSpace, id: PageStructureNavId) {
  const types = blockTypesForNav(id);
  return team.blocks.find((b) => types.includes(b.type));
}

export function blockTypesForNav(id: PageStructureNavId): BlockType[] {
  if (id === "header") return ["hero"];
  if (id === "schedule") return ["schedule", "calendar"];
  return [id];
}

export function navLabel(id: PageStructureNavId): string {
  if (id === "header") return "Team profile";
  return builderBlockDisplayLabel(id);
}

function headerDone(team: TeamSpace, hs: HeroSettings | undefined) {
  const hasName = Boolean(team.name?.trim());
  const hasLogo = Boolean((team.logoUrl ?? hs?.teamPhotoUrl ?? "").trim());
  const hasCover = Boolean(hs?.coverImageUrl?.trim());
  return hasName && hasLogo && hasCover;
}

function hasNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && Boolean(value.trim());
}

function navItemDone(team: TeamSpace, id: PageStructureNavId): boolean {
  if (id === "header") return headerDone(team, heroSettings(team));

  const block = firstBlockForNav(team, id);
  if (!block?.enabled) return false;

  switch (id) {
    case "announcement_bar": {
      const s = getBlockSettings<{ message?: string }>(block);
      return hasNonEmptyString(s.message);
    }
    case "gallery": {
      const s = getBlockSettings<{ externalUrl?: string; images?: { url?: string }[] }>(block);
      return Boolean(
        hasNonEmptyString(s.externalUrl) || (s.images ?? []).some((img) => hasNonEmptyString(img.url)),
      );
    }
    case "schedule": {
      const schedule = blockOf(team, "schedule") ?? blockOf(team, "calendar");
      if (!schedule?.enabled) return false;
      const s = getBlockSettings<{ externalUrl?: string; events?: unknown[] }>(schedule);
      return Boolean(
        hasNonEmptyString(s.externalUrl) || (Array.isArray(s.events) && s.events.length > 0),
      );
    }
    case "results": {
      const s = getBlockSettings<{ simpleResults?: unknown[]; competitions?: unknown[]; categories?: unknown[] }>(
        block,
      );
      return Boolean(
        (s.simpleResults?.length ?? 0) > 0 ||
          (s.competitions?.length ?? 0) > 0 ||
          (s.categories?.length ?? 0) > 0,
      );
    }
    case "achievements": {
      const s = getBlockSettings<{ cards?: { title?: string }[] }>(block);
      return Boolean((s.cards ?? []).some((c) => hasNonEmptyString(c.title)));
    }
    case "contacts": {
      const s = getBlockSettings<{ items?: { name?: string }[] }>(block);
      return Boolean((s.items ?? []).some((i) => hasNonEmptyString(i.name)));
    }
    case "quick_links": {
      const s = getBlockSettings<Record<string, string | undefined>>(block);
      return Object.values(s).some((v) => hasNonEmptyString(v));
    }
    case "payments": {
      const s = getBlockSettings<{ paymentUrl?: string; title?: string }>(block);
      return hasNonEmptyString(s.paymentUrl) || hasNonEmptyString(s.title);
    }
    case "quick_actions": {
      const s = getBlockSettings<{ actions?: { title?: string; url?: string }[] }>(block);
      return Boolean((s.actions ?? []).some((a) => hasNonEmptyString(a.title) || hasNonEmptyString(a.url)));
    }
    case "integrations": {
      const s = getBlockSettings<{ links?: { url?: string; label?: string }[] }>(block);
      return Boolean((s.links ?? []).some((l) => hasNonEmptyString(l.url) || hasNonEmptyString(l.label)));
    }
    case "team_shop": {
      const s = getBlockSettings<{ products?: { name?: string }[] }>(block);
      return Boolean((s.products ?? []).some((p) => hasNonEmptyString(p.name)));
    }
    case "polls": {
      const s = getBlockSettings<{ question?: string }>(block);
      return hasNonEmptyString(s.question);
    }
    case "team_feed": {
      const s = getBlockSettings<{ items?: { title?: string; body?: string }[] }>(block);
      return Boolean((s.items ?? []).some((i) => hasNonEmptyString(i.title) || hasNonEmptyString(i.body)));
    }
    case "attendance": {
      const s = getBlockSettings<{ roster?: { name?: string }[] }>(block);
      return Boolean((s.roster ?? []).some((p) => hasNonEmptyString(p.name)));
    }
    case "camp_trip": {
      const s = getBlockSettings<{ items?: { title?: string }[] }>(block);
      return Boolean((s.items ?? []).some((i) => hasNonEmptyString(i.title)));
    }
    case "documents":
    case "resources": {
      const s = getBlockSettings<{ items?: { title?: string }[] }>(block);
      return Boolean((s.items ?? []).some((i) => hasNonEmptyString(i.title)));
    }
    case "birthdays": {
      const s = getBlockSettings<{ items?: { name?: string }[] }>(block);
      return Boolean((s.items ?? []).some((i) => hasNonEmptyString(i.name)));
    }
    case "sponsors": {
      const s = getBlockSettings<{ items?: { name?: string }[] }>(block);
      return Boolean((s.items ?? []).some((i) => hasNonEmptyString(i.name)));
    }
    case "weather": {
      const s = getBlockSettings<{ temp?: string; note?: string; location?: string }>(block);
      return [s.temp, s.note, s.location].some((v) => hasNonEmptyString(v));
    }
    case "countdown": {
      const s = getBlockSettings<{ label?: string; targetDate?: string }>(block);
      return hasNonEmptyString(s.label) && hasNonEmptyString(s.targetDate);
    }
    default:
      return block.enabled;
  }
}

function navItemEnabled(team: TeamSpace, id: PageStructureNavId): boolean {
  if (id === "header") return true;
  const types = blockTypesForNav(id);
  return team.blocks.some((b) => types.includes(b.type) && b.enabled);
}

/** Sidebar page map — always lists every builder section (core + more). */
export function getPageStructureNav(team: TeamSpace): PageStructureNavItem[] {
  const coreSet = new Set<PageStructureNavId>(CORE_PAGE_NAV_IDS);

  return BUILDER_NAV_ORDER.map((id) => ({
    id,
    label: navLabel(id),
    done: navItemDone(team, id),
    enabled: navItemEnabled(team, id),
    blockTypes: blockTypesForNav(id),
    group: coreSet.has(id) ? "core" : "more",
  }));
}

export const PAGE_STRUCTURE_BLOCK_MAP = Object.fromEntries(
  BUILDER_NAV_ORDER.map((id) => [id, blockTypesForNav(id)]),
) as Record<PageStructureNavId, BlockType[]>;

/** Block id to highlight in live preview when a sidebar section is selected. */
export function resolvePreviewBlockId(team: TeamSpace, id: PageStructureNavId): string | null {
  const types = PAGE_STRUCTURE_BLOCK_MAP[id];
  const enabled = team.blocks.find((b) => types.includes(b.type) && b.enabled);
  if (enabled) return enabled.id;
  return team.blocks.find((b) => types.includes(b.type))?.id ?? null;
}

export function structureNavIdForBlockType(type: BlockType): PageStructureNavId | null {
  if (type === "hero") return "header";
  if (type === "calendar") return "schedule";
  if (type in BLOCK_META) return type as PageStructureNavId;
  return null;
}
