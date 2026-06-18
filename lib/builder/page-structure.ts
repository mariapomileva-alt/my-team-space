import { getBlockSettings } from "@/lib/blocks/settings";
import type { BlockType, TeamSpace } from "@/lib/types";

export type PageStructureNavId =
  | "header"
  | "about"
  | "gallery"
  | "calendar"
  | "results"
  | "contacts"
  | "sponsors";

export type PageStructureNavItem = {
  id: PageStructureNavId;
  label: string;
  emoji: string;
  done: boolean;
  /** Block is on the public page */
  enabled: boolean;
  blockTypes: BlockType[];
};

type HeroSettings = {
  quote: string;
  description?: string;
  coverImageUrl: string;
  teamPhotoUrl?: string;
};

function heroSettings(team: TeamSpace) {
  const hero = team.blocks.find((b) => b.type === "hero");
  return hero ? getBlockSettings<HeroSettings>(hero) : undefined;
}

function blockOf(team: TeamSpace, type: BlockType) {
  return team.blocks.find((b) => b.type === type);
}

function headerDone(team: TeamSpace, hs: HeroSettings | undefined) {
  const hasName = Boolean(team.name?.trim());
  const hasLogo = Boolean((team.logoUrl ?? hs?.teamPhotoUrl ?? "").trim());
  const hasCover = Boolean(hs?.coverImageUrl?.trim());
  return hasName && hasLogo && hasCover;
}

function aboutDone(team: TeamSpace, hs: ReturnType<typeof heroSettings>) {
  return Boolean(team.tagline?.trim() || hs?.description?.trim() || hs?.quote?.trim());
}

function galleryDone(team: TeamSpace) {
  const block = blockOf(team, "gallery");
  if (!block?.enabled) return false;
  const s = getBlockSettings<{ externalUrl?: string; images?: { url?: string }[] }>(block);
  return Boolean(
    (s.externalUrl?.trim() ?? "") || (s.images ?? []).some((img) => Boolean(img.url?.trim())),
  );
}

function calendarDone(team: TeamSpace) {
  const block = blockOf(team, "calendar") ?? blockOf(team, "schedule");
  if (!block?.enabled) return false;
  const s = getBlockSettings<{ externalUrl?: string; events?: unknown[] }>(block);
  return Boolean(
    (s.externalUrl?.trim() ?? "") || (Array.isArray(s.events) && s.events.length > 0),
  );
}

function resultsDone(team: TeamSpace) {
  const block = blockOf(team, "results");
  if (!block?.enabled) return false;
  const s = getBlockSettings<{ simpleResults?: unknown[]; competitions?: unknown[]; categories?: unknown[] }>(
    block,
  );
  return Boolean(
    (s.simpleResults?.length ?? 0) > 0 ||
      (s.competitions?.length ?? 0) > 0 ||
      (s.categories?.length ?? 0) > 0,
  );
}

function contactsDone(team: TeamSpace) {
  const block = blockOf(team, "contacts");
  if (!block?.enabled) return false;
  const s = getBlockSettings<{ items?: { name?: string }[] }>(block);
  return Boolean((s.items ?? []).some((i) => Boolean(i.name?.trim())));
}

function sponsorsDone(team: TeamSpace) {
  const block = blockOf(team, "sponsors");
  if (!block?.enabled) return false;
  const s = getBlockSettings<{ items?: { name?: string }[] }>(block);
  return Boolean((s.items ?? []).some((i) => Boolean(i.name?.trim())));
}

/** Sidebar page map — what families see, and what still needs work. */
export function getPageStructureNav(team: TeamSpace): PageStructureNavItem[] {
  const hs = heroSettings(team);
  const sponsorsBlock = blockOf(team, "sponsors");

  const items: PageStructureNavItem[] = [
    {
      id: "header",
      label: "Header",
      emoji: "◎",
      done: headerDone(team, hs),
      enabled: true,
      blockTypes: ["hero"],
    },
    {
      id: "about",
      label: "About Team",
      emoji: "✍️",
      done: aboutDone(team, hs),
      enabled: true,
      blockTypes: ["hero"],
    },
    {
      id: "gallery",
      label: "Gallery",
      emoji: "📸",
      done: galleryDone(team),
      enabled: Boolean(blockOf(team, "gallery")?.enabled),
      blockTypes: ["gallery"],
    },
    {
      id: "calendar",
      label: "Calendar",
      emoji: "📅",
      done: calendarDone(team),
      enabled: Boolean(
        blockOf(team, "calendar")?.enabled || blockOf(team, "schedule")?.enabled,
      ),
      blockTypes: ["calendar", "schedule"],
    },
    {
      id: "results",
      label: "Results",
      emoji: "🏆",
      done: resultsDone(team),
      enabled: Boolean(blockOf(team, "results")?.enabled),
      blockTypes: ["results"],
    },
    {
      id: "contacts",
      label: "Contacts",
      emoji: "📞",
      done: contactsDone(team),
      enabled: Boolean(blockOf(team, "contacts")?.enabled),
      blockTypes: ["contacts"],
    },
  ];

  if (sponsorsBlock?.enabled) {
    items.push({
      id: "sponsors",
      label: "Sponsors",
      emoji: "🤝",
      done: sponsorsDone(team),
      enabled: true,
      blockTypes: ["sponsors"],
    });
  }

  return items;
}

export const PAGE_STRUCTURE_BLOCK_MAP: Record<
  Exclude<PageStructureNavId, "header" | "about">,
  BlockType[]
> = {
  gallery: ["gallery"],
  calendar: ["calendar", "schedule"],
  results: ["results"],
  contacts: ["contacts"],
  sponsors: ["sponsors"],
};

/** Block id to highlight in live preview when a sidebar section is selected. */
export function resolvePreviewBlockId(team: TeamSpace, id: PageStructureNavId): string | null {
  if (id === "header" || id === "about") {
    return team.blocks.find((b) => b.type === "hero")?.id ?? null;
  }
  const types = PAGE_STRUCTURE_BLOCK_MAP[id];
  const enabled = team.blocks.find((b) => types.includes(b.type) && b.enabled);
  if (enabled) return enabled.id;
  return team.blocks.find((b) => types.includes(b.type))?.id ?? null;
}

export function structureNavIdForBlockType(type: BlockType): PageStructureNavId | null {
  if (type === "gallery") return "gallery";
  if (type === "calendar" || type === "schedule") return "calendar";
  if (type === "results") return "results";
  if (type === "contacts") return "contacts";
  if (type === "sponsors") return "sponsors";
  if (type === "hero") return "header";
  return null;
}
