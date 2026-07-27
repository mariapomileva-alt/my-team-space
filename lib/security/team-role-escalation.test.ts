import { describe, expect, it } from "vitest";
import {
  AUTHORIZED_ROLE_CHANGE_RPC,
  readTeamRoleEscalationMigrationSql,
  TEAM_MEMBER_ROLE_CHANGE_FLAG,
} from "@/lib/security/team-role-escalation";

describe("P0-04 — team_members role escalation guard", () => {
  it("installs trigger blocking direct role updates", () => {
    const sql = readTeamRoleEscalationMigrationSql();
    expect(sql).toMatch(/create trigger team_members_guard/i);
    expect(sql).toMatch(/team_member_role_change_forbidden/i);
    expect(sql).toMatch(new RegExp(TEAM_MEMBER_ROLE_CHANGE_FLAG, "i"));
  });

  it("blocks identity column changes on team_members", () => {
    const sql = readTeamRoleEscalationMigrationSql();
    expect(sql).toMatch(/team_member_identity_change_forbidden/i);
  });

  it("prevents removing the last team owner", () => {
    const sql = readTeamRoleEscalationMigrationSql();
    expect(sql).toMatch(/cannot_remove_last_team_owner/i);
  });

  it("invite accept does not upsert role on conflict", () => {
    const sql = readTeamRoleEscalationMigrationSql();
    expect(sql).toMatch(/on conflict \(team_id, user_id\) do nothing/i);
    expect(sql).not.toMatch(/do update set role/i);
  });

  it("exposes coach-only update_team_staff_role RPC", () => {
    const sql = readTeamRoleEscalationMigrationSql();
    expect(sql).toMatch(new RegExp(`function public\\.${AUTHORIZED_ROLE_CHANGE_RPC}`, "i"));
    expect(sql).toMatch(/cannot change own role/i);
    expect(sql).toMatch(/cannot change team owner role/i);
    expect(sql).toMatch(/if p_role <> 'assistant'/i);
  });
});
