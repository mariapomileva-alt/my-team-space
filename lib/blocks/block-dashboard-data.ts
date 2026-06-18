import { computeResultsBoard, getResultsBoardSettings } from "@/lib/blocks/results-board";
import {
  getBlockSettings,
  type ListBlockSettings,
  type PaymentLinkSettings,
  type PollSettings,
  type QuickActionsSettings,
} from "@/lib/blocks/settings";
import { toExternalHref } from "@/lib/external-url";
import type { BlockInstance, TeamSpace } from "@/lib/types";

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type ScheduleEvent = { title: string; day: string; time: string; location?: string };

export type AchievementCard = { icon: string; title: string; player?: string };

export type DashboardBlockData = {
  schedule: {
    events: ScheduleEvent[];
    externalUrl?: string;
    next?: ScheduleEvent;
  };
  attendance: {
    rosterCount: number;
    weeklyRate: number;
    weekBars: number[];
    label: string;
  };
  camp_trip: {
    items: { title: string; body?: string }[];
  };
  documents: {
    docs: { title: string }[];
  };
  polls: {
    question: string;
    options: string[];
  };
  team_feed: {
    posts: { title: string; body?: string }[];
  };
  achievements: {
    cards: AchievementCard[];
  };
  gallery: {
    images: string[];
    externalUrl?: string;
    albumMode: boolean;
  };
  results: {
    items: { name: string; subtitle?: string; emoji?: string }[];
  };
  contacts: {
    items: { name: string; role?: string }[];
  };
  calendar: { externalUrl?: string };
  quick_links: { labels: string[] };
  payments: {
    title: string;
    description?: string;
    buttonLabel: string;
    hasUrl: boolean;
  };
  quick_actions: {
    title: string;
    count: number;
    previews: { icon: string; title: string }[];
  };
  team_shop: {
    title: string;
    count: number;
    previews: { name: string; price?: string; imageUrl?: string }[];
  };
  weather: { temp?: string; note?: string; location?: string };
  countdown: { label: string; targetLabel: string; parts?: { days: number; hrs: number; min: number } };
  birthdays: { items: { name: string; date: string }[] };
  sponsors: { names: string[] };
  integrations: {
    title: string;
    previews: { label: string; host: string }[];
  };
};

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Stable pseudo weekly bars for glanceable trend (until real stats exist) */
export function weeklyTrendBars(teamId: string, rosterCount: number): number[] {
  const seed = hashSeed(teamId + "-week");
  const base = Math.min(92, 48 + rosterCount * 4);
  return Array.from({ length: 7 }, (_, i) => {
    const wobble = ((seed >> (i * 3)) & 15) - 7;
    return Math.max(28, Math.min(100, base + wobble - (6 - i)));
  });
}

export function getDashboardData(team: TeamSpace, block: BlockInstance): Partial<DashboardBlockData> {
  switch (block.type) {
    case "schedule": {
      const s = getBlockSettings<{
        mode: string;
        events: { title: string; dayOfWeek: number; time: string; location: string }[];
        externalUrl: string;
      }>(block);
      const events: ScheduleEvent[] = (s.events ?? []).map((ev) => ({
        title: ev.title,
        day: DAY[ev.dayOfWeek] ?? "?",
        time: ev.time,
        location: ev.location || undefined,
      }));
      const preview =
        events.length === 0
          ? [
              { title: "Team training", day: "Tue", time: "18:00", location: "Main hall" },
              { title: "Friendly match", day: "Sat", time: "10:30" },
            ]
          : events;
      return {
        schedule: {
          events: preview,
          externalUrl: s.externalUrl?.trim() || undefined,
          next: preview[0],
        },
      };
    }
    case "attendance": {
      const att = team.blocks.find((b) => b.type === "attendance") ?? block;
      const roster = getBlockSettings<{ roster: { name: string }[] }>(att).roster ?? [];
      const rosterCount = roster.filter((p) => p.name?.trim()).length;
      const count = rosterCount || 12;
      const weekBars = weeklyTrendBars(team.id, count);
      const weeklyRate = Math.round(weekBars.reduce((a, b) => a + b, 0) / weekBars.length);
      return {
        attendance: {
          rosterCount: count,
          weeklyRate,
          weekBars,
          label: rosterCount ? `${rosterCount} athletes` : "Team roster",
        },
      };
    }
    case "camp_trip": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const items = (s.items ?? [])
        .filter((r) => r.title?.trim())
        .map((r) => ({ title: r.title!, body: r.body }));
      return {
        camp_trip: {
          items:
            items.length > 0
              ? items
              : [
                  { title: "Away day", body: "Bus 17:15 · kit list inside" },
                  { title: "Hotel check-in", body: "Parents notified" },
                ],
        },
      };
    }
    case "documents": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const docs = (s.items ?? []).filter((r) => r.title?.trim()).map((r) => ({ title: r.title! }));
      return {
        documents: {
          docs:
            docs.length > 0
              ? docs
              : [{ title: "Team code of conduct" }, { title: "Training expectations" }],
        },
      };
    }
    case "polls": {
      const s = getBlockSettings<PollSettings>(block);
      const q = s.question?.trim();
      const options = [s.optionYes, s.optionNo].filter((o) => o?.trim()) as string[];
      return {
        polls: {
          question: q || "Pizza after practice on Friday?",
          options: options.length ? options : ["Yes", "No"],
        },
      };
    }
    case "team_feed": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const posts = (s.items ?? [])
        .filter((r) => r.title?.trim())
        .map((r) => ({ title: r.title!, body: r.body }));
      return {
        team_feed: {
          posts:
            posts.length > 0
              ? posts
              : [{ title: "Regional finals Sunday", body: "Meet at 9:30 · full kit" }],
        },
      };
    }
    case "achievements": {
      const s = getBlockSettings<{ cards: { icon: string; title: string; player: string }[] }>(block);
      const cards = (s.cards ?? []).map((c) => ({
        icon: c.icon || "🏆",
        title: c.title,
        player: c.player,
      }));
      return {
        achievements: {
          cards:
            cards.length > 0
              ? cards
              : [
                  { icon: "🏆", title: "Cup winners", player: "Team" },
                  { icon: "⭐", title: "Player of the week", player: "Maya" },
                  { icon: "🥇", title: "Fair play award", player: "Alex" },
                ],
        },
      };
    }
    case "gallery": {
      const s = getBlockSettings<{ mode: string; images: { url: string }[]; externalUrl: string }>(block);
      const images = (s.images ?? []).map((i) => i.url).filter(Boolean);
      const external = s.externalUrl?.trim();
      return {
        gallery: {
          images,
          externalUrl: external,
          albumMode: s.mode === "external" && Boolean(external),
        },
      };
    }
    case "results": {
      const settings = getResultsBoardSettings(block);
      const computed = computeResultsBoard(settings);
      const items = computed.leaderboard.slice(0, 6).map((r) => ({
        name: r.athleteName,
        subtitle: `${r.totalPoints} pts`,
        emoji: r.rank === 1 ? "🏆" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : "🏅",
      }));
      return { results: { items } };
    }
    case "contacts": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const items = (s.items ?? [])
        .filter((r) => r.name?.trim())
        .map((r) => ({ name: r.name!, role: r.role }));
      return {
        contacts: {
          items: items.length > 0 ? items : [{ name: "Coach Maria", role: "Head coach" }],
        },
      };
    }
    case "calendar": {
      const s = getBlockSettings<{ externalUrl: string }>(block);
      return { calendar: { externalUrl: s.externalUrl?.trim() } };
    }
    case "quick_links": {
      const s = getBlockSettings<Record<string, string>>(block);
      const labels = ["WhatsApp", "Telegram", "Instagram", "Website"].filter((_, i) => {
        const keys = ["whatsapp", "telegram", "instagram", "website"];
        return s[keys[i]]?.trim();
      });
      return { quick_links: { labels: labels.length ? labels : ["Chat", "Follow"] } };
    }
    case "payments": {
      const s = getBlockSettings<PaymentLinkSettings>(block);
      return {
        payments: {
          title: s.title?.trim() || "Payments",
          description: s.description?.trim(),
          buttonLabel: s.buttonLabel?.trim() || "Pay now",
          hasUrl: Boolean(toExternalHref(s.paymentUrl ?? "")),
        },
      };
    }
    case "quick_actions": {
      const s = getBlockSettings<QuickActionsSettings>(block);
      const valid = (s.actions ?? []).filter((a) => a.title?.trim() && toExternalHref(a.url ?? ""));
      return {
        quick_actions: {
          title: s.sectionTitle?.trim() || "Quick actions",
          count: valid.length,
          previews: valid.slice(0, 4).map((a) => ({
            icon: a.icon,
            title: a.title.trim(),
          })),
        },
      };
    }
    case "team_shop": {
      const s = getBlockSettings<{ sectionTitle?: string; products: { name?: string; price?: string; imageUrl?: string; productUrl?: string }[] }>(block);
      const valid = (s.products ?? []).filter((p) => p.name?.trim() && toExternalHref(p.productUrl ?? ""));
      return {
        team_shop: {
          title: s.sectionTitle?.trim() || "Team Shop",
          count: valid.length,
          previews: valid.slice(0, 3).map((p) => ({
            name: p.name!.trim(),
            price: p.price?.trim(),
            imageUrl: p.imageUrl?.trim(),
          })),
        },
      };
    }
    case "weather": {
      const s = getBlockSettings<{ temp?: string; note?: string; location?: string }>(block);
      return {
        weather: {
          temp: s.temp?.trim() || "18°",
          note: s.note?.trim() || "Outdoor pitch",
          location: s.location?.trim(),
        },
      };
    }
    case "countdown": {
      const s = getBlockSettings<{ label?: string; targetDate?: string }>(block);
      const target = s.targetDate?.trim();
      let parts: { days: number; hrs: number; min: number } | undefined;
      if (target) {
        const diff = Math.max(0, new Date(target).getTime() - Date.now());
        parts = {
          days: Math.floor(diff / 86400000),
          hrs: Math.floor((diff % 86400000) / 3600000),
          min: Math.floor((diff % 3600000) / 60000),
        };
      } else {
        parts = { days: 12, hrs: 4, min: 30 };
      }
      return {
        countdown: {
          label: s.label?.trim() || "Next competition",
          targetLabel: target
            ? new Date(target).toLocaleDateString(undefined, { month: "short", day: "numeric" })
            : "Soon",
          parts,
        },
      };
    }
    case "birthdays": {
      const att = team.blocks.find((b) => b.type === "attendance");
      const roster =
        att != null
          ? getBlockSettings<{ roster: { name: string; birthday?: string }[] }>(att).roster ?? []
          : [];
      const items = roster
        .filter((p) => p.name?.trim() && p.birthday?.trim())
        .map((p) => ({ name: p.name!, date: p.birthday! }));
      return {
        birthdays: {
          items: items.length > 0 ? items : [{ name: "Sam", date: "Jun 12" }],
        },
      };
    }
    case "sponsors": {
      const s = getBlockSettings<ListBlockSettings>(block);
      const names = (s.items ?? []).filter((r) => r.name?.trim()).map((r) => r.name!);
      return { sponsors: { names: names.length > 0 ? names : ["Local Sport Shop"] } };
    }
    case "integrations": {
      const s = getBlockSettings<{
        sectionTitle?: string;
        links: { label?: string; url: string }[];
      }>(block);
      const previews = (s.links ?? [])
        .filter((l) => l.url?.trim())
        .slice(0, 3)
        .map((l) => {
          const label = l.label?.trim() || "Link";
          let host = label;
          try {
            host = new URL(l.url).hostname.replace(/^www\./, "");
          } catch {
            /* keep label */
          }
          return { label, host };
        });
      return {
        integrations: {
          title: s.sectionTitle?.trim() || "Integrations",
          previews:
            previews.length > 0
              ? previews
              : [{ label: "Game film", host: "hudl.com" }],
        },
      };
    }
    default:
      return {};
  }
}
