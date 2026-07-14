import { describe, expect, it } from "vitest";
import {
  LEGITIMATE_TEAM_MEMBER_INSERT_RPCS,
  readTeamMembersInsertMigrationSql,
} from "@/lib/security/team-members-insert";

describe("P0-01 — team_members INSERT policy", () => {
  it("drops permissive team_members_insert_own policy", () => {
    const sql = readTeamMembersInsertMigrationSql();
    expect(sql).toMatch(/drop policy if exists team_members_insert_own/i);
    expect(sql).not.toMatch(/create policy team_members_insert_own/i);
  });

  it("documents only SECURITY DEFINER RPC insert paths", () => {
    expect(LEGITIMATE_TEAM_MEMBER_INSERT_RPCS).toEqual([
      "create_team",
      "accept_team_admin_invite",
    ]);
  });

  it("create_team migration uses SECURITY DEFINER insert", () => {
    const sql = readTeamMembersInsertMigrationSql();
    expect(sql).toMatch(/create_team/i);
    expect(sql).toMatch(/accept_team_admin_invite/i);
  });
});
