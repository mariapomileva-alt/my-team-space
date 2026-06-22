import { computeResultsBoard, getResultsBoardSettings } from "@/lib/blocks/results-board";
import { getBlockSettings } from "@/lib/blocks/settings";
import { toExternalHref } from "@/lib/external-url";
import type { BlockInstance, BlockType, TeamSpace } from "@/lib/types";

/** True when a block has real coach-authored content worth showing on the public page. */
export function hasPublicBlockContent(team: TeamSpace, block: BlockInstance): boolean {
  switch (block.type) {
    case "hero":
      return Boolean(team.name?.trim());
    case "announcement_bar": {
      const s = getBlockSettings<{ message?: string }>(block);
      return Boolean(s.message?.trim());
    }
    case "schedule": {
      const s = getBlockSettings<{
        mode?: string;
        events?: { title?: string; time?: string }[];
        externalUrl?: string;
      }>(block);
      if (s.mode === "external") return Boolean(s.externalUrl?.trim());
      return (s.events ?? []).some((ev) => Boolean(ev.title?.trim() || ev.time?.trim()));
    }
    case "calendar": {
      const s = getBlockSettings<{ externalUrl?: string }>(block);
      return Boolean(s.externalUrl?.trim());
    }
    case "gallery": {
      const s = getBlockSettings<{ mode?: string; images?: { url?: string }[]; externalUrl?: string }>(block);
      if (s.mode === "external") return Boolean(s.externalUrl?.trim());
      return (s.images ?? []).some((img) => Boolean(img.url?.trim()));
    }
    case "contacts": {
      const s = getBlockSettings<{ items?: { name?: string }[] }>(block);
      return (s.items ?? []).some((i) => Boolean(i.name?.trim()));
    }
    case "payments": {
      const s = getBlockSettings<{ paymentUrl?: string }>(block);
      return Boolean(toExternalHref(s.paymentUrl ?? ""));
    }
    case "polls": {
      const s = getBlockSettings<{ question?: string; optionYes?: string; optionNo?: string }>(block);
      const options = [s.optionYes, s.optionNo].filter((o) => o?.trim());
      return Boolean(s.question?.trim()) && options.length > 0;
    }
    case "achievements": {
      const s = getBlockSettings<{ cards?: { title?: string }[] }>(block);
      return (s.cards ?? []).some((c) => Boolean(c.title?.trim()));
    }
    case "attendance": {
      const att = team.blocks.find((b) => b.type === "attendance") ?? block;
      const roster = getBlockSettings<{ roster?: { name?: string }[] }>(att).roster ?? [];
      return roster.some((p) => Boolean(p.name?.trim()));
    }
    case "camp_trip":
    case "documents":
    case "team_feed": {
      const s = getBlockSettings<{ items?: { title?: string }[] }>(block);
      return (s.items ?? []).some((r) => Boolean(r.title?.trim()));
    }
    case "results": {
      const settings = getResultsBoardSettings(block);
      return computeResultsBoard(settings).leaderboard.length > 0;
    }
    case "quick_links": {
      const s = getBlockSettings<Record<string, string>>(block);
      return ["whatsapp", "telegram", "instagram", "tiktok", "website", "phone", "customUrl"].some((k) =>
        Boolean(s[k]?.trim()),
      );
    }
    case "quick_actions": {
      const s = getBlockSettings<{ actions?: { title?: string; url?: string }[] }>(block);
      return (s.actions ?? []).some((a) => Boolean(a.title?.trim() && toExternalHref(a.url ?? "")));
    }
    case "team_shop": {
      const s = getBlockSettings<{ products?: { name?: string; productUrl?: string }[] }>(block);
      return (s.products ?? []).some((p) => Boolean(p.name?.trim() && toExternalHref(p.productUrl ?? "")));
    }
    case "integrations": {
      const s = getBlockSettings<{ links?: { url?: string }[] }>(block);
      return (s.links ?? []).some((l) => Boolean(l.url?.trim()));
    }
    case "resources": {
      const s = getBlockSettings<{ items?: { title?: string; url?: string; fileUrl?: string }[] }>(block);
      return (s.items ?? []).some((r) => Boolean(r.title?.trim() && (r.url?.trim() || r.fileUrl?.trim())));
    }
    case "birthdays": {
      const att = team.blocks.find((b) => b.type === "attendance");
      const roster =
        att != null
          ? getBlockSettings<{ roster?: { name?: string; birthday?: string }[] }>(att).roster ?? []
          : [];
      return roster.some((p) => Boolean(p.name?.trim() && p.birthday?.trim()));
    }
    case "sponsors": {
      const s = getBlockSettings<{ items?: { name?: string }[] }>(block);
      return (s.items ?? []).some((r) => Boolean(r.name?.trim()));
    }
    case "weather": {
      const s = getBlockSettings<{ temp?: string; note?: string; location?: string }>(block);
      return Boolean(s.temp?.trim() || s.note?.trim() || s.location?.trim());
    }
    case "countdown": {
      const s = getBlockSettings<{ targetDate?: string }>(block);
      return Boolean(s.targetDate?.trim());
    }
    default:
      return true;
  }
}

/** Drop empty blocks from public-facing page chrome and dashboard. */
export function filterBlocksForPublicDisplay(team: TeamSpace, blocks: BlockInstance[]): BlockInstance[] {
  return blocks.filter((b) => b.enabled && hasPublicBlockContent(team, b));
}

/** Block types that should stay off new team pages until the coach adds content. */
export const PUBLIC_EMPTY_HIDDEN_TYPES = new Set<BlockType>([
  "announcement_bar",
  "schedule",
  "gallery",
  "contacts",
  "calendar",
  "payments",
  "polls",
  "achievements",
  "attendance",
  "camp_trip",
  "documents",
  "team_feed",
  "results",
  "quick_links",
  "quick_actions",
  "team_shop",
  "integrations",
  "resources",
  "birthdays",
  "sponsors",
  "weather",
  "countdown",
]);
