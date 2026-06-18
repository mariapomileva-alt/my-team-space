import { describe, expect, it } from "vitest";
import { buildDashboardRows } from "@/lib/blocks/dashboard-layout";
import type { BlockInstance } from "@/lib/types";

function block(id: string, type: BlockInstance["type"], layout: BlockInstance["layout"]): BlockInstance {
  return { id, type, enabled: true, order: 0, layout, settings: {} };
}

describe("buildDashboardRows", () => {
  it("promotes orphan half tiles to full-width compact rows", () => {
    const rows = buildDashboardRows([
      { ...block("a", "schedule", "half"), order: 1 },
      { ...block("b", "gallery", "featured"), order: 2 },
    ]);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ kind: "solo", size: "full", compact: true });
    expect(rows[1]).toMatchObject({ kind: "wide", variant: "gallery" });
  });

  it("pairs consecutive half tiles", () => {
    const rows = buildDashboardRows([
      { ...block("a", "polls", "card"), order: 1 },
      { ...block("b", "contacts", "card"), order: 2 },
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.kind).toBe("pair-compact");
  });
});
