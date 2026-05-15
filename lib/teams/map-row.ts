import { BLOCK_META } from "@/lib/blocks/meta";
import { defaultSettingsForType } from "@/lib/blocks/settings";
import { parseVisibility } from "@/lib/team-access";
import type { BlockInstance, BlockLayout, TeamPageSettings, TeamSpace, ThemeId } from "@/lib/types";
import { THEMES } from "@/lib/themes";
import { createDefaultBlocks } from "@/lib/default-blocks";

const LAYOUTS = new Set<BlockLayout>(["full", "half", "card", "featured"]);
import { getSupabaseUrl } from "@/lib/supabase/env";

export type TeamDbRow = {
  id: string;
  slug: string;
  name: string;
  logo_path: string | null;
  primary_color: string;
  secondary_color: string;
  theme_id: string;
  tagline: string | null;
  blocks: unknown;
  subscription_status: string;
  page_visibility?: string | null;
  access_code?: string | null;
  invite_token?: string | null;
  page_settings?: unknown;
};

const THEME_IDS = new Set(THEMES.map((t) => t.id));

function isThemeId(x: string): x is ThemeId {
  return THEME_IDS.has(x as ThemeId);
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
    const layoutRaw = row.layout;
    const layout =
      typeof layoutRaw === "string" && LAYOUTS.has(layoutRaw as BlockLayout)
        ? (layoutRaw as BlockLayout)
        : base.layout;
    const defaults = defaultSettingsForType(base.type);
    merged.push({
      ...base,
      enabled: typeof row.enabled === "boolean" ? row.enabled : base.enabled,
      order: typeof row.order === "number" && Number.isFinite(row.order) ? row.order : base.order,
      layout: layout ?? base.layout,
      settings:
        row.settings && typeof row.settings === "object"
          ? { ...defaults, ...base.settings, ...row.settings }
          : { ...defaults, ...base.settings },
    });
  }
  if (merged.length !== fallback.length) return fallback;
  return merged.sort((a, b) => a.order - b.order);
}

export function mapTeamRowToTeamSpace(row: TeamDbRow, logoPublicUrl?: string): TeamSpace {
  const fallback = createDefaultBlocks();
  const normalizedThemeId = row.theme_id === "sharky_aqua" ? "ocean_aqua" : row.theme_id;
  const themeId = isThemeId(normalizedThemeId) ? normalizedThemeId : "ocean_aqua";
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    logoUrl: logoPublicUrl,
    primaryColor: row.primary_color?.slice(0, 32) || "#0c4a6e",
    secondaryColor: row.secondary_color?.slice(0, 32) || "#0ea5e9",
    themeId,
    plan: "pro",
    tagline: row.tagline ?? undefined,
    blocks: normalizeBlocks(row.blocks, fallback),
    pageVisibility: parseVisibility(row.page_visibility ?? undefined),
    accessCode: row.access_code ?? undefined,
    inviteToken: row.invite_token ?? undefined,
    pageSettings: (row.page_settings as TeamPageSettings) ?? {},
  };
}

export function publicLogoUrlFromPath(logoPath: string | null): string | undefined {
  if (!logoPath) return undefined;
  const base = getSupabaseUrl();
  if (!base) return undefined;
  return `${base}/storage/v1/object/public/team-assets/${logoPath}`;
}
