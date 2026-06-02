"use client";

import type { BuilderPreviewMode } from "@/lib/builder/preview";
import { cn } from "@/lib/utils/cn";

const MODES: { id: BuilderPreviewMode; label: string; icon: string }[] = [
  { id: "mobile", label: "Mobile", icon: "📱" },
  { id: "desktop", label: "Desktop", icon: "💻" },
];

export function BuilderPreviewSegment({
  mode,
  onChange,
  className,
}: {
  mode: BuilderPreviewMode;
  onChange: (mode: BuilderPreviewMode) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full rounded-[10px] bg-zinc-200/60 p-0.5 ring-1 ring-inset ring-zinc-300/50",
        className,
      )}
      role="tablist"
      aria-label="Preview device"
    >
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-[8px] py-1.5 text-[11px] font-semibold transition-all duration-200",
              active
                ? "bg-white text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)]"
                : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            <span className="text-sm leading-none" aria-hidden>
              {m.icon}
            </span>
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
