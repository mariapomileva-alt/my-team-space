import type { BlockInstance, TeamSpace, ThemeId } from "@/lib/types";
import { THEMES } from "@/lib/themes";
import { usesCloudTeamStorage } from "@/lib/teams/cloud-storage";
import { isTeamVersionNewer, parseTeamUpdatedAt } from "@/lib/teams/team-timestamp";

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
  const byType = new Map(fallback.map((b) => [b.type, b]));
  const merged: BlockInstance[] = [];
  const usedIds = new Set<string>();
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const row = item as Partial<BlockInstance>;
    const id = String(row.id ?? "");
    let base = id ? byId.get(id) : undefined;
    if (!base && row.type) base = byType.get(row.type as BlockInstance["type"]);
    if (!base) continue;
    usedIds.add(base.id);
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
  for (const base of fallback) {
    if (!usedIds.has(base.id)) merged.push({ ...base });
  }
  return merged.sort((a, b) => a.order - b.order);
}

/**
 * Local-only draft overlay for offline/demo mode.
 * In cloud mode the database is the only source of truth — never merge browser storage.
 */
export function mergeStoredPreview(fallback: TeamSpace): TeamSpace {
  if (usesCloudTeamStorage()) return fallback;
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(previewStorageKey(fallback.slug));
  if (!raw) return fallback;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (typeof o.slug !== "string" || o.slug !== fallback.slug) return fallback;

    const serverAt = parseTeamUpdatedAt(fallback.updatedAt);
    const storedAt = parseTeamUpdatedAt(o.updatedAt);
    if (serverAt != null && storedAt != null && storedAt <= serverAt) {
      return fallback;
    }

    const rawTheme = typeof o.themeId === "string" ? o.themeId : "";
    const storedTheme = rawTheme === "sharky_aqua" ? "ocean_aqua" : rawTheme;
    const logoUrl =
      typeof o.logoUrl === "string" && o.logoUrl.trim()
        ? o.logoUrl.trim().slice(0, 2048)
        : fallback.logoUrl;

    const storedPageSettings =
      o.pageSettings && typeof o.pageSettings === "object" && !Array.isArray(o.pageSettings)
        ? (o.pageSettings as TeamSpace["pageSettings"])
        : undefined;

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
      pageSettings: storedPageSettings
        ? { ...fallback.pageSettings, ...storedPageSettings }
        : fallback.pageSettings,
      blocks: normalizeBlocks(o.blocks, fallback.blocks),
      updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : fallback.updatedAt,
    };
  } catch {
    return fallback;
  }
}

/** Drop stale browser draft if the server copy is newer (or always in cloud mode). */
export function purgeStaleTeamPreview(slug: string, serverUpdatedAt?: string): void {
  if (typeof window === "undefined") return;
  const key = previewStorageKey(slug);
  if (usesCloudTeamStorage()) {
    window.localStorage.removeItem(key);
    return;
  }
  const raw = window.localStorage.getItem(key);
  if (!raw) return;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const storedAt = parseTeamUpdatedAt(o.updatedAt);
    const serverAt = parseTeamUpdatedAt(serverUpdatedAt);
    if (serverAt == null || storedAt == null || storedAt <= serverAt) {
      window.localStorage.removeItem(key);
    }
  } catch {
    window.localStorage.removeItem(key);
  }
}

export function saveTeamPreviewLocal(team: TeamSpace): void {
  if (usesCloudTeamStorage()) return;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(previewStorageKey(team.slug), JSON.stringify(team));
  window.dispatchEvent(new Event("mts-team-preview"));
}

export function clearTeamPreviewLocal(slug: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(previewStorageKey(slug));
  window.dispatchEvent(new Event("mts-team-preview"));
}

export function shouldApplyStoredPreviewOver(server: TeamSpace): boolean {
  if (usesCloudTeamStorage()) return false;
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(previewStorageKey(server.slug));
  if (!raw) return false;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const storedAt = typeof o.updatedAt === "string" ? o.updatedAt : undefined;
    return isTeamVersionNewer(storedAt, server.updatedAt);
  } catch {
    return false;
  }
}
