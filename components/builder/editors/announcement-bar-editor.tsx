"use client";

import type { BlockInstance } from "@/lib/types";
import { getBlockSettings } from "@/lib/blocks/settings";

type Settings = {
  message: string;
  tone: "info" | "urgent" | "confirm";
  urgent?: boolean;
};

export function AnnouncementBarEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<Settings>(block);
  const tone = s.tone ?? (s.urgent ? "urgent" : "info");

  function set(patch: Partial<Settings>) {
    onPatchBlock(block.id, { settings: { ...s, ...patch } });
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-zinc-500">Quick message</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Bus leaves at 08:30"
        value={s.message}
        onChange={(e) => set({ message: e.target.value })}
      />
      <p className="text-xs font-semibold text-zinc-500">Style</p>
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "info" as const, label: "Info" },
            { id: "urgent" as const, label: "Urgent" },
            { id: "confirm" as const, label: "Needs reply" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => set({ tone: opt.id, urgent: opt.id === "urgent" })}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              tone === opt.id ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
