import type { ThemeId } from "./types";

export type StylePresetId = "kids_fun" | "sports_club" | "premium_academy" | "dark_mode" | "custom";

export type StylePreset = {
  id: StylePresetId;
  emoji: string;
  label: string;
  description: string;
  /** Primary theme applied when this mood is chosen */
  themeId: ThemeId | null;
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "kids_fun",
    emoji: "🎉",
    label: "Kids & Fun",
    description: "Soft pastels — friendly for kids & parents",
    themeId: "pastel_youth",
  },
  {
    id: "sports_club",
    emoji: "🏆",
    label: "Sports Club",
    description: "High-energy orange — training day vibes",
    themeId: "energetic_orange",
  },
  {
    id: "premium_academy",
    emoji: "✨",
    label: "Premium Academy",
    description: "Deep green trust — polished club feel",
    themeId: "premium_forest",
  },
  {
    id: "dark_mode",
    emoji: "◼️",
    label: "Chrome",
    description: "Black & white editorial — solid and timeless",
    themeId: "minimal_mono",
  },
  {
    id: "custom",
    emoji: "🎨",
    label: "Custom",
    description: "Pick your own palette",
    themeId: null,
  },
];

const PRESET_THEME_IDS = new Set(
  STYLE_PRESETS.map((p) => p.themeId).filter(Boolean) as ThemeId[],
);

export function stylePresetForTheme(themeId: ThemeId): StylePresetId {
  const match = STYLE_PRESETS.find((p) => p.themeId === themeId);
  if (match) return match.id;
  return "custom";
}

export function isCustomTheme(themeId: ThemeId): boolean {
  return !PRESET_THEME_IDS.has(themeId);
}
