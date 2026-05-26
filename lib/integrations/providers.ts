import type { IntegrationCategory } from "@/lib/integrations/types";

export type { IntegrationCategory };

export type IntegrationProvider = {
  id: string;
  name: string;
  emoji: string;
  category: IntegrationCategory;
  /** Hero gradient on featured cards */
  cardClass: string;
  /** Pill / badge on light backgrounds */
  pillClass: string;
  /** Soft icon tile background */
  tileClass: string;
  patterns: RegExp[];
};

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
  {
    id: "garmin",
    name: "Garmin",
    emoji: "⌚",
    category: "fitness",
    cardClass: "from-sky-500 to-blue-700",
    pillClass: "bg-sky-100 text-sky-800 ring-sky-200/80",
    tileClass: "bg-sky-50 text-sky-700",
    patterns: [/connect\.garmin\.com/i, /garmin\.com\/connect/i],
  },
  {
    id: "trainingpeaks",
    name: "TrainingPeaks",
    emoji: "📈",
    category: "fitness",
    cardClass: "from-violet-600 to-indigo-800",
    pillClass: "bg-violet-100 text-violet-800 ring-violet-200/80",
    tileClass: "bg-violet-50 text-violet-700",
    patterns: [/trainingpeaks\.com/i],
  },
  {
    id: "strava",
    name: "Strava",
    emoji: "🚴",
    category: "fitness",
    cardClass: "from-orange-500 to-red-600",
    pillClass: "bg-orange-100 text-orange-800 ring-orange-200/80",
    tileClass: "bg-orange-50 text-orange-700",
    patterns: [/strava\.com/i],
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    emoji: "📅",
    category: "calendar",
    cardClass: "from-blue-500 to-indigo-600",
    pillClass: "bg-blue-100 text-blue-800 ring-blue-200/80",
    tileClass: "bg-blue-50 text-blue-700",
    patterns: [/calendar\.google\.com/i, /google\.com\/calendar/i],
  },
  {
    id: "google_photos",
    name: "Google Photos",
    emoji: "🖼️",
    category: "photos",
    cardClass: "from-amber-400 to-rose-500",
    pillClass: "bg-rose-100 text-rose-800 ring-rose-200/80",
    tileClass: "bg-rose-50 text-rose-700",
    patterns: [/photos\.google\.com/i, /photos\.app\.goo\.gl/i],
  },
  {
    id: "youtube",
    name: "YouTube",
    emoji: "▶️",
    category: "video",
    cardClass: "from-red-600 to-red-800",
    pillClass: "bg-red-100 text-red-800 ring-red-200/80",
    tileClass: "bg-red-50 text-red-700",
    patterns: [/youtube\.com/i, /youtu\.be/i],
  },
  {
    id: "vimeo",
    name: "Vimeo",
    emoji: "🎬",
    category: "video",
    cardClass: "from-cyan-500 to-blue-700",
    pillClass: "bg-cyan-100 text-cyan-800 ring-cyan-200/80",
    tileClass: "bg-cyan-50 text-cyan-700",
    patterns: [/vimeo\.com/i],
  },
  {
    id: "instagram",
    name: "Instagram",
    emoji: "📷",
    category: "social",
    cardClass: "from-fuchsia-500 via-pink-500 to-orange-400",
    pillClass: "bg-pink-100 text-pink-800 ring-pink-200/80",
    tileClass: "bg-pink-50 text-pink-700",
    patterns: [/instagram\.com/i, /instagr\.am/i],
  },
  {
    id: "tiktok",
    name: "TikTok",
    emoji: "🎵",
    category: "social",
    cardClass: "from-zinc-800 to-zinc-950",
    pillClass: "bg-zinc-200 text-zinc-800 ring-zinc-300/80",
    tileClass: "bg-zinc-100 text-zinc-800",
    patterns: [/tiktok\.com/i],
  },
  {
    id: "telegram",
    name: "Telegram",
    emoji: "✈️",
    category: "chat",
    cardClass: "from-sky-400 to-blue-600",
    pillClass: "bg-sky-100 text-sky-800 ring-sky-200/80",
    tileClass: "bg-sky-50 text-sky-700",
    patterns: [/t\.me\//i, /telegram\.(me|org)/i],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    emoji: "💬",
    category: "chat",
    cardClass: "from-emerald-500 to-green-700",
    pillClass: "bg-emerald-100 text-emerald-800 ring-emerald-200/80",
    tileClass: "bg-emerald-50 text-emerald-700",
    patterns: [/wa\.me\//i, /whatsapp\.com/i, /chat\.whatsapp\.com/i],
  },
  {
    id: "notion",
    name: "Notion",
    emoji: "📝",
    category: "docs",
    cardClass: "from-zinc-700 to-zinc-900",
    pillClass: "bg-zinc-200 text-zinc-800 ring-zinc-300/80",
    tileClass: "bg-zinc-100 text-zinc-800",
    patterns: [/notion\.so/i, /notion\.site/i],
  },
  {
    id: "google_drive",
    name: "Google Drive",
    emoji: "📁",
    category: "docs",
    cardClass: "from-amber-400 to-yellow-600",
    pillClass: "bg-amber-100 text-amber-900 ring-amber-200/80",
    tileClass: "bg-amber-50 text-amber-800",
    patterns: [/drive\.google\.com/i, /docs\.google\.com/i],
  },
  {
    id: "spotify",
    name: "Spotify",
    emoji: "🎧",
    category: "music",
    cardClass: "from-emerald-600 to-green-800",
    pillClass: "bg-green-100 text-green-800 ring-green-200/80",
    tileClass: "bg-green-50 text-green-700",
    patterns: [/open\.spotify\.com/i, /spotify\.com/i],
  },
  {
    id: "canva",
    name: "Canva",
    emoji: "🎨",
    category: "design",
    cardClass: "from-cyan-400 to-violet-600",
    pillClass: "bg-cyan-100 text-cyan-800 ring-cyan-200/80",
    tileClass: "bg-cyan-50 text-cyan-700",
    patterns: [/canva\.com/i],
  },
  {
    id: "hudl",
    name: "Hudl",
    emoji: "🏈",
    category: "sports",
    cardClass: "from-orange-600 to-amber-800",
    pillClass: "bg-orange-100 text-orange-900 ring-orange-200/80",
    tileClass: "bg-orange-50 text-orange-800",
    patterns: [/hudl\.com/i],
  },
  {
    id: "veo",
    name: "Veo",
    emoji: "📹",
    category: "sports",
    cardClass: "from-indigo-600 to-violet-800",
    pillClass: "bg-indigo-100 text-indigo-800 ring-indigo-200/80",
    tileClass: "bg-indigo-50 text-indigo-700",
    patterns: [/veo\.co/i],
  },
  {
    id: "utr",
    name: "UTR",
    emoji: "🎾",
    category: "sports",
    cardClass: "from-lime-500 to-green-700",
    pillClass: "bg-lime-100 text-lime-900 ring-lime-200/80",
    tileClass: "bg-lime-50 text-lime-800",
    patterns: [/utrsports\.net/i, /myutr\.com/i],
  },
  {
    id: "tournamentsoftware",
    name: "Tournament Software",
    emoji: "🏆",
    category: "sports",
    cardClass: "from-blue-600 to-indigo-800",
    pillClass: "bg-blue-100 text-blue-800 ring-blue-200/80",
    tileClass: "bg-blue-50 text-blue-700",
    patterns: [/tournamentsoftware\.com/i],
  },
];

export const GENERIC_PROVIDER: IntegrationProvider = {
  id: "link",
  name: "Link",
  emoji: "🔗",
  category: "other",
  cardClass: "from-indigo-500 to-violet-700",
  pillClass: "bg-indigo-100 text-indigo-800 ring-indigo-200/80",
  tileClass: "bg-indigo-50 text-indigo-700",
  patterns: [],
};

export function detectIntegrationProvider(url: string): IntegrationProvider {
  const trimmed = url.trim();
  if (!trimmed) return GENERIC_PROVIDER;
  for (const p of INTEGRATION_PROVIDERS) {
    if (p.patterns.some((re) => re.test(trimmed))) return p;
  }
  return GENERIC_PROVIDER;
}

export function youtubeVideoId(url: string): string | null {
  const u = url.trim();
  const short = u.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/)?.[1];
  if (short) return short;
  const watch = u.match(/[?&]v=([a-zA-Z0-9_-]{6,})/)?.[1];
  if (watch) return watch;
  const embed = u.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/)?.[1];
  return embed ?? null;
}

export function vimeoVideoId(url: string): string | null {
  return url.trim().match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? null;
}
