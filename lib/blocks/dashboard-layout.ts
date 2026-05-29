import type { BlockInstance, BlockType } from "@/lib/types";

export type DashboardPairVariant = "schedule-attendance" | "trips-rules" | "poll-announcement";

export type DashboardWideVariant = "achievements" | "gallery" | "results";

export type DashboardRow =
  | { kind: "pair"; variant: DashboardPairVariant; left: BlockInstance; right: BlockInstance }
  | { kind: "wide"; variant: DashboardWideVariant; block: BlockInstance }
  | { kind: "pair-compact"; left: BlockInstance; right: BlockInstance }
  | { kind: "solo"; block: BlockInstance; size: "full" | "half" };

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

/** Build dashboard rows in coach-defined block order (see block.order). */
export function buildDashboardRows(blocks: BlockInstance[]): DashboardRow[] {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const rows: DashboardRow[] = [];
  let i = 0;

  while (i < sorted.length) {
    const a = sorted[i]!;
    const b = sorted[i + 1];

    if (b) {
      const pv = pairVariant(a.type, b.type);
      if (pv) {
        const { left, right } = pairSides(a, b, pv);
        rows.push({ kind: "pair", variant: pv, left, right });
        i += 2;
        continue;
      }
    }

    const wide = WIDE_VARIANT[a.type];
    if (wide) {
      rows.push({ kind: "wide", variant: wide, block: a });
      i += 1;
      continue;
    }

    if (b) {
      rows.push({ kind: "pair-compact", left: a, right: b });
      i += 2;
      continue;
    }

    rows.push({ kind: "solo", block: a, size: "full" });
    i += 1;
  }

  return rows;
}
