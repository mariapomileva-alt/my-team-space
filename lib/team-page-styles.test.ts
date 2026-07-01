import { describe, expect, it } from "vitest";
import {
  designStyleClassName,
  resolveDesignStyle,
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
});
