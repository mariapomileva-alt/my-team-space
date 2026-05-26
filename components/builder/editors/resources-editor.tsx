"use client";

import type { BlockInstance } from "@/lib/types";
import { ResourceCard } from "@/components/integrations/resource-card";
import { getBlockSettings, newResourceItem, type ResourceItem, type ResourceKind } from "@/lib/blocks/settings";
import { useState } from "react";

const KINDS: { value: ResourceKind; label: string; emoji: string }[] = [
  { value: "pdf", label: "PDF / document", emoji: "📄" },
  { value: "link", label: "Web link", emoji: "🔗" },
  { value: "audio", label: "Music / audio", emoji: "🎵" },
  { value: "video", label: "Video", emoji: "🎬" },
  { value: "image", label: "Gallery", emoji: "🖼️" },
  { value: "plan", label: "Travel plan", emoji: "✈️" },
  { value: "nutrition", label: "Nutrition guide", emoji: "🥗" },
  { value: "choreography", label: "Choreography", emoji: "💃" },
  { value: "other", label: "Other", emoji: "📦" },
];

export function ResourcesEditor({
  block,
  teamId,
  onPatchBlock,
}: {
  block: BlockInstance;
  teamId: string;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<{ sectionTitle?: string; items: ResourceItem[] }>(block);
  const items = s.items ?? [];

  function set(patch: Partial<{ sectionTitle?: string; items: ResourceItem[] }>) {
    onPatchBlock(block.id, { settings: { ...s, ...patch } });
  }

  function update(id: string, patch: Partial<ResourceItem>) {
    set({ items: items.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  }

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-zinc-500">
        Competition PDFs, warmup plans, nutrition guides, travel notes — everything families need in one place.
      </p>
      <label className="block text-xs font-semibold text-zinc-500">Section title</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Team resources"
        value={s.sectionTitle ?? ""}
        onChange={(e) => set({ sectionTitle: e.target.value })}
      />
      {items.map((item) => (
        <ResourceRow key={item.id} item={item} teamId={teamId} onUpdate={(p) => update(item.id, p)} onRemove={() => set({ items: items.filter((x) => x.id !== item.id) })} />
      ))}
      <button
        type="button"
        onClick={() => set({ items: [...items, newResourceItem()] })}
        className="rounded-full border border-dashed border-teal-300 px-4 py-2 text-xs font-semibold text-teal-800"
      >
        + Add resource
      </button>
    </div>
  );
}

function ResourceRow({
  item,
  teamId,
  onUpdate,
  onRemove,
}: {
  item: ResourceItem;
  teamId: string;
  onUpdate: (p: Partial<ResourceItem>) => void;
  onRemove: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileUrl = item.fileUrl?.trim() || item.url?.trim();

  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "resources");
      const res = await fetch(`/api/admin/teams/${teamId}/upload`, { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
      onUpdate({ fileUrl: data.url, url: data.url });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const kindMeta = KINDS.find((k) => k.value === item.kind) ?? KINDS[0];

  return (
    <div className="space-y-2 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-4">
      <div className="flex flex-wrap gap-1">
        {KINDS.map((k) => (
          <button
            key={k.value}
            type="button"
            onClick={() => onUpdate({ kind: k.value })}
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${
              item.kind === k.value ? "bg-teal-600 text-white" : "bg-white text-zinc-600 ring-1 ring-zinc-200"
            }`}
          >
            {k.emoji} {k.label}
          </button>
        ))}
      </div>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold"
        placeholder="Title"
        value={item.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
      />
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Short description (optional)"
        value={item.description ?? ""}
        onChange={(e) => onUpdate({ description: e.target.value })}
      />
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Link URL (Google Drive, Dropbox, etc.)"
        value={item.url ?? ""}
        onChange={(e) => onUpdate({ url: e.target.value })}
      />
      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-600">
        <span>{uploading ? "Uploading…" : `📤 Upload ${kindMeta.label.toLowerCase()}`}</span>
        <input
          type="file"
          className="sr-only"
          accept={item.kind === "pdf" ? ".pdf,application/pdf" : item.kind === "audio" ? "audio/*" : "image/*,.pdf"}
          onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {fileUrl ? (
        <p className="truncate text-[11px] text-teal-700">✓ {fileUrl}</p>
      ) : null}
      {item.title?.trim() && fileUrl ? (
        <div className="pointer-events-none max-w-sm origin-top-left scale-[0.9] opacity-95">
          <ResourceCard item={{ ...item, url: fileUrl }} variant="compact" />
        </div>
      ) : null}
      {err ? <p className="text-xs text-red-600">{err}</p> : null}
      <button type="button" className="text-xs font-semibold text-red-600" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
