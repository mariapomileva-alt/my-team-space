import type { BlockInstance, TeamSpace, ThemeId } from "@/lib/types";
import { THEMES } from "@/lib/themes";

const PREFIX = "mts_team_preview_";

export function previewStorageKey(slug: string): string {
  return `${PREFIX}${slug}`;
}

const THEME_SET = new Set<string>(THEMES.map((t) => t.id));

function isThemeId(x: unknown): x is ThemeId {
  return typeof x === "string" && THEME_SET.has(x);
}

function normalizeBlocks(input: unknown, fallback: BlockInstance[]): BlockInstance[] {
  if (!Array.isArray(input)) return fallback;
  const byId = new Map(fallback.map((b) => [b.id, b]));
  const merged: BlockInstance[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const row = item as Partial<BlockInstance>;
    const base = byId.get(String(row.id ?? ""));
    if (!base) continue;
    merged.push({
      ...base,
      enabled: typeof row.enabled === "boolean" ? row.enabled : base.enabled,
      order: typeof row.order === "number" && Number.isFinite(row.order) ? row.order : base.order,
      settings:
        row.settings && typeof row.settings === "object"
          ? { ...base.settings, ...row.settings }
          : base.settings,
    });
  }
  if (merged.length !== fallback.length) return fallback;
  return merged.sort((a, b) => a.order - b.order);
}

/** Merge coach preview from localStorage (same browser, survives new tab). */
export function mergeStoredPreview(fallback: TeamSpace): TeamSpace {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(previewStorageKey(fallback.slug));
  if (!raw) return fallback;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (typeof o.slug !== "string" || o.slug !== fallback.slug) return fallback;
    const rawTheme = typeof o.themeId === "string" ? o.themeId : "";
    const storedTheme = rawTheme === "sharky_aqua" ? "ocean_aqua" : rawTheme;
    const logoUrl =
      typeof o.logoUrl === "string" && o.logoUrl.trim()
        ? o.logoUrl.trim().slice(0, 2048)
        : fallback.logoUrl;

    return {
      ...fallback,
      name: typeof o.name === "string" ? o.name.slice(0, 120) : fallback.name,
      tagline: typeof o.tagline === "string" ? o.tagline.slice(0, 220) : fallback.tagline,
      logoUrl,
      themeId: isThemeId(storedTheme) ? storedTheme : fallback.themeId,
      primaryColor:
        typeof o.primaryColor === "string" ? o.primaryColor.slice(0, 32) : fallback.primaryColor,
      secondaryColor:
        typeof o.secondaryColor === "string"
          ? o.secondaryColor.slice(0, 32)
          : fallback.secondaryColor,
      blocks: normalizeBlocks(o.blocks, fallback.blocks),
    };
  } catch {
    return fallback;
  }
}

export function saveTeamPreviewLocal(team: TeamSpace): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(previewStorageKey(team.slug), JSON.stringify(team));
  window.dispatchEvent(new Event("mts-team-preview"));
}

export function clearTeamPreviewLocal(slug: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(previewStorageKey(slug));
  window.dispatchEvent(new Event("mts-team-preview"));
}
