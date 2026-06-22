import { describe, expect, it } from "vitest";
import {
  contentLevelForBlock,
  dominantContentLevel,
} from "@/lib/blocks/content-hierarchy";

describe("contentLevelForBlock", () => {
  it("marks parent essentials as core", () => {
    expect(contentLevelForBlock("schedule")).toBe("core");
    expect(contentLevelForBlock("contacts")).toBe("core");
    expect(contentLevelForBlock("results")).toBe("core");
    expect(contentLevelForBlock("team_feed")).toBe("core");
  });

  it("marks secondary modules as supporting", () => {
    expect(contentLevelForBlock("gallery")).toBe("supporting");
    expect(contentLevelForBlock("attendance")).toBe("supporting");
    expect(contentLevelForBlock("camp_trip")).toBe("supporting");
  });

  it("marks niche modules as optional", () => {
    expect(contentLevelForBlock("polls")).toBe("optional");
    expect(contentLevelForBlock("team_shop")).toBe("optional");
    expect(contentLevelForBlock("payments")).toBe("optional");
    expect(contentLevelForBlock("weather")).toBe("optional");
    expect(contentLevelForBlock("sponsors")).toBe("optional");
  });
});

describe("dominantContentLevel", () => {
  it("prefers core over supporting and optional", () => {
    expect(dominantContentLevel("optional", "core", "supporting")).toBe("core");
    expect(dominantContentLevel("optional", "supporting")).toBe("supporting");
  });
});
