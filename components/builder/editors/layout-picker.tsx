"use client";

import type { BlockLayout } from "@/lib/types";
import { LAYOUT_OPTIONS } from "@/lib/blocks/settings";

const LAYOUT_HINTS: Record<BlockLayout, string> = {
  full: "Full row on the page",
  featured: "Large hero-style card",
  half: "Half row — pairs with the next half/card block",
  card: "Compact tile in the grid",
};

export function LayoutPicker({ layout, onChange }: { layout: BlockLayout; onChange: (l: BlockLayout) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Layout on page</p>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
        Tap an option — the phone preview jumps to this block and updates right away.
      </p>
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
            title={LAYOUT_HINTS[opt.value]}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] font-medium text-indigo-700/90">{LAYOUT_HINTS[layout]}</p>
    </div>
  );
}
