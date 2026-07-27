import { readFileSync } from "node:fs";
import { join } from "node:path";

/** SQL migration for team_members role escalation guard (P0-04). */
export const TEAM_ROLE_ESCALATION_MIGRATION =
  "20260714130000_prevent_team_role_escalation.sql";

/** Session flag set by trusted RPCs before an intentional role UPDATE. */
export const TEAM_MEMBER_ROLE_CHANGE_FLAG = "mts.allow_team_member_role_change";

/** SECURITY DEFINER RPC allowed to change member roles. */
export const AUTHORIZED_ROLE_CHANGE_RPC = "update_team_staff_role";

export function readTeamRoleEscalationMigrationSql(): string {
  return readFileSync(
    join(process.cwd(), "supabase/migrations", TEAM_ROLE_ESCALATION_MIGRATION),
    "utf8",
  );
}
