import { isReservedTeamSlug, normalizeTeamSlug, publicTeamUrl } from "@/lib/teams/public-url";

/** Build a URL-safe page link segment from a team name. */
export function pageLinkFromName(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  let slug = base || "my-team";
  if (/^[0-9]/.test(slug)) slug = `team-${slug}`;
  if (slug.length < 2) slug = `${slug}-team`;
  if (isReservedTeamSlug(slug)) slug = `${slug}-club`;
  return slug;
}

export function sanitizePageLinkInput(input: string): string {
  const raw = input.trim().toLowerCase().replace(/\s+/g, "-");
  const cleaned = raw.replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned.slice(0, 62);
}

export function isValidPageLink(link: string): boolean {
  const s = sanitizePageLinkInput(link);
  return s.length >= 2 && /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(s);
}

export function formatPublicPageLink(siteOrigin: string, pageLink: string): string {
  const slug = normalizeTeamSlug(sanitizePageLinkInput(pageLink));
  return publicTeamUrl(siteOrigin, slug);
}
