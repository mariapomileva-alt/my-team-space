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
 * Sharky theme aligned with triathlon-team-hub aesthetic.
 */
export const THEMES: ThemeDefinition[] = [
  {
    id: "sharky_aqua",
    label: "Аква «Шарки»",
    description: "Тёмно-синий, бирюза, белый — как у триатлон-команды",
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
    } as CSSProperties,
  },
  {
    id: "dark_athletic",
    label: "Тёмный athletic",
    description: "Ночной режим с лаймовыми акцентами",
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
    } as CSSProperties,
  },
  {
    id: "energetic_orange",
    label: "Энергичный оранжевый",
    description: "Закат и драйв для мотивации",
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
    } as CSSProperties,
  },
  {
    id: "minimal_mono",
    label: "Минимализм моно",
    description: "Спокойная чёрно-белая подача",
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
    } as CSSProperties,
  },
  {
    id: "premium_forest",
    label: "Премиум лес",
    description: "Глубокий зелёный — доверие и outdoor",
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
    } as CSSProperties,
  },
  {
    id: "pastel_youth",
    label: "Пастель для детей",
    description: "Мягко и дружелюбно для детей и родителей",
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
    } as CSSProperties,
  },
];

export function getTheme(id: ThemeId): ThemeDefinition {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
