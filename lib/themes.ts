import type { ThemeId } from "./types";
import type { CSSProperties } from "react";

export type ThemeDefinition = {
  id: ThemeId;
  label: string;
  description: string;
  /** Applied on team shell via inline style */
  cssVars: CSSProperties;
};

/**
 * CSS variables consumed by components under `.mts-shell`
 * Default aqua palette for team pages.
 */
export const THEMES: ThemeDefinition[] = [
  {
    id: "ocean_aqua",
    label: "Ocean aqua",
    description: "Deep blue, aqua, white — confident and clear",
    cssVars: {
      "--mts-page-bg":
        "linear-gradient(165deg, #e8f4fc 0%, #cfe8f5 35%, #b8dce8 100%)",
      "--mts-card": "linear-gradient(180deg, #ffffff 0%, #fafcfe 100%)",
      "--mts-card-border": "rgba(255, 255, 255, 0.7)",
      "--mts-text": "#0a1628",
      "--mts-muted": "#5a6b78",
      "--mts-primary": "#0c4a6e",
      "--mts-primary-bright": "#0ea5e9",
      "--mts-accent": "#ff6b2d",
      "--mts-accent-soft": "rgba(255, 107, 45, 0.12)",
      "--mts-success": "#059669",
      "--mts-radius": "1rem",
      "--mts-shadow": "0 8px 32px rgba(10, 22, 40, 0.08)",
      "--mts-glow": "0 0 0 1px rgba(14, 165, 233, 0.15)",
      "--mts-ring": "#0ea5e9",
      "--mts-hero-fallback": "linear-gradient(120deg, #0c4a6e 0%, #0ea5e9 52%, #ff6b2d 100%)",
    } as CSSProperties,
  },
  {
    id: "dark_athletic",
    label: "Dark athletic",
    description: "Night mode with electric lime highlights",
    cssVars: {
      "--mts-page-bg": "linear-gradient(180deg, #0c0f14 0%, #121820 100%)",
      "--mts-card": "linear-gradient(180deg, #111318 0%, #0a0c10 100%)",
      "--mts-card-border": "rgba(255, 255, 255, 0.14)",
      "--mts-text": "#f1f5f9",
      "--mts-muted": "#94a3b8",
      "--mts-primary": "#bef264",
      "--mts-primary-bright": "#d9f99d",
      "--mts-accent": "#f472b6",
      "--mts-accent-soft": "rgba(244, 114, 182, 0.12)",
      "--mts-success": "#4ade80",
      "--mts-radius": "1rem",
      "--mts-shadow": "0 12px 40px rgba(0, 0, 0, 0.45)",
      "--mts-glow": "0 0 0 1px rgba(190, 242, 100, 0.2)",
      "--mts-ring": "#bef264",
      "--mts-hero-fallback": "linear-gradient(125deg, #0c0f14 0%, #3f6212 45%, #f472b6 100%)",
    } as CSSProperties,
  },
  {
    id: "energetic_orange",
    label: "Energetic orange",
    description: "High-energy sunset workout vibe",
    cssVars: {
      "--mts-page-bg":
        "linear-gradient(170deg, #fff7ed 0%, #ffedd5 45%, #fed7aa 100%)",
      "--mts-card": "linear-gradient(180deg, #ffffff 0%, #fffbeb 100%)",
      "--mts-card-border": "rgba(234, 88, 12, 0.15)",
      "--mts-text": "#431407",
      "--mts-muted": "#9a3412",
      "--mts-primary": "#ea580c",
      "--mts-primary-bright": "#fb923c",
      "--mts-accent": "#dc2626",
      "--mts-accent-soft": "rgba(234, 88, 12, 0.1)",
      "--mts-success": "#16a34a",
      "--mts-radius": "1.125rem",
      "--mts-shadow": "0 10px 36px rgba(234, 88, 12, 0.12)",
      "--mts-glow": "0 0 0 1px rgba(251, 146, 60, 0.25)",
      "--mts-ring": "#ea580c",
      "--mts-hero-fallback": "linear-gradient(120deg, #ea580c 0%, #fb923c 50%, #dc2626 100%)",
    } as CSSProperties,
  },
  {
    id: "minimal_mono",
    label: "Chrome",
    description: "Black & white editorial — solid and timeless",
    cssVars: {
      "--mts-page-bg": "linear-gradient(180deg, #ffffff 0%, #f0f0f0 48%, #e8e8e8 100%)",
      "--mts-card": "#ffffff",
      "--mts-card-border": "rgba(0, 0, 0, 0.09)",
      "--mts-text": "#0a0a0a",
      "--mts-muted": "#6b6b6b",
      "--mts-primary": "#0a0a0a",
      "--mts-primary-bright": "#262626",
      "--mts-accent": "#404040",
      "--mts-accent-soft": "rgba(0, 0, 0, 0.05)",
      "--mts-success": "#0a0a0a",
      "--mts-radius": "0.875rem",
      "--mts-shadow": "0 6px 28px rgba(0, 0, 0, 0.07)",
      "--mts-glow": "0 0 0 1px rgba(0, 0, 0, 0.06)",
      "--mts-ring": "#0a0a0a",
      "--mts-hero-fallback": "linear-gradient(125deg, #0a0a0a 0%, #404040 55%, #a3a3a3 100%)",
    } as CSSProperties,
  },
  {
    id: "sunset_coral",
    label: "Sunset",
    description: "Coral & peach glow — creative and expressive",
    cssVars: {
      "--mts-page-bg":
        "linear-gradient(155deg, #fff7ed 0%, #ffe4e6 42%, #fecdd3 100%)",
      "--mts-card": "linear-gradient(180deg, #ffffff 0%, #fff8f6 100%)",
      "--mts-card-border": "rgba(225, 29, 72, 0.1)",
      "--mts-text": "#431407",
      "--mts-muted": "#9f1239",
      "--mts-primary": "#e11d48",
      "--mts-primary-bright": "#fb7185",
      "--mts-accent": "#ea580c",
      "--mts-accent-soft": "rgba(225, 29, 72, 0.1)",
      "--mts-success": "#be123c",
      "--mts-radius": "1.125rem",
      "--mts-shadow": "0 10px 36px rgba(225, 29, 72, 0.1)",
      "--mts-glow": "0 0 0 1px rgba(251, 113, 133, 0.2)",
      "--mts-ring": "#e11d48",
      "--mts-hero-fallback": "linear-gradient(120deg, #e11d48 0%, #fb923c 52%, #fda4af 100%)",
    } as CSSProperties,
  },
  {
    id: "premium_forest",
    label: "Premium forest",
    description: "Deep green trust & outdoor clubs",
    cssVars: {
      "--mts-page-bg":
        "linear-gradient(165deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 100%)",
      "--mts-card": "linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)",
      "--mts-card-border": "rgba(6, 78, 59, 0.12)",
      "--mts-text": "#064e3b",
      "--mts-muted": "#047857",
      "--mts-primary": "#047857",
      "--mts-primary-bright": "#10b981",
      "--mts-accent": "#f59e0b",
      "--mts-accent-soft": "rgba(4, 120, 87, 0.1)",
      "--mts-success": "#059669",
      "--mts-radius": "1rem",
      "--mts-shadow": "0 10px 36px rgba(6, 78, 59, 0.1)",
      "--mts-glow": "0 0 0 1px rgba(16, 185, 129, 0.2)",
      "--mts-ring": "#10b981",
      "--mts-hero-fallback": "linear-gradient(120deg, #064e3b 0%, #10b981 55%, #f59e0b 100%)",
    } as CSSProperties,
  },
  {
    id: "pastel_youth",
    label: "Pastel youth",
    description: "Soft, friendly for kids & parents",
    cssVars: {
      "--mts-page-bg":
        "linear-gradient(160deg, #fdf4ff 0%, #e0f2fe 45%, #fef9c3 100%)",
      "--mts-card": "linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)",
      "--mts-card-border": "rgba(168, 85, 247, 0.12)",
      "--mts-text": "#4c1d95",
      "--mts-muted": "#7c3aed",
      "--mts-primary": "#8b5cf6",
      "--mts-primary-bright": "#a78bfa",
      "--mts-accent": "#f472b6",
      "--mts-accent-soft": "rgba(139, 92, 246, 0.1)",
      "--mts-success": "#34d399",
      "--mts-radius": "1.25rem",
      "--mts-shadow": "0 12px 40px rgba(139, 92, 246, 0.12)",
      "--mts-glow": "0 0 0 1px rgba(244, 114, 182, 0.2)",
      "--mts-ring": "#8b5cf6",
      "--mts-hero-fallback": "linear-gradient(120deg, #8b5cf6 0%, #a78bfa 50%, #f472b6 100%)",
    } as CSSProperties,
  },
];

export function getTheme(id: ThemeId): ThemeDefinition {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
