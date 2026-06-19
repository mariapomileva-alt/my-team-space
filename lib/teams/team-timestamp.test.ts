import { describe, expect, it } from "vitest";
import { isTeamVersionNewer, parseTeamUpdatedAt } from "./team-timestamp";

describe("parseTeamUpdatedAt", () => {
  it("parses ISO timestamps", () => {
    expect(parseTeamUpdatedAt("2026-06-12T10:00:00.000Z")).toBe(Date.parse("2026-06-12T10:00:00.000Z"));
  });

  it("returns null for invalid values", () => {
    expect(parseTeamUpdatedAt(undefined)).toBeNull();
    expect(parseTeamUpdatedAt("")).toBeNull();
    expect(parseTeamUpdatedAt("not-a-date")).toBeNull();
  });
});

describe("isTeamVersionNewer", () => {
  const older = "2026-06-12T10:00:00.000Z";
  const newer = "2026-06-12T11:00:00.000Z";

  it("detects strictly newer server versions", () => {
    expect(isTeamVersionNewer(newer, older)).toBe(true);
    expect(isTeamVersionNewer(older, newer)).toBe(false);
    expect(isTeamVersionNewer(newer, newer)).toBe(false);
  });

  it("returns false when either timestamp is missing", () => {
    expect(isTeamVersionNewer(undefined, older)).toBe(false);
    expect(isTeamVersionNewer(newer, undefined)).toBe(false);
  });
});
