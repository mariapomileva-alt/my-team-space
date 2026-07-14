import { readFileSync } from "node:fs";
import { join } from "node:path";

/** SQL migration that removes permissive team_members INSERT policy (P0-01). */
export const TEAM_MEMBERS_INSERT_MIGRATION =
  "20260714120000_prevent_unauthorized_team_members_insert.sql";

/** SECURITY DEFINER RPCs allowed to insert team_members rows. */
export const LEGITIMATE_TEAM_MEMBER_INSERT_RPCS = [
  "create_team",
  "accept_team_admin_invite",
] as const;

export function readTeamMembersInsertMigrationSql(): string {
  return readFileSync(
    join(process.cwd(), "supabase/migrations", TEAM_MEMBERS_INSERT_MIGRATION),
    "utf8",
  );
}
