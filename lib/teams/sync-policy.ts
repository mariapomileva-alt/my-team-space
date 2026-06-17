import { isTeamVersionNewer } from "@/lib/teams/team-timestamp";

/**
 * Cloud sync policy for the team page builder.
 * Server wins when it is strictly newer; otherwise keep local edits while dirty.
 */
export function shouldReplaceLocalWithServer(
  local: { updatedAt?: string; dirty: boolean },
  server: { updatedAt?: string },
): boolean {
  if (isTeamVersionNewer(server.updatedAt, local.updatedAt)) return true;
  return !local.dirty;
}
