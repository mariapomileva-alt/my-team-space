import { describe, expect, it } from "vitest";
import { createDefaultBlocks } from "@/lib/default-blocks";
import {
  BUILDER_NAV_ORDER,
  CORE_PAGE_NAV_IDS,
  getPageStructureNav,
  structureNavIdForBlockType,
} from "@/lib/builder/page-structure";
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

describe("getPageStructureNav", () => {
  it("includes core and extended builder sections", () => {
    const ids = getPageStructureNav(demoTeam()).map((item) => item.id);
    for (const core of CORE_PAGE_NAV_IDS) {
      expect(ids).toContain(core);
    }
    expect(ids).toContain("announcement_bar");
    expect(ids).toContain("payments");
    expect(ids).toContain("quick_actions");
    expect(ids).toContain("integrations");
    expect(ids).toContain("polls");
  });

  it("groups extended sections under more", () => {
    const items = getPageStructureNav(demoTeam());
    expect(items.find((i) => i.id === "gallery")?.group).toBe("core");
    expect(items.find((i) => i.id === "payments")?.group).toBe("more");
    expect(items.find((i) => i.id === "integrations")?.group).toBe("more");
  });

  it("maps calendar blocks to the schedule nav item", () => {
    expect(structureNavIdForBlockType("calendar")).toBe("schedule");
    expect(structureNavIdForBlockType("integrations")).toBe("integrations");
  });

  it("keeps a stable nav order for regression checks", () => {
    expect(BUILDER_NAV_ORDER.indexOf("payments")).toBeLessThan(BUILDER_NAV_ORDER.indexOf("integrations"));
    expect(BUILDER_NAV_ORDER.indexOf("announcement_bar")).toBeLessThan(BUILDER_NAV_ORDER.indexOf("gallery"));
  });

  it("uses distinct labels for results board and trophies", () => {
    const items = getPageStructureNav(demoTeam());
    expect(items.find((i) => i.id === "results")?.label).toBe("Results board");
    expect(items.find((i) => i.id === "achievements")?.label).toBe("Trophies");
    const labels = items.map((i) => i.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("hides advanced sections until they are enabled on the page", () => {
    const team = demoTeam();
    const ids = getPageStructureNav(team).map((i) => i.id);
    expect(ids).not.toContain("weather");
    expect(ids).not.toContain("countdown");
  });
});
