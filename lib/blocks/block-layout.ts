import { BLOCK_META } from "@/lib/blocks/meta";
import type { BlockInstance, BlockLayout } from "@/lib/types";

export function effectiveBlockLayout(block: BlockInstance): BlockLayout {
  return block.layout ?? BLOCK_META[block.type]?.defaultLayout ?? "full";
}

/** Two blocks can sit side-by-side on the dashboard. */
export function layoutsCanShareRow(a: BlockLayout, b: BlockLayout): boolean {
  return (a === "half" || a === "card") && (b === "half" || b === "card");
}

export function isCompactLayout(layout: BlockLayout): boolean {
  return layout === "card";
}
