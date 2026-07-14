/** Canonical anon visibility rule for public team pages (matches get_public_team_by_slug). */
export function isTeamVisibleToAnonPublic(team: {
  publish_status?: string | null;
  subscription_status?: string | null;
}): boolean {
  return (
    team.publish_status === "published" &&
    (team.subscription_status === "active" || team.subscription_status === "trialing")
  );
}

export const PUBLIC_PUBLISH_MIGRATION =
  "20260714150000_restrict_public_team_access_to_published.sql";
