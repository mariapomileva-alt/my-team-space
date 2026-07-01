import { BLOCK_META } from "@/lib/blocks/meta";
import type { BlockInstance, BlockLayout } from "@/lib/types";

export function effectiveBlockLayout(block: BlockInstance): BlockLayout {
  return block.layout ?? BLOCK_META[block.type]?.defaultLayout ?? "full";
}

/** Builder picker only offers full vs half; legacy featured/card map cleanly. */
export function normalizeBuilderLayout(layout: BlockLayout): "full" | "half" {
  if (layout === "half" || layout === "card") return "half";
  return "full";
}

/** Two blocks can sit side-by-side on the dashboard. */
export function layoutsCanShareRow(a: BlockLayout, b: BlockLayout): boolean {
  return normalizeBuilderLayout(a) === "half" && normalizeBuilderLayout(b) === "half";
}

export function isCompactLayout(layout: BlockLayout): boolean {
  return normalizeBuilderLayout(layout) === "half";
}
