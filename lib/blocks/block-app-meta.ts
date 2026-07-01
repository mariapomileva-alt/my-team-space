import type { BlockType } from "@/lib/types";

export type BlockAppMeta = {
  emoji: string;
  /** Short branded mark for premium / performance icon tiles */
  mark: string;
  title: string;
  subtitle: string;
  /** Tailwind accent for icon tile */
  tileClass: string;
};

export const BLOCK_APP_META: Record<BlockType, BlockAppMeta> = {
  hero: {
    emoji: "✨",
    mark: "TM",
    title: "Our team",
    subtitle: "Welcome",
    tileClass: "bg-indigo-100 text-indigo-700",
  },
  announcement_bar: {
    emoji: "📣",
    mark: "NE",
    title: "Announcements",
    subtitle: "Latest news",
    tileClass: "bg-violet-100 text-violet-700",
  },
  gallery: {
    emoji: "📸",
    mark: "GL",
    title: "Team gallery",
    subtitle: "Photos & albums",
    tileClass: "bg-rose-100 text-rose-700",
  },
  schedule: {
    emoji: "📅",
    mark: "SC",
    title: "Schedule",
    subtitle: "Training & events",
    tileClass: "bg-sky-100 text-sky-700",
  },
  calendar: {
    emoji: "🗓️",
    mark: "CA",
    title: "Calendar",
    subtitle: "Full season view",
    tileClass: "bg-blue-100 text-blue-700",
  },
  attendance: {
    emoji: "✅",
    mark: "AT",
    title: "Attendance",
    subtitle: "Who was at practice",
    tileClass: "bg-emerald-100 text-emerald-700",
  },
  camp_trip: {
    emoji: "🚌",
    mark: "TR",
    title: "Trips",
    subtitle: "Travel & checklist",
    tileClass: "bg-amber-100 text-amber-800",
  },
  documents: {
    emoji: "📋",
    mark: "DC",
    title: "Rules & documents",
    subtitle: "Expectations & PDFs",
    tileClass: "bg-neutral-100 text-neutral-700",
  },
  results: {
    emoji: "🏅",
    mark: "RS",
    title: "Results board",
    subtitle: "Leaderboard, medals & season story",
    tileClass: "bg-yellow-100 text-yellow-800",
  },
  achievements: {
    emoji: "🏆",
    mark: "AC",
    title: "Cups & achievements",
    subtitle: "Trophies & stars",
    tileClass: "bg-amber-100 text-amber-800",
  },
  team_feed: {
    emoji: "💬",
    mark: "FD",
    title: "Announcements",
    subtitle: "Team updates",
    tileClass: "bg-indigo-100 text-indigo-700",
  },
  contacts: {
    emoji: "👋",
    mark: "CT",
    title: "Contacts",
    subtitle: "Coaches & staff",
    tileClass: "bg-teal-100 text-teal-800",
  },
  quick_links: {
    emoji: "🔗",
    mark: "LK",
    title: "Social links",
    subtitle: "Chat & follow us",
    tileClass: "bg-fuchsia-100 text-fuchsia-700",
  },
  payments: {
    emoji: "💳",
    mark: "PY",
    title: "Payments",
    subtitle: "Membership & fees",
    tileClass: "bg-sky-100 text-sky-800",
  },
  quick_actions: {
    emoji: "⚡",
    mark: "QA",
    title: "Quick actions",
    subtitle: "Links & registration",
    tileClass: "bg-amber-100 text-amber-900",
  },
  team_shop: {
    emoji: "🛍",
    mark: "SH",
    title: "Team shop",
    subtitle: "Merch & uniforms",
    tileClass: "bg-rose-100 text-rose-800",
  },
  integrations: {
    emoji: "🧩",
    mark: "IN",
    title: "Smart integrations",
    subtitle: "Garmin, YouTube & more",
    tileClass: "bg-indigo-100 text-indigo-700",
  },
  resources: {
    emoji: "📚",
    mark: "RF",
    title: "Resources",
    subtitle: "PDFs, plans & files",
    tileClass: "bg-teal-100 text-teal-800",
  },
  polls: {
    emoji: "🗳️",
    mark: "PL",
    title: "Quick poll",
    subtitle: "Tap to vote",
    tileClass: "bg-purple-100 text-purple-700",
  },
  sponsors: {
    emoji: "🤝",
    mark: "SP",
    title: "Partners",
    subtitle: "Sponsors & supporters",
    tileClass: "bg-slate-100 text-slate-700",
  },
  weather: {
    emoji: "🌤️",
    mark: "WX",
    title: "Venue & weather",
    subtitle: "Outdoor / hall",
    tileClass: "bg-cyan-100 text-cyan-800",
  },
  countdown: {
    emoji: "⏱️",
    mark: "CD",
    title: "Countdown",
    subtitle: "Next big day",
    tileClass: "bg-orange-100 text-orange-800",
  },
  birthdays: {
    emoji: "🎂",
    mark: "BD",
    title: "Birthdays",
    subtitle: "Celebrate the squad",
    tileClass: "bg-pink-100 text-pink-700",
  },
};

/** Blocks rendered outside the tappable card grid */
export const APP_CHROME_BLOCK_TYPES = new Set<BlockType>(["hero", "announcement_bar"]);
