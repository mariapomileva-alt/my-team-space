import type { BlockInstance, TeamSpace, TeamVisibility } from "@/lib/types";

export const TEAM_ACCESS_COOKIE = "mts_team_access";

/** Blocks that default to private in mixed mode */
export const PRIVATE_BY_DEFAULT_TYPES = new Set([
  "gallery",
  "documents",
  "attendance",
  "birthdays",
]);

export function normalizeAccessCode(code: string): string {
  return code.trim().toLowerCase().replace(/\s+/g, "");
}

export function teamRequiresAccess(team: TeamSpace): boolean {
  return team.pageVisibility === "private" || team.pageVisibility === "mixed";
}

export function codesMatch(team: TeamSpace, input: string): boolean {
  const norm = normalizeAccessCode(input);
  if (!norm) return false;
  const access = team.accessCode ? normalizeAccessCode(team.accessCode) : "";
  const invite = team.inviteToken ? normalizeAccessCode(team.inviteToken) : "";
  return norm === access || norm === invite;
}

export function blockIsPublicForTeam(team: TeamSpace, block: BlockInstance): boolean {
  if (team.pageVisibility === "public") return true;
  if (team.pageVisibility === "private") return false;
  const audience = block.settings?.audience;
  if (audience === "public" || audience === "private") {
    return audience === "public";
  }
  return !PRIVATE_BY_DEFAULT_TYPES.has(block.type);
}

export function filterBlocksForViewer(
  team: TeamSpace,
  blocks: BlockInstance[],
  hasAccess: boolean,
): BlockInstance[] {
  return blocks.filter((b) => {
    if (!b.enabled) return false;
    if (team.pageVisibility === "public") return true;
    if (team.pageVisibility === "private") return hasAccess;
    if (hasAccess) return true;
    return blockIsPublicForTeam(team, b);
  });
}

export function magicInviteUrl(siteUrl: string, slug: string, token: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/team/${slug}?invite=${encodeURIComponent(token)}`;
}

export function parseVisibility(raw: string | null | undefined): TeamVisibility {
  if (raw === "private" || raw === "mixed") return raw;
  return "public";
}
