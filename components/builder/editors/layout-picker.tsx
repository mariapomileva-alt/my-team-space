"use client";

import type { BlockLayout } from "@/lib/types";
import { LAYOUT_OPTIONS } from "@/lib/blocks/settings";
import { cn } from "@/lib/utils/cn";

type PickerLayout = "full" | "half";

const LAYOUT_HINTS: Record<PickerLayout, string> = {
  full: "One full-width plate across the page",
  half: "Half width — sits beside the next half block",
};

function LayoutThumbnail({ layout, active }: { layout: PickerLayout; active: boolean }) {
  return (
    <div
      className={cn(
        "flex h-14 w-full items-center justify-center overflow-hidden rounded-lg border p-2 transition",
        active ? "border-indigo-400 bg-indigo-50/80 text-indigo-600" : "border-zinc-200 bg-zinc-50 text-zinc-400",
      )}
      aria-hidden
    >
      {layout === "full" ? (
        <div className="flex w-full flex-col gap-1">
          <div className="h-2 w-full rounded-sm bg-current opacity-70" />
          <div className="h-1.5 w-4/5 rounded-sm bg-current opacity-50" />
        </div>
      ) : (
        <div className="flex w-full gap-1">
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-2 w-full rounded-sm bg-current opacity-70" />
            <div className="h-1.5 w-2/3 rounded-sm bg-current opacity-50" />
          </div>
          <div className="w-[42%] rounded-sm border border-dashed border-current opacity-35" />
        </div>
      )}
    </div>
  );
}

export function LayoutPicker({
  layout,
  onChange,
}: {
  layout: PickerLayout;
  onChange: (l: PickerLayout) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Layout on page</p>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
        Full row or half row — each block is a plate on the page.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
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
