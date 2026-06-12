import { describe, expect, it } from "vitest";
import {
  isReservedTeamSlug,
  legacyTeamPath,
  publicTeamPath,
  publicTeamUrl,
  siteOriginFromPublicTeamUrl,
} from "./public-url";

describe("public-url", () => {
  it("builds canonical paths", () => {
    expect(publicTeamPath("Dance-Stars")).toBe("/dance-stars");
    expect(legacyTeamPath("stars")).toBe("/team/stars");
    expect(publicTeamUrl("https://myteamspace.cc", "stars")).toBe("https://myteamspace.cc/stars");
  });

  it("extracts site origin from public URL", () => {
    expect(siteOriginFromPublicTeamUrl("https://myteamspace.cc/stars")).toBe("https://myteamspace.cc");
    expect(siteOriginFromPublicTeamUrl("https://myteamspace.cc/team/stars")).toBe(
      "https://myteamspace.cc",
    );
  });

  it("blocks reserved slugs", () => {
    expect(isReservedTeamSlug("pricing")).toBe(true);
    expect(isReservedTeamSlug("dance-stars")).toBe(false);
  });
});
