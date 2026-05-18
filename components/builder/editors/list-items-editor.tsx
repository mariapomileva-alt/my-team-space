"use client";

import { ImageUploadField } from "@/components/builder/media/image-upload-field";
import type { BlockInstance } from "@/lib/types";
import { getBlockSettings, type ContentItem } from "@/lib/blocks/settings";

export type ListField = { key: string; label: string; placeholder?: string; className?: string };

export function ListItemsEditor({
  block,
  onPatchBlock,
  fields,
  addLabel,
  emptyHint,
  makeItem,
  teamId,
  imageFieldKey,
  imageFolder = "media",
  imageLabel = "Photo / logo",
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  fields: ListField[];
  addLabel: string;
  emptyHint: string;
  makeItem: () => ContentItem;
  teamId?: string;
  imageFieldKey?: string;
  imageFolder?: string;
  imageLabel?: string;
}) {
  const s = getBlockSettings<{ items: ContentItem[] }>(block);
  const items = s.items ?? [];

  function setItems(next: ContentItem[]) {
    onPatchBlock(block.id, { settings: { ...s, items: next } });
  }

  function update(id: string, key: string, value: string) {
    setItems(items.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">{emptyHint}</p>
      {items.map((row) => (
        <div key={row.id} className="space-y-2 rounded-xl border border-zinc-200 bg-white p-3">
          {teamId && imageFieldKey ? (
            <ImageUploadField
              teamId={teamId}
              label={imageLabel}
              folder={imageFolder}
              aspect="square"
              value={String(row[imageFieldKey] ?? "")}
              onChange={(url) => update(row.id, imageFieldKey, url)}
            />
          ) : null}
          <div className={`grid gap-2 ${fields.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {fields.map((f) => (
              <label key={f.key} className="block">
                <span className="text-[10px] font-semibold uppercase text-zinc-400">{f.label}</span>
                <input
                  className={`mt-0.5 w-full rounded-lg border border-zinc-100 px-2 py-1.5 text-sm ${f.className ?? ""}`}
                  placeholder={f.placeholder}
                  value={String(row[f.key] ?? "")}
                  onChange={(e) => update(row.id, f.key, e.target.value)}
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            className="text-xs text-red-600"
            onClick={() => setItems(items.filter((x) => x.id !== row.id))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-full border border-dashed border-indigo-300 px-4 py-2 text-xs font-semibold text-indigo-700"
        onClick={() => setItems([...items, makeItem()])}
      >
        {addLabel}
      </button>
    </div>
  );
}
