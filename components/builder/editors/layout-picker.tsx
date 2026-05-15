"use client";

import type { BlockLayout } from "@/lib/types";
import { LAYOUT_OPTIONS } from "@/lib/blocks/settings";

export function LayoutPicker({ layout, onChange }: { layout: BlockLayout; onChange: (l: BlockLayout) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Layout on page</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {LAYOUT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              layout === opt.value
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-zinc-200 bg-white text-zinc-600 hover:border-indigo-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
