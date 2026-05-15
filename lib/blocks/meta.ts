import type { BlockInstance, BlockType } from "@/lib/types";

export type BlockCategory = "identity" | "updates" | "schedule" | "community" | "extras";

export type BlockMeta = {
  type: BlockType;
  title: string;
  emoji: string;
  description: string;
  category: BlockCategory;
  /** Shown first in builder (announcement, identity, etc.) */
  priority: number;
  canDisable: boolean;
  defaultLayout: BlockInstance["layout"];
};

export const BLOCK_META: Record<BlockType, BlockMeta> = {
  announcement_bar: {
    type: "announcement_bar",
    title: "Announcement bar",
    emoji: "📣",
    description: "Pin urgent news at the top — trainings, camps, deadlines.",
    category: "updates",
    priority: 0,
    canDisable: true,
    defaultLayout: "full",
  },
  hero: {
    type: "hero",
    title: "Team identity",
    emoji: "✨",
    description: "Logo, cover, motto, and social links families see first.",
    category: "identity",
    priority: 1,
    canDisable: false,
    defaultLayout: "featured",
  },
  quick_links: {
    type: "quick_links",
    title: "Quick links",
    emoji: "🔗",
    description: "WhatsApp, Telegram, forms — one tap for parents.",
    category: "identity",
    priority: 2,
    canDisable: true,
    defaultLayout: "half",
  },
  calendar: {
    type: "calendar",
    title: "Calendar",
    emoji: "📅",
    description: "Google Calendar or iCal embed.",
    category: "schedule",
    priority: 3,
    canDisable: true,
    defaultLayout: "full",
  },
  schedule: {
    type: "schedule",
    title: "Weekly schedule",
    emoji: "🗓️",
    description: "Recurring trainings & meets — like Google Calendar.",
    category: "schedule",
    priority: 4,
    canDisable: true,
    defaultLayout: "full",
  },
  results: {
    type: "results",
    title: "Results board",
    emoji: "🏁",
    description: "Scores, placements, and meet outcomes.",
    category: "community",
    priority: 5,
    canDisable: true,
    defaultLayout: "half",
  },
  achievements: {
    type: "achievements",
    title: "Achievements",
    emoji: "🏆",
    description: "Trophies & MVP cards kids love to collect.",
    category: "community",
    priority: 6,
    canDisable: true,
    defaultLayout: "card",
  },
  gallery: {
    type: "gallery",
    title: "Photo gallery",
    emoji: "📸",
    description: "Upload photos or link Google Photos / Dropbox.",
    category: "community",
    priority: 7,
    canDisable: true,
    defaultLayout: "card",
  },
  attendance: {
    type: "attendance",
    title: "Attendance",
    emoji: "✅",
    description: "Track who showed up — needs a roster.",
    category: "community",
    priority: 8,
    canDisable: true,
    defaultLayout: "half",
  },
  birthdays: {
    type: "birthdays",
    title: "Birthdays",
    emoji: "🎂",
    description: "Celebrate players — uses roster birthdays.",
    category: "community",
    priority: 9,
    canDisable: true,
    defaultLayout: "half",
  },
  team_feed: {
    type: "team_feed",
    title: "Team feed",
    emoji: "💬",
    description: "News and reactions in one stream.",
    category: "updates",
    priority: 10,
    canDisable: true,
    defaultLayout: "full",
  },
  camp_trip: {
    type: "camp_trip",
    title: "Camp & trip",
    emoji: "🚌",
    description: "Away trips, packing lists, bus times.",
    category: "extras",
    priority: 11,
    canDisable: true,
    defaultLayout: "featured",
  },
  contacts: {
    type: "contacts",
    title: "Contacts",
    emoji: "📞",
    description: "Coaches and club contacts.",
    category: "extras",
    priority: 12,
    canDisable: true,
    defaultLayout: "half",
  },
  documents: {
    type: "documents",
    title: "Documents",
    emoji: "📄",
    description: "PDFs, waivers, handbooks.",
    category: "extras",
    priority: 13,
    canDisable: true,
    defaultLayout: "half",
  },
  polls: {
    type: "polls",
    title: "Polls",
    emoji: "📊",
    description: "Quick parent votes.",
    category: "extras",
    priority: 14,
    canDisable: true,
    defaultLayout: "half",
  },
  sponsors: {
    type: "sponsors",
    title: "Partners",
    emoji: "🤝",
    description: "Sponsor logos and thanks.",
    category: "extras",
    priority: 15,
    canDisable: true,
    defaultLayout: "card",
  },
  weather: {
    type: "weather",
    title: "Weather",
    emoji: "🌤️",
    description: "Field conditions at a glance.",
    category: "extras",
    priority: 16,
    canDisable: true,
    defaultLayout: "half",
  },
  countdown: {
    type: "countdown",
    title: "Countdown",
    emoji: "⏱️",
    description: "Days until the next big event.",
    category: "extras",
    priority: 17,
    canDisable: true,
    defaultLayout: "half",
  },
};

export function builderSortBlocks(blocks: BlockInstance[]): BlockInstance[] {
  return [...blocks].sort((a, b) => {
    const pa = BLOCK_META[a.type]?.priority ?? 99;
    const pb = BLOCK_META[b.type]?.priority ?? 99;
    if (pa !== pb) return pa - pb;
    return a.order - b.order;
  });
}
