import type { BlockType } from "@/lib/types";

export type BlockAppMeta = {
  emoji: string;
  title: string;
  subtitle: string;
  /** Tailwind accent for icon tile */
  tileClass: string;
};

export const BLOCK_APP_META: Record<BlockType, BlockAppMeta> = {
  hero: {
    emoji: "✨",
    title: "Our team",
    subtitle: "Welcome",
    tileClass: "bg-indigo-100 text-indigo-700",
  },
  announcement_bar: {
    emoji: "📣",
    title: "Announcements",
    subtitle: "Latest news",
    tileClass: "bg-violet-100 text-violet-700",
  },
  gallery: {
    emoji: "📸",
    title: "Gallery",
    subtitle: "Photos from the team",
    tileClass: "bg-rose-100 text-rose-700",
  },
  schedule: {
    emoji: "📅",
    title: "Schedule",
    subtitle: "When we meet",
    tileClass: "bg-sky-100 text-sky-700",
  },
  calendar: {
    emoji: "🗓️",
    title: "Calendar",
    subtitle: "Full season view",
    tileClass: "bg-blue-100 text-blue-700",
  },
  attendance: {
    emoji: "✅",
    title: "Attendance",
    subtitle: "Who was at practice",
    tileClass: "bg-emerald-100 text-emerald-700",
  },
  camp_trip: {
    emoji: "🚌",
    title: "Trips",
    subtitle: "Travel & checklist",
    tileClass: "bg-amber-100 text-amber-800",
  },
  documents: {
    emoji: "📋",
    title: "Rules & documents",
    subtitle: "Expectations & PDFs",
    tileClass: "bg-neutral-100 text-neutral-700",
  },
  results: {
    emoji: "🏅",
    title: "Results",
    subtitle: "Season updates",
    tileClass: "bg-yellow-100 text-yellow-800",
  },
  achievements: {
    emoji: "✨",
    title: "Highlights",
    subtitle: "Moments & milestones",
    tileClass: "bg-amber-100 text-amber-800",
  },
  team_feed: {
    emoji: "💬",
    title: "Announcements",
    subtitle: "Team updates",
    tileClass: "bg-indigo-100 text-indigo-700",
  },
  contacts: {
    emoji: "👋",
    title: "Contacts",
    subtitle: "Reach the team",
    tileClass: "bg-teal-100 text-teal-800",
  },
  quick_links: {
    emoji: "🔗",
    title: "Social links",
    subtitle: "Chat & follow us",
    tileClass: "bg-fuchsia-100 text-fuchsia-700",
  },
  payments: {
    emoji: "💳",
    title: "Payments",
    subtitle: "Membership & fees",
    tileClass: "bg-sky-100 text-sky-800",
  },
  quick_actions: {
    emoji: "⚡",
    title: "Quick actions",
    subtitle: "Links & registration",
    tileClass: "bg-amber-100 text-amber-900",
  },
  team_shop: {
    emoji: "🛍",
    title: "Team shop",
    subtitle: "Merch & uniforms",
    tileClass: "bg-rose-100 text-rose-800",
  },
  integrations: {
    emoji: "🧩",
    title: "Smart integrations",
    subtitle: "Garmin, YouTube & more",
    tileClass: "bg-indigo-100 text-indigo-700",
  },
  resources: {
    emoji: "📚",
    title: "Resources",
    subtitle: "PDFs, plans & files",
    tileClass: "bg-teal-100 text-teal-800",
  },
  polls: {
    emoji: "🗳️",
    title: "Quick poll",
    subtitle: "Tap to vote",
    tileClass: "bg-purple-100 text-purple-700",
  },
  sponsors: {
    emoji: "🤝",
    title: "Partners",
    subtitle: "Sponsors & supporters",
    tileClass: "bg-slate-100 text-slate-700",
  },
  weather: {
    emoji: "🌤️",
    title: "Venue & weather",
    subtitle: "Outdoor / hall",
    tileClass: "bg-cyan-100 text-cyan-800",
  },
  countdown: {
    emoji: "⏱️",
    title: "Countdown",
    subtitle: "Next big day",
    tileClass: "bg-orange-100 text-orange-800",
  },
  birthdays: {
    emoji: "🎂",
    title: "Birthdays",
    subtitle: "Celebrate the squad",
    tileClass: "bg-pink-100 text-pink-700",
  },
};

/** Blocks rendered outside the tappable card grid */
export const APP_CHROME_BLOCK_TYPES = new Set<BlockType>(["hero", "announcement_bar"]);
