import { effectiveBlockLayout, isCompactLayout, layoutsCanShareRow } from "@/lib/blocks/block-layout";
import type { BlockInstance, BlockType } from "@/lib/types";

export type DashboardPairVariant = "schedule-attendance" | "trips-rules" | "poll-announcement";

export type DashboardWideVariant = "achievements" | "gallery" | "results";

export type DashboardRow =
  | {
      kind: "pair";
      variant: DashboardPairVariant;
      left: BlockInstance;
      right: BlockInstance;
      compact: boolean;
    }
  | { kind: "wide"; variant: DashboardWideVariant; block: BlockInstance; featured: boolean }
  | { kind: "pair-compact"; left: BlockInstance; right: BlockInstance; compact: boolean }
  | {
      kind: "solo";
      block: BlockInstance;
      size: "full" | "half";
      compact: boolean;
      featured: boolean;
    };

const PAIRS: [BlockType, BlockType, DashboardPairVariant][] = [
  ["schedule", "attendance", "schedule-attendance"],
  ["camp_trip", "documents", "trips-rules"],
  ["polls", "team_feed", "poll-announcement"],
];

const WIDE_VARIANT: Partial<Record<BlockType, DashboardWideVariant>> = {
  achievements: "achievements",
  gallery: "gallery",
  results: "results",
};

function pairVariant(left: BlockType, right: BlockType): DashboardPairVariant | null {
  for (const [lt, rt, variant] of PAIRS) {
    if ((left === lt && right === rt) || (left === rt && right === lt)) return variant;
  }
  return null;
}

function pairSides(
  a: BlockInstance,
  b: BlockInstance,
  variant: DashboardPairVariant,
): { left: BlockInstance; right: BlockInstance } {
  for (const [lt, rt, v] of PAIRS) {
    if (v !== variant) continue;
    if (a.type === lt && b.type === rt) return { left: a, right: b };
    if (a.type === rt && b.type === lt) return { left: b, right: a };
  }
  return { left: a, right: b };
}

/** Build dashboard rows from coach block order + per-block layout setting. */
export function buildDashboardRows(blocks: BlockInstance[]): DashboardRow[] {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const rows: DashboardRow[] = [];
  let i = 0;

  while (i < sorted.length) {
    const a = sorted[i]!;
    const b = sorted[i + 1];
    const layoutA = effectiveBlockLayout(a);
    const layoutB = b ? effectiveBlockLayout(b) : null;

    const wideVariant = WIDE_VARIANT[a.type];
    if (wideVariant && (layoutA === "featured" || layoutA === "full")) {
      rows.push({
        kind: "wide",
        variant: wideVariant,
        block: a,
        featured: layoutA === "featured",
      });
      i += 1;
      continue;
    }

    if (layoutA === "featured") {
      rows.push({ kind: "solo", block: a, size: "full", compact: false, featured: true });
      i += 1;
      continue;
    }

    if (b && layoutB && layoutsCanShareRow(layoutA, layoutB)) {
      const compact = isCompactLayout(layoutA) || isCompactLayout(layoutB);
      const pv = pairVariant(a.type, b.type);
      if (pv) {
        const { left, right } = pairSides(a, b, pv);
        rows.push({ kind: "pair", variant: pv, left, right, compact });
      } else {
        rows.push({ kind: "pair-compact", left: a, right: b, compact });
      }
      i += 2;
      continue;
    }

    if (layoutA === "full") {
      rows.push({ kind: "solo", block: a, size: "full", compact: false, featured: false });
      i += 1;
      continue;
    }

    if (layoutA === "half" || layoutA === "card") {
      rows.push({
        kind: "solo",
        block: a,
        size: "half",
        compact: isCompactLayout(layoutA),
        featured: false,
      });
      i += 1;
      continue;
    }

    rows.push({ kind: "solo", block: a, size: "full", compact: false, featured: false });
    i += 1;
  }

  return rows;
}
