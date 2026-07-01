import type { TeamPageSettings } from "@/lib/types";
import type { CSSProperties } from "react";

export type TeamPageDesignStyle = "premium" | "playful" | "performance";

export type TeamPageStyleSpec = {
  id: TeamPageDesignStyle;
  label: string;
  tagline: string;
  description: string;
  emoji: string;
  cssVars: CSSProperties;
};

/** Visual mood layer — presentation only; does not change blocks or data. */
export const TEAM_PAGE_STYLES: TeamPageStyleSpec[] = [
  {
    id: "premium",
    label: "Premium",
    tagline: "Clean and elegant",
    description: "Soft backgrounds, airy cards, and a polished app feel.",
    emoji: "✨",
    cssVars: {
      "--team-style-card-radius": "1.35rem",
      "--team-style-card-shadow": "0 4px 28px -14px rgba(15, 23, 42, 0.14)",
      "--team-style-card-border": "color-mix(in srgb, var(--mts-card-border) 50%, transparent)",
      "--team-style-icon-radius": "0.875rem",
      "--team-style-icon-size": "2.5rem",
      "--team-style-icon-shadow": "inset 0 0 0 1px color-mix(in srgb, var(--mts-card-border) 40%, transparent)",
      "--team-style-page-veil": "none",
      "--team-style-cta-radius": "9999px",
      "--team-style-head-weight": "700",
    } as CSSProperties,
  },
  {
    id: "playful",
    label: "Playful",
    tagline: "Bright and kids-friendly",
    description: "Warmer cards, soft gradients, and cheerful energy.",
    emoji: "🎨",
    cssVars: {
      "--team-style-card-radius": "1.5rem",
      "--team-style-card-shadow": "0 8px 32px -12px color-mix(in srgb, var(--mts-accent) 28%, rgba(15, 23, 42, 0.12))",
      "--team-style-card-border": "color-mix(in srgb, var(--mts-accent) 18%, var(--mts-card-border))",
      "--team-style-icon-radius": "1rem",
      "--team-style-icon-size": "2.625rem",
      "--team-style-icon-shadow": "0 4px 14px -6px color-mix(in srgb, var(--mts-accent) 35%, transparent)",
      "--team-style-page-veil":
        "radial-gradient(ellipse 120% 80% at 50% -20%, color-mix(in srgb, var(--mts-accent) 12%, transparent), transparent 55%)",
      "--team-style-cta-radius": "9999px",
      "--team-style-head-weight": "700",
    } as CSSProperties,
  },
  {
    id: "performance",
    label: "Performance",
    tagline: "Bold and sporty",
    description: "Sharper contrast and a confident, competitive feel.",
    emoji: "⚡",
    cssVars: {
      "--team-style-card-radius": "1rem",
      "--team-style-card-shadow": "0 2px 20px -10px rgba(0, 0, 0, 0.22)",
      "--team-style-card-border": "color-mix(in srgb, var(--mts-text) 12%, var(--mts-card-border))",
      "--team-style-icon-radius": "0.625rem",
      "--team-style-icon-size": "2.375rem",
      "--team-style-icon-shadow": "inset 0 -2px 0 color-mix(in srgb, var(--mts-text) 8%, transparent)",
      "--team-style-page-veil":
        "linear-gradient(180deg, color-mix(in srgb, var(--mts-text) 4%, transparent) 0%, transparent 28%)",
      "--team-style-cta-radius": "0.75rem",
      "--team-style-head-weight": "800",
    } as CSSProperties,
  },
];

const STYLE_SET = new Set<TeamPageDesignStyle>(TEAM_PAGE_STYLES.map((s) => s.id));

export function isTeamPageDesignStyle(value: unknown): value is TeamPageDesignStyle {
  return typeof value === "string" && STYLE_SET.has(value as TeamPageDesignStyle);
}

export function resolveDesignStyle(settings?: TeamPageSettings): TeamPageDesignStyle {
  const raw = settings?.designStyle;
  if (isTeamPageDesignStyle(raw)) return raw;
  return "premium";
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
