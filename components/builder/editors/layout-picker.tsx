"use client";

import type { BlockLayout } from "@/lib/types";
import { LAYOUT_OPTIONS } from "@/lib/blocks/settings";
import { cn } from "@/lib/utils/cn";

const LAYOUT_HINTS: Record<BlockLayout, string> = {
  full: "Full row on the page",
  featured: "Large hero-style card",
  half: "Half row — pairs with the next block",
  card: "Compact tile in the grid",
};

function LayoutBar({ width, height = "h-1.5" }: { width: string; height?: string }) {
  return <div className={cn("rounded-sm bg-current opacity-70", height, width)} />;
}

function LayoutThumbnail({ layout, active }: { layout: BlockLayout; active: boolean }) {
  return (
    <div
      className={cn(
        "flex h-14 w-full items-center justify-center rounded-lg border p-2 transition",
        active ? "border-indigo-400 bg-indigo-50/80 text-indigo-600" : "border-zinc-200 bg-zinc-50 text-zinc-400",
      )}
      aria-hidden
    >
      {layout === "full" ? (
        <div className="flex w-full flex-col gap-1">
          <LayoutBar width="w-full" />
          <LayoutBar width="w-3/4" />
        </div>
      ) : null}
      {layout === "featured" ? (
        <div className="flex w-full flex-col gap-1">
          <LayoutBar width="w-full" height="h-3" />
          <LayoutBar width="w-1/2" height="h-1" />
        </div>
      ) : null}
      {layout === "half" ? (
        <div className="flex w-full gap-1">
          <div className="flex flex-1 flex-col gap-1">
            <LayoutBar width="w-full" />
            <LayoutBar width="w-2/3" />
          </div>
          <div className="w-1/2 rounded-sm border border-dashed border-current opacity-40" />
        </div>
      ) : null}
      {layout === "card" ? (
        <div className="grid w-full grid-cols-2 gap-1">
          <div className="flex flex-col gap-1 rounded-sm border border-current p-1 opacity-80">
            <LayoutBar width="w-full" />
          </div>
          <div className="rounded-sm border border-dashed border-current opacity-40" />
        </div>
      ) : null}
    </div>
  );
}

export function LayoutPicker({ layout, onChange }: { layout: BlockLayout; onChange: (l: BlockLayout) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Layout on page</p>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
        Pick a shape — preview jumps to this block instantly.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {LAYOUT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-xl border p-2 text-left transition",
              layout === opt.value
                ? "border-indigo-400 bg-indigo-50/40 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                : "border-zinc-200 bg-white hover:border-indigo-200 hover:shadow-sm",
            )}
            title={LAYOUT_HINTS[opt.value]}
          >
            <LayoutThumbnail layout={opt.value} active={layout === opt.value} />
            <span className="mt-2 block text-center text-[11px] font-bold text-zinc-800">{opt.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] font-medium text-indigo-700/90">{LAYOUT_HINTS[layout]}</p>
    </div>
  );
}
