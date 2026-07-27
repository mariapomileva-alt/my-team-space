import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  isTeamVisibleToAnonPublic,
  PUBLIC_PUBLISH_MIGRATION,
} from "@/lib/security/public-team-publish";

function readPublishMigrationSql(): string {
  return readFileSync(
    join(process.cwd(), "supabase/migrations", PUBLIC_PUBLISH_MIGRATION),
    "utf8",
  );
}

describe("P0-05 — public access requires published status", () => {
  it("published active/trialing teams are visible to anon", () => {
    expect(
      isTeamVisibleToAnonPublic({ publish_status: "published", subscription_status: "active" }),
    ).toBe(true);
    expect(
      isTeamVisibleToAnonPublic({ publish_status: "published", subscription_status: "trialing" }),
    ).toBe(true);
  });

  it("draft and unpublished teams are hidden from anon", () => {
    expect(
      isTeamVisibleToAnonPublic({ publish_status: "draft", subscription_status: "active" }),
    ).toBe(false);
    expect(
      isTeamVisibleToAnonPublic({ publish_status: "draft", subscription_status: "trialing" }),
    ).toBe(false);
  });

  it("inactive subscription teams are hidden from anon even when published", () => {
    expect(
      isTeamVisibleToAnonPublic({ publish_status: "published", subscription_status: "inactive" }),
    ).toBe(false);
    expect(
      isTeamVisibleToAnonPublic({ publish_status: "published", subscription_status: "canceled" }),
    ).toBe(false);
  });

  it("migration filters get_public_team_by_slug by publish_status", () => {
    const sql = readPublishMigrationSql();
    expect(sql).toMatch(/publish_status = 'published'/i);
    expect(sql).toMatch(/subscription_status in \('active', 'trialing'\)/i);
  });

  it("migration adds member-only get_member_team_by_slug for coach draft preview", () => {
    const sql = readPublishMigrationSql();
    expect(sql).toMatch(/function public\.get_member_team_by_slug/i);
    expect(sql).toMatch(/team_members m/i);
    expect(sql).toMatch(/auth\.uid\(\)/i);
  });

  it("content table public_read policies require publish_status", () => {
    const sql = readPublishMigrationSql();
    expect(sql).toMatch(/schedule_events_public_read/i);
    expect(sql).toMatch(/team_updates_public_read/i);
    expect(sql).toMatch(/achievements_public_read/i);
    const matches = sql.match(/publish_status = 'published'/gi) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(4);
  });

  it("verify_team_access only checks published live teams", () => {
    const sql = readPublishMigrationSql();
    const fn = sql.slice(sql.indexOf("create or replace function public.verify_team_access"));
    expect(fn).toMatch(/publish_status = 'published'/i);
  });
});
