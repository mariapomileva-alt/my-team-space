"use client";
import { BLOCK_META } from "@/lib/blocks/meta";
import type { BlockType } from "@/lib/types";
export function PlaceholderEditor({ type }: { type: BlockType }) {
  const m = BLOCK_META[type];
  return (
    <p className="rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
      {m.emoji} More fields for <strong>{m.title}</strong> coming soon. Toggle on and arrange — parents will see a friendly placeholder.
    </p>
  );
}
