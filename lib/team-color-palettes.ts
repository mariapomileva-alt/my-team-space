import type { TeamSpace, ThemeId } from "@/lib/types";
import { getTheme } from "@/lib/themes";

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
    themeId: "sunset_coral",
    emoji: "🌅",
    label: "Sunset",
    description: "Coral & peach glow — creative and expressive",
  },
  {
    themeId: "minimal_mono",
    emoji: "◼️",
    label: "Chrome",
    description: "Black & white editorial — solid and timeless",
  },
];

/** Retired dark palette — existing teams fall back to Chrome at render time. */
export function resolvePaletteThemeId(themeId: ThemeId): ThemeId {
  if (themeId === "dark_athletic") return "minimal_mono";
  return themeId;
}

export function paletteForTheme(themeId: ThemeId): TeamColorPalette {
  const resolved = resolvePaletteThemeId(themeId);
  return TEAM_COLOR_PALETTES.find((p) => p.themeId === resolved) ?? TEAM_COLOR_PALETTES[0]!;
}

export function paletteShellClassName(themeId: ThemeId): string {
  return resolvePaletteThemeId(themeId) === "minimal_mono" ? "mts-palette--chrome" : "";
}

/** One-time upgrade for teams still saved on the retired dark palette. */
export function migrateRetiredPalette(team: TeamSpace): Partial<TeamSpace> | null {
  if (team.themeId !== "dark_athletic") return null;
  const chrome = getTheme("minimal_mono");
  const vars = chrome.cssVars as Record<string, string>;
  return {
    themeId: "minimal_mono",
    primaryColor: vars["--mts-primary"] ?? team.primaryColor,
    secondaryColor: vars["--mts-accent"] ?? team.secondaryColor,
  };
}

export function normalizeBuilderTeam(team: TeamSpace): TeamSpace {
  const patch = migrateRetiredPalette(team);
  return patch ? { ...team, ...patch } : team;
}
