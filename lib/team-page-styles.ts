import { BLOCK_APP_META } from "@/lib/blocks/block-app-meta";
import { getTheme } from "@/lib/themes";
import type { TeamPageSettings, ThemeId, BlockType } from "@/lib/types";
import type { CSSProperties } from "react";

export type TeamPageDesignStyle = "premium" | "playful" | "performance";
export type TeamIconPresentation = "mark" | "emoji" | "mixed";

export type TeamPageStyleSpec = {
  id: TeamPageDesignStyle;
  label: string;
  tagline: string;
  description: string;
  emoji: string;
  themeId: ThemeId;
  iconPresentation: TeamIconPresentation;
  cssVars: CSSProperties;
};

/** One personality → full visual system (colors, surfaces, rhythm). Presentation only. */
export const TEAM_PAGE_STYLES: TeamPageStyleSpec[] = [
  {
    id: "premium",
    label: "Premium",
    tagline: "Clean and elegant",
    description: "Calm whites, refined cards, and a polished club feel.",
    emoji: "✨",
    themeId: "minimal_mono",
    iconPresentation: "mark",
    cssVars: {
      "--team-style-card-radius": "1.4rem",
      "--team-style-card-shadow": "0 4px 32px -16px rgba(15, 23, 42, 0.1)",
      "--team-style-card-border": "color-mix(in srgb, var(--mts-card-border) 45%, transparent)",
      "--team-style-card-surface": "var(--mts-card, #fff)",
      "--team-style-icon-radius": "0.75rem",
      "--team-style-icon-size": "2.375rem",
      "--team-style-icon-shadow": "inset 0 0 0 1px color-mix(in srgb, var(--mts-card-border) 55%, transparent)",
      "--team-style-page-veil": "none",
      "--team-style-cta-radius": "9999px",
      "--team-style-cta-weight": "600",
      "--team-style-head-weight": "700",
      "--team-style-head-tracking": "-0.02em",
      "--team-style-gallery-radius": "0.875rem",
      "--team-style-body-scale": "1",
    } as CSSProperties,
  },
  {
    id: "playful",
    label: "Playful",
    tagline: "Bright and kids-friendly",
    description: "Warm gradients, soft cards, and cheerful energy.",
    emoji: "🎨",
    themeId: "pastel_youth",
    iconPresentation: "emoji",
    cssVars: {
      "--team-style-card-radius": "1.5rem",
      "--team-style-card-shadow": "0 10px 36px -14px color-mix(in srgb, var(--mts-accent) 26%, rgba(15, 23, 42, 0.1))",
      "--team-style-card-border": "color-mix(in srgb, var(--mts-accent) 16%, var(--mts-card-border))",
      "--team-style-card-surface":
        "color-mix(in srgb, var(--mts-card, #fff) 94%, var(--mts-accent-soft, #fff))",
      "--team-style-icon-radius": "1rem",
      "--team-style-icon-size": "2.625rem",
      "--team-style-icon-shadow": "0 4px 16px -8px color-mix(in srgb, var(--mts-accent) 32%, transparent)",
      "--team-style-page-veil":
        "radial-gradient(ellipse 120% 80% at 50% -20%, color-mix(in srgb, var(--mts-accent) 14%, transparent), transparent 58%)",
      "--team-style-cta-radius": "9999px",
      "--team-style-cta-weight": "700",
      "--team-style-head-weight": "700",
      "--team-style-head-tracking": "-0.01em",
      "--team-style-gallery-radius": "1rem",
      "--team-style-body-scale": "1",
    } as CSSProperties,
  },
  {
    id: "performance",
    label: "Performance",
    tagline: "Bold and sporty",
    description: "Strong contrast, confident type, and competitive energy.",
    emoji: "⚡",
    themeId: "energetic_orange",
    iconPresentation: "mark",
    cssVars: {
      "--team-style-card-radius": "1rem",
      "--team-style-card-shadow": "0 3px 24px -12px rgba(0, 0, 0, 0.2)",
      "--team-style-card-border": "color-mix(in srgb, var(--mts-text) 14%, var(--mts-card-border))",
      "--team-style-card-surface": "var(--mts-card, #fff)",
      "--team-style-icon-radius": "0.625rem",
      "--team-style-icon-size": "2.375rem",
      "--team-style-icon-shadow": "inset 0 -2px 0 color-mix(in srgb, var(--mts-text) 10%, transparent)",
      "--team-style-page-veil":
        "linear-gradient(180deg, color-mix(in srgb, var(--mts-primary) 6%, transparent) 0%, transparent 32%)",
      "--team-style-cta-radius": "0.75rem",
      "--team-style-cta-weight": "800",
      "--team-style-head-weight": "800",
      "--team-style-head-tracking": "-0.03em",
      "--team-style-gallery-radius": "0.625rem",
      "--team-style-body-scale": "1",
    } as CSSProperties,
  },
];

const STYLE_SET = new Set<TeamPageDesignStyle>(TEAM_PAGE_STYLES.map((s) => s.id));

const LEGACY_THEME_PERSONALITY: Partial<Record<ThemeId, TeamPageDesignStyle>> = {
  pastel_youth: "playful",
  energetic_orange: "performance",
  dark_athletic: "performance",
  premium_forest: "premium",
  minimal_mono: "premium",
  ocean_aqua: "premium",
};

const PREMIUM_TILE = "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200/80";
const PERFORMANCE_TILE = "bg-neutral-900 text-white shadow-sm";

export function isTeamPageDesignStyle(value: unknown): value is TeamPageDesignStyle {
  return typeof value === "string" && STYLE_SET.has(value as TeamPageDesignStyle);
}

export function hasExplicitPersonality(settings?: TeamPageSettings): boolean {
  return isTeamPageDesignStyle(settings?.designStyle);
}

function inferPersonalityFromTheme(themeId?: ThemeId): TeamPageDesignStyle {
  if (themeId && LEGACY_THEME_PERSONALITY[themeId]) return LEGACY_THEME_PERSONALITY[themeId]!;
  return "premium";
}

/** Resolved personality for visuals — explicit choice wins, else legacy theme mapping. */
export function resolveDesignStyle(
  settings?: TeamPageSettings,
  themeId?: ThemeId,
): TeamPageDesignStyle {
  if (isTeamPageDesignStyle(settings?.designStyle)) return settings.designStyle;
  return inferPersonalityFromTheme(themeId);
}

/** Theme colors follow personality once coach has chosen it; legacy teams keep stored theme. */
export function resolveEffectiveThemeId(
  settings: TeamPageSettings | undefined,
  themeId: ThemeId,
): ThemeId {
  if (hasExplicitPersonality(settings)) {
    return teamPageStyleSpec(settings!.designStyle!).themeId;
  }
  return themeId;
}

export function designStyleClassName(style: TeamPageDesignStyle): string {
  return `team-page-style--${style}`;
}

export function designStyleCssVars(style: TeamPageDesignStyle): CSSProperties {
  const spec = TEAM_PAGE_STYLES.find((s) => s.id === style) ?? TEAM_PAGE_STYLES[0]!;
  return spec.cssVars;
}

export function teamPageStyleSpec(style: TeamPageDesignStyle): TeamPageStyleSpec {
  return TEAM_PAGE_STYLES.find((s) => s.id === style) ?? TEAM_PAGE_STYLES[0]!;
}

export function iconPresentationForStyle(style: TeamPageDesignStyle): TeamIconPresentation {
  return teamPageStyleSpec(style).iconPresentation;
}

export function resolveBlockTileClass(blockType: BlockType, style: TeamPageDesignStyle): string {
  const meta = BLOCK_APP_META[blockType];
  if (style === "premium") return PREMIUM_TILE;
  if (style === "performance") return PERFORMANCE_TILE;
  return meta.tileClass;
}

/** Single builder action: personality + matching palette. */
export function personalityTeamPatch(
  style: TeamPageDesignStyle,
  pageSettings?: TeamPageSettings,
): Partial<import("@/lib/types").TeamSpace> {
  const spec = teamPageStyleSpec(style);
  const theme = getTheme(spec.themeId);
  const vars = theme.cssVars as Record<string, string>;
  return {
    themeId: spec.themeId,
    primaryColor: vars["--mts-primary"] ?? "",
    secondaryColor: vars["--mts-accent"] ?? "",
    pageSettings: {
      ...pageSettings,
      designStyle: style,
    },
  };
}
