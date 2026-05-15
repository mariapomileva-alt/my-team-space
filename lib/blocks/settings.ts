import type { BlockInstance, BlockType } from "@/lib/types";

export type SocialKey = "instagram" | "telegram" | "whatsapp" | "tiktok" | "facebook" | "youtube";

export type ManualScheduleEvent = {
  id: string;
  title: string;
  eventType: "training" | "competition" | "camp" | "meeting";
  dayOfWeek: number;
  time: string;
  location: string;
  repeat: "none" | "weekly" | "biweekly" | "monthly" | "custom";
  ends: "never" | "date";
  endDate?: string;
};

export type AchievementCard = {
  id: string;
  icon: string;
  title: string;
  player: string;
  description: string;
  date?: string;
  imageUrl?: string;
};

export type RosterPlayer = {
  id: string;
  name: string;
  age?: string;
  role?: string;
  photoUrl?: string;
  birthday?: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  caption?: string;
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultSettingsForType(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "announcement_bar":
      return { message: "", urgent: false, accent: "theme", pinned: true };
    case "hero":
      return {
        quote: "Show up. Cheer loud. Grow together.",
        city: "",
        coverImageUrl: "",
        teamPhotoUrl: "",
        social: {} as Partial<Record<SocialKey, string>>,
      };
    case "schedule":
      return { mode: "manual", events: [] as ManualScheduleEvent[], externalUrl: "" };
    case "calendar":
      return { externalUrl: "" };
    case "gallery":
      return { mode: "manual", images: [] as GalleryImage[], externalUrl: "" };
    case "achievements":
      return { cards: [] as AchievementCard[] };
    case "attendance":
      return { enabledFeatures: { streaks: true, history: true } };
    case "quick_links":
      return {
        whatsapp: "",
        telegram: "",
        phone: "",
        customLabel: "",
        customUrl: "",
      };
    default:
      return {};
  }
}

export function getBlockSettings<T extends Record<string, unknown>>(
  block: BlockInstance,
): T {
  const defaults = defaultSettingsForType(block.type) as T;
  const raw = block.settings;
  if (!raw || typeof raw !== "object") return defaults;
  return { ...defaults, ...(raw as T) };
}

export function patchBlockSettings(
  block: BlockInstance,
  patch: Record<string, unknown>,
): BlockInstance {
  return {
    ...block,
    settings: { ...getBlockSettings(block), ...patch },
  };
}

export function newManualScheduleEvent(): ManualScheduleEvent {
  return {
    id: uid("evt"),
    title: "Training",
    eventType: "training",
    dayOfWeek: 2,
    time: "18:00",
    location: "",
    repeat: "weekly",
    ends: "never",
  };
}

export function newAchievementCard(): AchievementCard {
  return {
    id: uid("ach"),
    icon: "🏆",
    title: "Great job!",
    player: "",
    description: "",
  };
}

export function newRosterPlayer(): RosterPlayer {
  return { id: uid("ply"), name: "", role: "", age: "" };
}

export function newGalleryImage(): GalleryImage {
  return { id: uid("img"), url: "", caption: "" };
}

export const ACHIEVEMENT_ICONS = ["🏆", "🥇", "🥈", "🥉", "⭐", "🎖", "📜", "🔥", "❤️"] as const;

export const LAYOUT_OPTIONS: { value: NonNullable<BlockInstance["layout"]>; label: string }[] = [
  { value: "full", label: "Full width" },
  { value: "featured", label: "Featured hero" },
  { value: "half", label: "Half width" },
  { value: "card", label: "Card grid" },
];

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
