import type { ThemeId } from "@/lib/types";

export type TeamColorPalette = {
  themeId: ThemeId;
  emoji: string;
  label: string;
  description: string;
};

/** Layer 2 — recolors the page without changing personality rhythm. */
export const TEAM_COLOR_PALETTES: TeamColorPalette[] = [
  {
    themeId: "ocean_aqua",
    emoji: "🌊",
    label: "Ocean",
    description: "Cool aqua blues — clear and confident",
  },
  {
    themeId: "premium_forest",
    emoji: "🌲",
    label: "Forest",
    description: "Deep green trust — academies & outdoor clubs",
  },
  {
    themeId: "pastel_youth",
    emoji: "💜",
    label: "Purple",
    description: "Soft violet pastels — friendly and warm",
  },
  {
    themeId: "energetic_orange",
    emoji: "🏆",
    label: "Sports Club",
    description: "High-energy orange — training day vibes",
  },
  {
    themeId: "minimal_mono",
    emoji: "◻️",
    label: "Mono",
    description: "Editorial black & white calm",
  },
  {
    themeId: "dark_athletic",
    emoji: "🌙",
    label: "Dark",
    description: "Night mode with electric highlights",
  },
];

export function paletteForTheme(themeId: ThemeId): TeamColorPalette {
  return TEAM_COLOR_PALETTES.find((p) => p.themeId === themeId) ?? TEAM_COLOR_PALETTES[0]!;
}
