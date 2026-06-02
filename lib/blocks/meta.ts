import type { BlockInstance, BlockType } from "@/lib/types";

/** Builder sections — simple mental model for coaches */
export type BuilderSection = "essential" | "engagement" | "advanced";

export type BlockPreviewShape = "bar" | "hero" | "grid" | "list" | "stat" | "card" | "links";

export type BlockMeta = {
  type: BlockType;
  title: string;
  emoji: string;
  description: string;
  section: BuilderSection;
  previewShape: BlockPreviewShape;
  priority: number;
  canDisable: boolean;
  defaultLayout: BlockInstance["layout"];
};

export const BUILDER_SECTION_LABELS: Record<BuilderSection, { title: string; hint: string }> = {
  essential: {
    title: "Essential",
    hint: "Identity, calendar, contacts — what every family needs first.",
  },
  engagement: {
    title: "Engagement",
    hint: "Gallery, polls, results — keep the community excited.",
  },
  advanced: {
    title: "Advanced",
    hint: "Attendance, trips, documents — optional power tools.",
  },
};

export const BUILDER_SECTION_ORDER: BuilderSection[] = ["essential", "engagement", "advanced"];

export const BLOCK_META: Record<BlockType, BlockMeta> = {
  announcement_bar: {
    type: "announcement_bar",
    title: "Announcement bar",
    emoji: "📣",
    description: "Sticky updates — trainings, buses, deadlines.",
    section: "essential",
    previewShape: "bar",
    priority: 0,
    canDisable: true,
    defaultLayout: "full",
  },
  hero: {
    type: "hero",
    title: "Team identity",
    emoji: "✨",
    description: "Logo, cover, motto, social links — this is OUR team.",
    section: "essential",
    previewShape: "hero",
    priority: 1,
    canDisable: false,
    defaultLayout: "featured",
  },
  calendar: {
    type: "calendar",
    title: "Calendar",
    emoji: "📅",
    description: "Google Calendar embed or iCal link.",
    section: "essential",
    previewShape: "card",
    priority: 2,
    canDisable: true,
    defaultLayout: "full",
  },
  schedule: {
    type: "schedule",
    title: "Weekly schedule",
    emoji: "🗓️",
    description: "Recurring trainings & meets.",
    section: "essential",
    previewShape: "list",
    priority: 3,
    canDisable: true,
    defaultLayout: "full",
  },
  contacts: {
    type: "contacts",
    title: "Contacts",
    emoji: "📞",
    description: "Coaches and club contacts.",
    section: "essential",
    previewShape: "list",
    priority: 4,
    canDisable: true,
    defaultLayout: "half",
  },
  quick_links: {
    type: "quick_links",
    title: "Quick links",
    emoji: "🔗",
    description: "WhatsApp, Telegram, Instagram — one tap.",
    section: "essential",
    previewShape: "links",
    priority: 5,
    canDisable: true,
    defaultLayout: "half",
  },
  payments: {
    type: "payments",
    title: "Payments",
    emoji: "💳",
    description: "Collect membership fees, camp payments, competition fees, or donations.",
    section: "essential",
    previewShape: "card",
    priority: 5.2,
    canDisable: true,
    defaultLayout: "featured",
  },
  quick_actions: {
    type: "quick_actions",
    title: "Quick Actions",
    emoji: "⚡",
    description: "Create important buttons for parents and athletes.",
    section: "essential",
    previewShape: "links",
    priority: 5.25,
    canDisable: true,
    defaultLayout: "full",
  },
  integrations: {
    type: "integrations",
    title: "Smart integrations",
    emoji: "🧩",
    description: "Strava, Garmin, YouTube, Google Calendar — one dashboard.",
    section: "essential",
    previewShape: "links",
    priority: 5.5,
    canDisable: true,
    defaultLayout: "full",
  },
  gallery: {
    type: "gallery",
    title: "Photo gallery",
    emoji: "📸",
    description: "Photos grid — paste album links or image URLs.",
    section: "engagement",
    previewShape: "grid",
    priority: 6,
    canDisable: true,
    defaultLayout: "card",
  },
  polls: {
    type: "polls",
    title: "Polls",
    emoji: "📊",
    description: "Quick parent votes with optional WhatsApp summaries.",
    section: "engagement",
    previewShape: "card",
    priority: 7,
    canDisable: true,
    defaultLayout: "half",
  },
  achievements: {
    type: "achievements",
    title: "Achievements",
    emoji: "🏆",
    description: "Trophies & highlights kids love.",
    section: "engagement",
    previewShape: "grid",
    priority: 8,
    canDisable: true,
    defaultLayout: "card",
  },
  results: {
    type: "results",
    title: "Results board",
    emoji: "🏁",
    description: "Season rankings, medals, and competition points.",
    section: "engagement",
    previewShape: "grid",
    priority: 9,
    canDisable: true,
    defaultLayout: "half",
  },
  team_feed: {
    type: "team_feed",
    title: "Team feed",
    emoji: "💬",
    description: "News and photos in one stream.",
    section: "engagement",
    previewShape: "list",
    priority: 10,
    canDisable: true,
    defaultLayout: "full",
  },
  attendance: {
    type: "attendance",
    title: "Attendance",
    emoji: "✅",
    description: "Who showed up — uses roster.",
    section: "advanced",
    previewShape: "stat",
    priority: 11,
    canDisable: true,
    defaultLayout: "half",
  },
  camp_trip: {
    type: "camp_trip",
    title: "Camp & logistics",
    emoji: "🚌",
    description: "Trips, buses, checklists, confirmations.",
    section: "advanced",
    previewShape: "list",
    priority: 12,
    canDisable: true,
    defaultLayout: "featured",
  },
  documents: {
    type: "documents",
    title: "Documents",
    emoji: "📄",
    description: "PDFs, waivers, handbooks.",
    section: "advanced",
    previewShape: "list",
    priority: 13,
    canDisable: true,
    defaultLayout: "half",
  },
  resources: {
    type: "resources",
    title: "Team resources",
    emoji: "📚",
    description: "PDFs, plans, music, travel notes — all in one place.",
    section: "advanced",
    previewShape: "list",
    priority: 13.5,
    canDisable: true,
    defaultLayout: "full",
  },
  birthdays: {
    type: "birthdays",
    title: "Birthdays",
    emoji: "🎂",
    description: "Celebrate players from roster.",
    section: "advanced",
    previewShape: "list",
    priority: 14,
    canDisable: true,
    defaultLayout: "half",
  },
  sponsors: {
    type: "sponsors",
    title: "Partners",
    emoji: "🤝",
    description: "Sponsor logos and thanks.",
    section: "advanced",
    previewShape: "grid",
    priority: 15,
    canDisable: true,
    defaultLayout: "card",
  },
  weather: {
    type: "weather",
    title: "Weather",
    emoji: "🌤️",
    description: "Field conditions at a glance.",
    section: "advanced",
    previewShape: "stat",
    priority: 16,
    canDisable: true,
    defaultLayout: "half",
  },
  countdown: {
    type: "countdown",
    title: "Countdown",
    emoji: "⏱️",
    description: "Days until the next big event.",
    section: "advanced",
    previewShape: "stat",
    priority: 17,
    canDisable: true,
    defaultLayout: "half",
  },
};

/** @deprecated use section */
export type BlockCategory = BuilderSection;

/** Coach-defined order (matches public team page). */
export function builderSortBlocks(blocks: BlockInstance[]): BlockInstance[] {
  return [...blocks].sort((a, b) => a.order - b.order);
}

export function groupBlocksBySection(blocks: BlockInstance[]): Record<BuilderSection, BlockInstance[]> {
  const groups: Record<BuilderSection, BlockInstance[]> = {
    essential: [],
    engagement: [],
    advanced: [],
  };
  for (const b of builderSortBlocks(blocks)) {
    const section = BLOCK_META[b.type]?.section ?? "advanced";
    groups[section].push(b);
  }
  return groups;
}

export function applyBlockOrder(
  blocks: BlockInstance[],
  ordered: BlockInstance[],
): BlockInstance[] {
  const orderMap = new Map(ordered.map((b, i) => [b.id, i]));
  return blocks.map((b) => ({
    ...b,
    order: orderMap.has(b.id) ? orderMap.get(b.id)! : b.order,
  }));
}
