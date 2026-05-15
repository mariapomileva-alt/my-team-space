"use client";

import { getBlockSettings, newCampItem, type ListBlockSettings } from "@/lib/blocks/settings";
import type { BlockInstance } from "@/lib/types";

export function LogisticsEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<ListBlockSettings & { confirmationsEnabled?: boolean }>(block);
  const items = s.items ?? [];

  function set(patch: Partial<typeof s>) {
    onPatchBlock(block.id, { settings: { ...s, ...patch } });
  }

  function updateItem(id: string, field: string, value: string) {
    set({
      items: items.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">
        Trips, buses, packing lists. Parents can tap Confirm on the public page (saved locally for now).
      </p>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(s.confirmationsEnabled)}
          onChange={(e) => set({ confirmationsEnabled: e.target.checked })}
          className="rounded"
        />
        Show &quot;Confirm participation&quot; button
      </label>
      {items.map((row) => (
        <div key={row.id} className="rounded-xl border border-zinc-200 bg-white p-3 space-y-2">
          <input
            className="w-full rounded-lg border border-zinc-100 px-2 py-1.5 text-sm font-semibold"
            placeholder="Event title"
            value={row.title ?? ""}
            onChange={(e) => updateItem(row.id, "title", e.target.value)}
          />
          <textarea
            className="w-full rounded-lg border border-zinc-100 px-2 py-1.5 text-sm"
            rows={2}
            placeholder="Bus 08:30 · checklist…"
            value={row.body ?? ""}
            onChange={(e) => updateItem(row.id, "body", e.target.value)}
          />
          <button
            type="button"
            className="text-xs text-red-500"
            onClick={() => set({ items: items.filter((i) => i.id !== row.id) })}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => set({ items: [...items, newCampItem()] })}
        className="w-full rounded-xl border border-dashed border-zinc-300 py-2 text-sm font-semibold text-zinc-600"
      >
        + Add trip / event
      </button>
    </div>
  );
}
