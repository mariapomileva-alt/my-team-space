import type { TeamPageSettings } from "@/lib/types";

/** Columns that must never appear in public team RPC responses. */
export const PRIVATE_TEAM_ROW_FIELDS = [
  "access_code",
  "invite_token",
  "created_at",
] as const;

/** Public team RPC column allowlist (matches get_public_team_by_slug RETURNS TABLE). */
export const PUBLIC_TEAM_RPC_FIELDS = [
  "id",
  "slug",
  "name",
  "logo_path",
  "logo_url",
  "primary_color",
  "secondary_color",
  "theme_id",
  "tagline",
  "blocks",
  "subscription_status",
  "publish_status",
  "page_visibility",
  "is_plan_primary",
  "plan_edit_locked",
  "page_settings",
  "updated_at",
] as const;

/** page_settings keys safe for anonymous public renderer. */
export const PUBLIC_PAGE_SETTINGS_KEYS = [
  "logoUrl",
  "mobileCardColumns",
  "designStyle",
] as const satisfies readonly (keyof TeamPageSettings)[];

/** page_settings keys that must stay coach-only. */
export const PRIVATE_PAGE_SETTINGS_KEYS = [
  "coachWhatsapp",
  "payments",
  "parentConsent",
  "hideChildNames",
  "pollNotifications",
] as const satisfies readonly (keyof TeamPageSettings)[];

export function filterPublicPageSettings(settings: unknown): TeamPageSettings {
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return {};
  }
  const raw = settings as Record<string, unknown>;
  const out: TeamPageSettings = {};
  for (const key of PUBLIC_PAGE_SETTINGS_KEYS) {
    const value = raw[key];
    if (value === undefined) continue;
    if (key === "mobileCardColumns" && value !== "single" && value !== "double") continue;
    if (key === "designStyle" && value !== "premium" && value !== "playful" && value !== "performance") {
      continue;
    }
    if (key === "logoUrl" && typeof value !== "string") continue;
    (out as Record<string, unknown>)[key] = value;
  }
  return out;
}

/** Strip private columns if a full teams row leaks into application code. */
export function stripPrivateTeamFields<T extends Record<string, unknown>>(row: T): Omit<T, (typeof PRIVATE_TEAM_ROW_FIELDS)[number]> {
  const copy = { ...row };
  for (const key of PRIVATE_TEAM_ROW_FIELDS) {
    delete copy[key];
  }
  return copy;
}

/** True when a row object still exposes secret team fields (regression guard). */
export function rowExposesPrivateTeamFields(row: Record<string, unknown>): boolean {
  return PRIVATE_TEAM_ROW_FIELDS.some((key) => key in row && row[key] != null);
}
