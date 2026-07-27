import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  filterPublicPageSettings,
  PRIVATE_PAGE_SETTINGS_KEYS,
  PRIVATE_TEAM_ROW_FIELDS,
  PUBLIC_TEAM_RPC_FIELDS,
  rowExposesPrivateTeamFields,
  stripPrivateTeamFields,
} from "@/lib/security/public-team-fields";

const PUBLIC_RPC_MIGRATION = "20260714140000_restrict_public_team_rpc_fields.sql";

function readPublicRpcMigrationSql(): string {
  return readFileSync(join(process.cwd(), "supabase/migrations", PUBLIC_RPC_MIGRATION), "utf8");
}

describe("P0-02 — public team RPC field allowlist", () => {
  it("migration does not use SELECT * or returns teams rowtype", () => {
    const sql = readPublicRpcMigrationSql();
    expect(sql).not.toMatch(/select\s+\*\s+from\s+public\.teams/i);
    expect(sql).not.toMatch(/returns\s+setof\s+public\.teams/i);
    expect(sql).toMatch(/returns table/i);
    expect(sql).toMatch(/filter_public_page_settings/i);
  });

  it("migration defines server-side access verification RPC", () => {
    const sql = readPublicRpcMigrationSql();
    expect(sql).toMatch(/function public\.verify_team_access/i);
  });

  it("public RPC allowlist excludes secret columns", () => {
    expect(PUBLIC_TEAM_RPC_FIELDS).not.toContain("access_code");
    expect(PUBLIC_TEAM_RPC_FIELDS).not.toContain("invite_token");
    expect(PRIVATE_TEAM_ROW_FIELDS).toEqual(
      expect.arrayContaining(["access_code", "invite_token"]),
    );
  });

  it("filterPublicPageSettings keeps display fields and drops coach-only keys", () => {
    const filtered = filterPublicPageSettings({
      logoUrl: "https://cdn.example/logo.png",
      designStyle: "playful",
      mobileCardColumns: "double",
      coachWhatsapp: "+7999",
      payments: [{ id: "1", label: "Fee", month: "2026-06", status: "paid" }],
      parentConsent: true,
      hideChildNames: true,
      pollNotifications: true,
    });
    expect(filtered).toEqual({
      logoUrl: "https://cdn.example/logo.png",
      designStyle: "playful",
      mobileCardColumns: "double",
    });
    for (const key of PRIVATE_PAGE_SETTINGS_KEYS) {
      expect(filtered).not.toHaveProperty(key);
    }
  });

  it("stripPrivateTeamFields removes secrets from a leaked row shape", () => {
    const row = {
      id: "t1",
      slug: "sharks",
      access_code: "secret123",
      invite_token: "magic-token",
      name: "Sharks",
    };
    const stripped = stripPrivateTeamFields(row);
    expect(stripped).toMatchObject({ id: "t1", slug: "sharks", name: "Sharks" });
    expect(rowExposesPrivateTeamFields(stripped)).toBe(false);
    expect(rowExposesPrivateTeamFields(row)).toBe(true);
  });

  it("new private teams columns are not in the public RPC allowlist", () => {
    expect(PUBLIC_TEAM_RPC_FIELDS).not.toContain("lemon_customer_id");
    expect(PUBLIC_TEAM_RPC_FIELDS).not.toContain("access_code");
    expect(PUBLIC_TEAM_RPC_FIELDS).not.toContain("invite_token");
  });
});
