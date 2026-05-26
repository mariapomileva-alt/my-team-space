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

const WIDE_ORDER: { type: BlockType; variant: DashboardWideVariant }[] = [
  { type: "achievements", variant: "achievements" },
  { type: "gallery", variant: "gallery" },
  { type: "results", variant: "results" },
];

function findBlock(blocks: BlockInstance[], type: BlockType, used: Set<string>): BlockInstance | undefined {
  const b = blocks.find((x) => x.type === type && !used.has(x.id));
  if (b) used.add(b.id);
  return b;
}

export function buildDashboardRows(blocks: BlockInstance[]): DashboardRow[] {
  const used = new Set<string>();
  const rows: DashboardRow[] = [];
  const pairOrphans: BlockInstance[] = [];

  for (const [leftType, rightType, variant] of PAIRS) {
    const left = findBlock(blocks, leftType, used);
    const right = findBlock(blocks, rightType, used);
    if (left && right) {
      rows.push({ kind: "pair", variant, left, right });
    } else {
      if (left) pairOrphans.push(left);
      if (right) pairOrphans.push(right);
    }
  }

  let o = 0;
  while (o + 1 < pairOrphans.length) {
    rows.push({ kind: "pair-compact", left: pairOrphans[o], right: pairOrphans[o + 1] });
    o += 2;
  }
  for (; o < pairOrphans.length; o++) {
    rows.push({ kind: "solo", block: pairOrphans[o], size: "full" });
  }

  for (const { type, variant } of WIDE_ORDER) {
    const block = findBlock(blocks, type, used);
    if (block) rows.push({ kind: "wide", variant, block });
  }

  const rest = blocks.filter((b) => !used.has(b.id));
  let i = 0;
  while (i < rest.length) {
    const a = rest[i];
    const b = rest[i + 1];
    if (b) {
      rows.push({ kind: "pair-compact", left: a, right: b });
      i += 2;
    } else {
      rows.push({ kind: "solo", block: a, size: "full" });
      i += 1;
    }
  }

  return rows;
}
