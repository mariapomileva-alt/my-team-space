"use client";

import type { BlockInstance } from "@/lib/types";
import { getBlockSettings } from "@/lib/blocks/settings";

type Settings = { message: string; urgent: boolean; accent: string; pinned: boolean };

export function AnnouncementBarEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<Settings>(block);
  function set(patch: Partial<Settings>) {
    onPatchBlock(block.id, { settings: { ...s, ...patch } });
  }
  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-zinc-500">Quick message</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="No training this Friday"
        value={s.message}
        onChange={(e) => set({ message: e.target.value })}
      />
      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={s.urgent}
          onChange={(e) => set({ urgent: e.target.checked })}
          className="rounded"
        />
        Mark as urgent (stronger color)
      </label>
    </div>
  );
}
