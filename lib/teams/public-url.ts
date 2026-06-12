/** Path segments reserved for app routes — team slugs cannot use these. */
export const RESERVED_TEAM_SLUGS = new Set([
  "about",
  "admin",
  "api",
  "auth",
  "cookies",
  "faq",
  "pricing",
  "privacy",
  "support",
  "terms",
  "team",
]);

export function normalizeTeamSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

export function isReservedTeamSlug(slug: string): boolean {
  return RESERVED_TEAM_SLUGS.has(normalizeTeamSlug(slug));
}

/** Canonical public team page path: /{slug} */
export function publicTeamPath(slug: string): string {
  return `/${normalizeTeamSlug(slug)}`;
}

export function publicTeamUrl(siteOrigin: string, slug: string): string {
  const base = siteOrigin.replace(/\/$/, "");
  return `${base}${publicTeamPath(slug)}`;
}

export function siteOriginFromPublicTeamUrl(publicUrl: string): string {
  try {
    return new URL(publicUrl).origin;
  } catch {
    return publicUrl.replace(/\/[^/]+$/, "").replace(/\/team$/, "");
  }
}

/** Legacy path kept for 301 redirects from old shared links. */
export function legacyTeamPath(slug: string): string {
  return `/team/${normalizeTeamSlug(slug)}`;
}
