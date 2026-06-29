import { describe, expect, it } from "vitest";
import { createDefaultBlocks } from "@/lib/default-blocks";
import { getPageStructureNav, structureNavIdForBlockType } from "@/lib/builder/page-structure";
import type { TeamSpace } from "@/lib/types";

function demoTeam(): TeamSpace {
  return {
    id: "team-1",
    slug: "demo",
    name: "Demo FC",
    primaryColor: "#000",
    secondaryColor: "#fff",
    themeId: "ocean_aqua",
    plan: "free",
    blocks: createDefaultBlocks(),
    pageVisibility: "public",
    publishStatus: "draft",
  };
}

describe("getPageStructureNav (polished baseline)", () => {
  it("lists core page sections with unique labels", () => {
    const items = getPageStructureNav(demoTeam());
    const ids = items.map((item) => item.id);
    expect(ids).toContain("header");
    expect(ids).toContain("gallery");
    expect(ids).toContain("calendar");
    expect(ids).toContain("results");
    expect(ids).toContain("contacts");
    const labels = items.map((item) => item.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("maps schedule blocks to the calendar nav item", () => {
    expect(structureNavIdForBlockType("calendar")).toBe("calendar");
    expect(structureNavIdForBlockType("schedule")).toBe("calendar");
  });
});
