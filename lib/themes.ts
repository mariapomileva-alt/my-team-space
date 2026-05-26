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
      "--mts-hero-overlay":
        "linear-gradient(165deg, rgba(12, 74, 110, 0.55) 0%, rgba(14, 165, 233, 0.35) 45%, rgba(255, 107, 45, 0.2) 100%)",
      "--mts-hero-tint": "rgba(14, 165, 233, 0.55)",
      "--mts-hero-tint-opacity": "0.38",
      "--mts-hero-vignette":
        "linear-gradient(to top, rgba(12, 74, 110, 0.5) 0%, transparent 58%)",
      "--mts-hero-fallback": "linear-gradient(120deg, #0c4a6e 0%, #0ea5e9 52%, #ff6b2d 100%)",
      "--mts-hero-filter": "saturate(1.2) contrast(1.08) hue-rotate(-6deg)",
      "--mts-hero-filter-soft": "saturate(1.08) contrast(1.04)",
    } as CSSProperties,
  },
  {
    id: "dark_athletic",
    label: "Dark athletic",
    description: "Night mode with electric lime highlights",
    cssVars: {
      "--mts-page-bg": "linear-gradient(180deg, #0c0f14 0%, #121820 100%)",
      "--mts-card": "linear-gradient(180deg, #151b24 0%, #10151c 100%)",
      "--mts-card-border": "rgba(190, 242, 100, 0.12)",
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
      "--mts-hero-overlay":
        "linear-gradient(180deg, rgba(12, 15, 20, 0.75) 0%, rgba(190, 242, 100, 0.25) 55%, rgba(244, 114, 182, 0.15) 100%)",
      "--mts-hero-tint": "rgba(190, 242, 100, 0.45)",
      "--mts-hero-tint-opacity": "0.48",
      "--mts-hero-vignette":
        "linear-gradient(to top, rgba(12, 15, 20, 0.72) 0%, transparent 55%)",
      "--mts-hero-fallback": "linear-gradient(125deg, #0c0f14 0%, #3f6212 45%, #f472b6 100%)",
      "--mts-hero-filter": "saturate(0.85) contrast(1.12) brightness(0.82) hue-rotate(12deg)",
      "--mts-hero-filter-soft": "saturate(0.92) contrast(1.06) brightness(0.9)",
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
      "--mts-hero-overlay":
        "linear-gradient(160deg, rgba(234, 88, 12, 0.5) 0%, rgba(251, 146, 60, 0.4) 40%, rgba(220, 38, 38, 0.25) 100%)",
      "--mts-hero-tint": "rgba(251, 146, 60, 0.6)",
      "--mts-hero-tint-opacity": "0.44",
      "--mts-hero-vignette":
        "linear-gradient(to top, rgba(67, 20, 7, 0.48) 0%, transparent 58%)",
      "--mts-hero-fallback": "linear-gradient(120deg, #ea580c 0%, #fb923c 50%, #dc2626 100%)",
      "--mts-hero-filter": "saturate(1.32) contrast(1.1) sepia(0.18) hue-rotate(-4deg)",
      "--mts-hero-filter-soft": "saturate(1.18) contrast(1.05) sepia(0.08)",
    } as CSSProperties,
  },
  {
    id: "minimal_mono",
    label: "Minimal mono",
    description: "Editorial black & white calm",
    cssVars: {
      "--mts-page-bg": "linear-gradient(180deg, #fafafa 0%, #f4f4f5 100%)",
      "--mts-card": "#ffffff",
      "--mts-card-border": "rgba(24, 24, 27, 0.08)",
      "--mts-text": "#18181b",
      "--mts-muted": "#71717a",
      "--mts-primary": "#18181b",
      "--mts-primary-bright": "#3f3f46",
      "--mts-accent": "#52525b",
      "--mts-accent-soft": "rgba(24, 24, 27, 0.06)",
      "--mts-success": "#18181b",
      "--mts-radius": "0.75rem",
      "--mts-shadow": "0 4px 24px rgba(24, 24, 27, 0.06)",
      "--mts-glow": "0 0 0 1px rgba(24, 24, 27, 0.06)",
      "--mts-ring": "#18181b",
      "--mts-hero-overlay":
        "linear-gradient(180deg, rgba(24, 24, 27, 0.55) 0%, rgba(82, 82, 91, 0.35) 100%)",
      "--mts-hero-tint": "rgba(82, 82, 91, 0.5)",
      "--mts-hero-tint-opacity": "0.5",
      "--mts-hero-vignette":
        "linear-gradient(to top, rgba(24, 24, 27, 0.55) 0%, transparent 60%)",
      "--mts-hero-fallback": "linear-gradient(120deg, #27272a 0%, #52525b 50%, #a1a1aa 100%)",
      "--mts-hero-filter": "grayscale(0.92) contrast(1.14) brightness(0.96)",
      "--mts-hero-filter-soft": "grayscale(0.55) contrast(1.06)",
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
      "--mts-hero-overlay":
        "linear-gradient(155deg, rgba(4, 78, 59, 0.55) 0%, rgba(16, 185, 129, 0.35) 50%, rgba(245, 158, 11, 0.2) 100%)",
      "--mts-hero-tint": "rgba(16, 185, 129, 0.5)",
      "--mts-hero-tint-opacity": "0.4",
      "--mts-hero-vignette":
        "linear-gradient(to top, rgba(6, 78, 59, 0.48) 0%, transparent 58%)",
      "--mts-hero-fallback": "linear-gradient(120deg, #064e3b 0%, #10b981 55%, #f59e0b 100%)",
      "--mts-hero-filter": "saturate(1.15) contrast(1.08) hue-rotate(-14deg)",
      "--mts-hero-filter-soft": "saturate(1.08) contrast(1.04) hue-rotate(-6deg)",
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
      "--mts-hero-overlay":
        "linear-gradient(150deg, rgba(139, 92, 246, 0.45) 0%, rgba(167, 139, 250, 0.35) 45%, rgba(244, 114, 182, 0.3) 100%)",
      "--mts-hero-tint": "rgba(167, 139, 250, 0.55)",
      "--mts-hero-tint-opacity": "0.46",
      "--mts-hero-vignette":
        "linear-gradient(to top, rgba(76, 29, 149, 0.42) 0%, transparent 58%)",
      "--mts-hero-fallback": "linear-gradient(120deg, #8b5cf6 0%, #a78bfa 50%, #f472b6 100%)",
      "--mts-hero-filter": "saturate(1.28) contrast(1.04) brightness(1.06) hue-rotate(8deg)",
      "--mts-hero-filter-soft": "saturate(1.14) contrast(1.02) brightness(1.03)",
    } as CSSProperties,
  },
];

export function getTheme(id: ThemeId): ThemeDefinition {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
