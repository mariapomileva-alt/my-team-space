import { describe, expect, it } from "vitest";
import {
  designStyleClassName,
  personalityTeamPatch,
  resolveDesignStyle,
  resolveEffectiveThemeId,
  TEAM_PAGE_STYLES,
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

describe("resolveEffectiveThemeId", () => {
  it("keeps legacy theme when personality was never saved", () => {
    expect(resolveEffectiveThemeId(undefined, "ocean_aqua")).toBe("ocean_aqua");
  });

  it("applies personality palette after explicit choice", () => {
    expect(resolveEffectiveThemeId({ designStyle: "playful" }, "ocean_aqua")).toBe("pastel_youth");
    expect(resolveEffectiveThemeId({ designStyle: "premium" }, "ocean_aqua")).toBe("minimal_mono");
    expect(resolveEffectiveThemeId({ designStyle: "performance" }, "ocean_aqua")).toBe(
      "energetic_orange",
    );
  });
});

describe("personalityTeamPatch", () => {
  it("sets designStyle and matching theme", () => {
    const patch = personalityTeamPatch("performance", { mobileCardColumns: "single" });
    expect(patch.pageSettings?.designStyle).toBe("performance");
    expect(patch.themeId).toBe("energetic_orange");
    expect(patch.pageSettings?.mobileCardColumns).toBe("single");
  });
});

describe("TEAM_PAGE_STYLES", () => {
  it("defines exactly three public moods", () => {
    expect(TEAM_PAGE_STYLES.map((s) => s.id)).toEqual(["premium", "playful", "performance"]);
  });

  it("maps to stable shell class names", () => {
    for (const style of TEAM_PAGE_STYLES) {
      expect(designStyleClassName(style.id)).toBe(`team-page-style--${style.id}`);
    }
  });

  it("bundles a theme per personality", () => {
    expect(TEAM_PAGE_STYLES.find((s) => s.id === "premium")?.themeId).toBe("minimal_mono");
    expect(TEAM_PAGE_STYLES.find((s) => s.id === "playful")?.themeId).toBe("pastel_youth");
    expect(TEAM_PAGE_STYLES.find((s) => s.id === "performance")?.themeId).toBe("energetic_orange");
  });
});
