import { describe, expect, it } from "vitest";
import { TEAM_COLOR_PALETTES, paletteForTheme, resolvePaletteThemeId } from "@/lib/team-color-palettes";
import {
  designStyleClassName,
  personalityTeamPatch,
  resolveDesignStyle,
  TEAM_PERSONALITIES,
} from "@/lib/team-page-styles";

describe("resolveDesignStyle", () => {
  it("defaults to premium when designStyle is missing", () => {
    expect(resolveDesignStyle(undefined)).toBe("premium");
    expect(resolveDesignStyle({})).toBe("premium");
  });

  it("returns saved style when valid", () => {
    expect(resolveDesignStyle({ designStyle: "playful" })).toBe("playful");
    expect(resolveDesignStyle({ designStyle: "performance" })).toBe("performance");
  });

  it("falls back to premium for unknown values", () => {
    expect(resolveDesignStyle({ designStyle: "neon" as "premium" })).toBe("premium");
  });

  it("infers playful from legacy pastel theme", () => {
    expect(resolveDesignStyle(undefined, "pastel_youth")).toBe("playful");
  });

  it("infers performance from legacy energetic theme", () => {
    expect(resolveDesignStyle(undefined, "energetic_orange")).toBe("performance");
  });
});

describe("personalityTeamPatch", () => {
  it("sets designStyle only and keeps palette independent", () => {
    const patch = personalityTeamPatch("performance", { mobileCardColumns: "single" });
    expect(patch.pageSettings?.designStyle).toBe("performance");
    expect(patch.pageSettings?.mobileCardColumns).toBe("single");
    expect(patch.themeId).toBeUndefined();
  });
});

describe("TEAM_PERSONALITIES", () => {
  it("defines exactly three personalities", () => {
    expect(TEAM_PERSONALITIES.map((s) => s.id)).toEqual(["premium", "playful", "performance"]);
  });

  it("maps to stable shell class names", () => {
    for (const style of TEAM_PERSONALITIES) {
      expect(designStyleClassName(style.id)).toBe(`team-page-style--${style.id}`);
    }
  });

  it("uses svg icons for premium and performance", () => {
    expect(TEAM_PERSONALITIES.find((s) => s.id === "premium")?.iconPresentation).toBe("svg");
    expect(TEAM_PERSONALITIES.find((s) => s.id === "performance")?.iconPresentation).toBe("svg");
    expect(TEAM_PERSONALITIES.find((s) => s.id === "playful")?.iconPresentation).toBe("emoji");
  });
});

describe("paletteForTheme", () => {
  it("exposes six public palettes", () => {
    expect(TEAM_COLOR_PALETTES).toHaveLength(6);
    expect(TEAM_COLOR_PALETTES.map((p) => p.label)).toContain("Sunset");
    expect(TEAM_COLOR_PALETTES.map((p) => p.label)).toContain("Chrome");
  });

  it("resolves friendly palette labels", () => {
    expect(paletteForTheme("ocean_aqua").label).toBe("Ocean");
    expect(paletteForTheme("premium_forest").label).toBe("Forest");
    expect(paletteForTheme("minimal_mono").label).toBe("Chrome");
    expect(paletteForTheme("sunset_coral").label).toBe("Sunset");
  });

  it("maps retired dark palette to Chrome", () => {
    expect(paletteForTheme("dark_athletic").label).toBe("Chrome");
    expect(paletteForTheme("dark_athletic").themeId).toBe("minimal_mono");
  });
});
