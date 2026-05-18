export type IntegrationCategory =
  | "fitness"
  | "video"
  | "calendar"
  | "photos"
  | "social"
  | "chat"
  | "docs"
  | "music"
  | "sports"
  | "design"
  | "other";

export type IntegrationProvider = {
  id: string;
  name: string;
  emoji: string;
  category: IntegrationCategory;
  /** Tailwind gradient for preview card */
  cardClass: string;
  patterns: RegExp[];
};

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
  {
    id: "garmin",
    name: "Garmin Connect",
    emoji: "⌚",
    category: "fitness",
    cardClass: "from-sky-500 to-blue-700",
    patterns: [/connect\.garmin\.com/i, /garmin\.com\/connect/i],
  },
  {
    id: "trainingpeaks",
    name: "TrainingPeaks",
    emoji: "📈",
    category: "fitness",
    cardClass: "from-violet-600 to-indigo-800",
    patterns: [/trainingpeaks\.com/i],
  },
  {
    id: "strava",
    name: "Strava",
    emoji: "🚴",
    category: "fitness",
    cardClass: "from-orange-500 to-red-600",
    patterns: [/strava\.com/i],
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    emoji: "📅",
    category: "calendar",
    cardClass: "from-blue-500 to-indigo-600",
    patterns: [/calendar\.google\.com/i, /google\.com\/calendar/i],
  },
  {
    id: "google_photos",
    name: "Google Photos",
    emoji: "🖼️",
    category: "photos",
    cardClass: "from-amber-400 to-rose-500",
    patterns: [/photos\.google\.com/i, /photos\.app\.goo\.gl/i],
  },
  {
    id: "youtube",
    name: "YouTube",
    emoji: "▶️",
    category: "video",
    cardClass: "from-red-600 to-red-800",
    patterns: [/youtube\.com/i, /youtu\.be/i],
  },
  {
    id: "vimeo",
    name: "Vimeo",
    emoji: "🎬",
    category: "video",
    cardClass: "from-cyan-500 to-blue-700",
    patterns: [/vimeo\.com/i],
  },
  {
    id: "instagram",
    name: "Instagram",
    emoji: "📷",
    category: "social",
    cardClass: "from-fuchsia-500 via-pink-500 to-orange-400",
    patterns: [/instagram\.com/i, /instagr\.am/i],
  },
  {
    id: "tiktok",
    name: "TikTok",
    emoji: "🎵",
    category: "social",
    cardClass: "from-zinc-900 to-zinc-700",
    patterns: [/tiktok\.com/i],
  },
  {
    id: "telegram",
    name: "Telegram",
    emoji: "✈️",
    category: "chat",
    cardClass: "from-sky-400 to-blue-600",
    patterns: [/t\.me\//i, /telegram\.(me|org)/i],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    emoji: "💬",
    category: "chat",
    cardClass: "from-emerald-500 to-green-700",
    patterns: [/wa\.me\//i, /whatsapp\.com/i, /chat\.whatsapp\.com/i],
  },
  {
    id: "notion",
    name: "Notion",
    emoji: "📝",
    category: "docs",
    cardClass: "from-zinc-700 to-zinc-900",
    patterns: [/notion\.so/i, /notion\.site/i],
  },
  {
    id: "google_drive",
    name: "Google Drive",
    emoji: "📁",
    category: "docs",
    cardClass: "from-amber-400 to-yellow-600",
    patterns: [/drive\.google\.com/i, /docs\.google\.com/i],
  },
  {
    id: "spotify",
    name: "Spotify",
    emoji: "🎧",
    category: "music",
    cardClass: "from-emerald-600 to-green-800",
    patterns: [/open\.spotify\.com/i, /spotify\.com/i],
  },
  {
    id: "canva",
    name: "Canva",
    emoji: "🎨",
    category: "design",
    cardClass: "from-cyan-400 to-violet-600",
    patterns: [/canva\.com/i],
  },
  {
    id: "hudl",
    name: "Hudl",
    emoji: "🏈",
    category: "sports",
    cardClass: "from-orange-600 to-amber-800",
    patterns: [/hudl\.com/i],
  },
  {
    id: "veo",
    name: "Veo",
    emoji: "📹",
    category: "sports",
    cardClass: "from-indigo-600 to-violet-800",
    patterns: [/veo\.co/i],
  },
  {
    id: "utr",
    name: "UTR",
    emoji: "🎾",
    category: "sports",
    cardClass: "from-lime-500 to-green-700",
    patterns: [/utrsports\.net/i, /myutr\.com/i],
  },
  {
    id: "tournamentsoftware",
    name: "Tournament Software",
    emoji: "🏆",
    category: "sports",
    cardClass: "from-blue-600 to-indigo-800",
    patterns: [/tournamentsoftware\.com/i],
  },
];

export const GENERIC_PROVIDER: IntegrationProvider = {
  id: "link",
  name: "External link",
  emoji: "🔗",
  category: "other",
  cardClass: "from-indigo-500 to-violet-700",
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

export function hostnameLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return "Open link";
  }
}
