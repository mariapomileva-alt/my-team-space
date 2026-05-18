import { getBlockSettings, type ListBlockSettings, type PollSettings } from "@/lib/blocks/settings";
import { BLOCK_APP_META } from "@/lib/blocks/block-app-meta";
import type { BlockInstance, BlockType, TeamSpace } from "@/lib/types";

export type BlockPreview = {
  headline: string;
  detail?: string;
  badge?: string;
  isEmpty: boolean;
};

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getBlockPreview(team: TeamSpace, block: BlockInstance): BlockPreview {
  const meta = BLOCK_APP_META[block.type];
  const empty = (headline: string): BlockPreview => ({
    headline,
    detail: "Coach will add details soon",
    isEmpty: true,
  });

  switch (block.type) {
    case "gallery": {
      const s = getBlockSettings<{ mode: string; images: { url: string }[]; externalUrl: string }>(block);
      const n = (s.images ?? []).filter((i) => i.url?.trim()).length;
      if (s.mode === "external" && s.externalUrl?.trim()) {
        return { headline: "Photo album linked", detail: "Tap to open gallery", badge: "Album", isEmpty: false };
      }
      if (n === 0) return empty("Photos coming soon");
      return { headline: `${n} photo${n === 1 ? "" : "s"}`, detail: "Tap to browse the gallery", badge: String(n), isEmpty: false };
    }
    case "schedule": {
      const s = getBlockSettings<{
        mode: string;
        events: { title: string; dayOfWeek: number; time: string }[];
        externalUrl: string;
      }>(block);
      const events = s.events ?? [];
      if (s.mode === "external" && s.externalUrl?.trim()) {
        return { headline: "Weekly schedule", detail: "Opens full calendar", isEmpty: false };
      }
      if (events.length === 0) return empty("Schedule coming soon");
      const next = events[0];
      return {
        headline: `${events.length} session${events.length === 1 ? "" : "s"} this week`,
        detail: `${DAY[next.dayOfWeek] ?? "?"} · ${next.title} · ${next.time}`,
        badge: "This week",
        isEmpty: false,
      };
    }
    case "calendar": {
      const s = getBlockSettings<{ externalUrl: string }>(block);
      if (!s.externalUrl?.trim()) return empty("Calendar coming soon");
      return { headline: "Team calendar", detail: "Tap for full calendar", badge: "Live", isEmpty: false };
    }
    case "attendance": {
      const att = team.blocks.find((b) => b.type === "attendance") ?? block;
      const roster = getBlockSettings<{ roster: { name: string }[] }>(att).roster ?? [];
      const n = roster.filter((p) => p.name?.trim()).length;
      if (n === 0) return empty("Roster not set yet");
      return {
        headline: `${n} athlete${n === 1 ? "" : "s"} on roster`,
        detail: "Tap for attendance history",
        isEmpty: false,
      };
    }
    case "camp_trip": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const items = (s.items ?? []).filter((r) => r.title?.trim());
      if (items.length === 0) return empty("No trips planned yet");
      return {
        headline: items[0].title!,
        detail: items.length > 1 ? `+${items.length - 1} more · checklist inside` : "Tap for travel details",
        badge: "Trip",
        isEmpty: false,
      };
    }
    case "documents": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const docs = (s.items ?? []).filter((r) => r.title?.trim());
      if (docs.length === 0) return empty("Rules & docs coming soon");
      return {
        headline: `${docs.length} document${docs.length === 1 ? "" : "s"}`,
        detail: docs[0].title!,
        isEmpty: false,
      };
    }
    case "results": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const items = (s.items ?? []).filter((r) => r.name?.trim());
      if (items.length === 0) return empty("Results coming soon");
      const top = items[0];
      return {
        headline: top.name!,
        detail: top.subtitle || "Tap for medals & highlights",
        badge: top.emoji || "🏅",
        isEmpty: false,
      };
    }
    case "achievements": {
      const s = getBlockSettings<{ cards: { title: string; player: string }[] }>(block);
      const cards = s.cards ?? [];
      if (cards.length === 0) return empty("Achievements coming soon");
      return {
        headline: cards[0].title,
        detail: cards[0].player || `${cards.length} highlight${cards.length === 1 ? "" : "s"}`,
        badge: "🏆",
        isEmpty: false,
      };
    }
    case "team_feed": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const posts = (s.items ?? []).filter((r) => r.title?.trim());
      if (posts.length === 0) return empty("No updates yet");
      return {
        headline: posts[0].title!,
        detail: posts.length > 1 ? `${posts.length} messages` : posts[0].body?.slice(0, 60) || "Tap to read all",
        badge: "New",
        isEmpty: false,
      };
    }
    case "contacts": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const items = (s.items ?? []).filter((r) => r.name?.trim());
      if (items.length === 0) return empty("Contacts coming soon");
      return {
        headline: items[0].name!,
        detail: items[0].role || `${items.length} contact${items.length === 1 ? "" : "s"}`,
        isEmpty: false,
      };
    }
    case "quick_links": {
      const s = getBlockSettings<Record<string, string>>(block);
      const count = ["whatsapp", "telegram", "instagram", "tiktok", "website", "phone", "customUrl"].filter(
        (k) => s[k]?.trim(),
      ).length;
      if (count === 0) return empty("Links coming soon");
      return { headline: `${count} quick link${count === 1 ? "" : "s"}`, detail: "WhatsApp, chat & social", isEmpty: false };
    }
    case "polls": {
      const s = getBlockSettings<PollSettings>(block);
      if (!s.question?.trim()) return empty("No active poll");
      return { headline: s.question.slice(0, 72), detail: "Tap to cast your vote", badge: "Vote", isEmpty: false };
    }
    case "sponsors": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const n = (s.items ?? []).filter((r) => r.name?.trim()).length;
      if (n === 0) return empty("Partners coming soon");
      return { headline: `${n} partner${n === 1 ? "" : "s"}`, detail: "Thank you for supporting us", isEmpty: false };
    }
    case "weather": {
      const s = getBlockSettings<{ temp?: string; note?: string; location?: string }>(block);
      if (!s.temp?.trim() && !s.note?.trim()) return empty("Venue notes soon");
      return {
        headline: s.temp?.trim() || s.location?.trim() || "Venue update",
        detail: s.note?.trim() || s.location?.trim(),
        isEmpty: false,
      };
    }
    case "countdown": {
      const s = getBlockSettings<{ label?: string; targetDate?: string }>(block);
      if (!s.targetDate?.trim()) return empty("Countdown not set");
      return {
        headline: s.label?.trim() || "Big day ahead",
        detail: new Date(s.targetDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        badge: "Soon",
        isEmpty: false,
      };
    }
    case "birthdays": {
      const att = team.blocks.find((b) => b.type === "attendance");
      const roster =
        att != null
          ? getBlockSettings<{ roster: { name: string; birthday?: string }[] }>(att).roster ?? []
          : [];
      const n = roster.filter((p) => p.name?.trim() && p.birthday?.trim()).length;
      if (n === 0) return empty("Birthdays not added");
      return { headline: `${n} birthday${n === 1 ? "" : "s"}`, detail: "Tap to see the list", isEmpty: false };
    }
    default:
      return { headline: meta.title, detail: meta.subtitle, isEmpty: true };
  }
}

export function blockGridSpan(layout: BlockInstance["layout"]): string {
  switch (layout) {
    case "featured":
      return "col-span-1 sm:col-span-2";
    case "half":
      return "col-span-1";
    default:
      return "col-span-1";
  }
}
