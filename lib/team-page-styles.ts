import { BLOCK_APP_META } from "@/lib/blocks/block-app-meta";
import type { TeamPageSettings, ThemeId, BlockType } from "@/lib/types";
import type { CSSProperties } from "react";

export type TeamPageDesignStyle = "premium" | "playful" | "performance";
export type TeamIconPresentation = "svg" | "emoji";

export type TeamPersonalitySpec = {
  id: TeamPageDesignStyle;
  label: string;
  tagline: string;
  description: string;
  emoji: string;
  iconPresentation: TeamIconPresentation;
  cssVars: CSSProperties;
};

/** Layer 1 — visual language (surfaces, rhythm, icons). Independent from color palette. */
export const TEAM_PERSONALITIES: TeamPersonalitySpec[] = [
  {
    id: "premium",
    label: "Premium",
    tagline: "Clean and elegant",
    description: "Calm surfaces, refined cards, and polished club energy.",
    emoji: "✨",
    iconPresentation: "svg",
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
    } as CSSProperties,
  },
  {
    id: "playful",
    label: "Playful",
    tagline: "Bright and kids-friendly",
    description: "Warmer cards, soft gradients, and cheerful friendly energy.",
    emoji: "🎨",
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
    } as CSSProperties,
  },
  {
    id: "performance",
    label: "Performance",
    tagline: "Bold and sporty",
    description: "Strong contrast, confident type, and competitive rhythm.",
    emoji: "⚡",
    iconPresentation: "svg",
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
    } as CSSProperties,
  },
];

/** @deprecated alias */
export const TEAM_PAGE_STYLES = TEAM_PERSONALITIES;

const STYLE_SET = new Set<TeamPageDesignStyle>(TEAM_PERSONALITIES.map((s) => s.id));

const LEGACY_THEME_PERSONALITY: Partial<Record<ThemeId, TeamPageDesignStyle>> = {
  pastel_youth: "playful",
  energetic_orange: "performance",
  dark_athletic: "performance",
  premium_forest: "premium",
  minimal_mono: "premium",
  ocean_aqua: "premium",
};

export function isTeamPageDesignStyle(value: unknown): value is TeamPageDesignStyle {
  return typeof value === "string" && STYLE_SET.has(value as TeamPageDesignStyle);
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

export function designStyleClassName(style: TeamPageDesignStyle): string {
  return `team-page-style--${style}`;
}

export function designStyleCssVars(style: TeamPageDesignStyle): CSSProperties {
  const spec = TEAM_PERSONALITIES.find((s) => s.id === style) ?? TEAM_PERSONALITIES[0]!;
  return spec.cssVars;
}

export function teamPageStyleSpec(style: TeamPageDesignStyle): TeamPersonalitySpec {
  return TEAM_PERSONALITIES.find((s) => s.id === style) ?? TEAM_PERSONALITIES[0]!;
}

export function iconPresentationForStyle(style: TeamPageDesignStyle): TeamIconPresentation {
  return teamPageStyleSpec(style).iconPresentation;
}

export function resolveBlockTileClass(blockType: BlockType, style: TeamPageDesignStyle): string {
  if (style === "playful") return BLOCK_APP_META[blockType].tileClass;
  return `team-icon-tile team-icon-tile--${style}`;
}

/** Personality only — palette stays independent (themeId unchanged). */
export function personalityTeamPatch(
  style: TeamPageDesignStyle,
  pageSettings?: TeamPageSettings,
): Partial<import("@/lib/types").TeamSpace> {
  return {
    pageSettings: {
      ...pageSettings,
      designStyle: style,
    },
  };
}
