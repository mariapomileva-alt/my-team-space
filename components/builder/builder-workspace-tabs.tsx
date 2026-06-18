"use client";

import { cn } from "@/lib/utils/cn";

export type BuilderWorkspaceSection = "header" | "sections" | "design" | "payments";

const TABS: { id: BuilderWorkspaceSection; label: string }[] = [
  { id: "header", label: "Header" },
  { id: "sections", label: "Sections" },
  { id: "design", label: "Design" },
  { id: "payments", label: "Payments" },
];

export function BuilderWorkspaceTabs({
  active,
  onSelect,
  className,
}: {
  active: BuilderWorkspaceSection;
  onSelect: (section: BuilderWorkspaceSection) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 -mx-1 mb-1 border-b border-zinc-200/60 bg-[#f7f7f8]/95 px-1 pb-0 pt-1 backdrop-blur-md",
        className,
      )}
      role="tablist"
      aria-label="Page editor sections"
    >
      <div className="flex gap-1 overflow-x-auto pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(tab.id)}
              className={cn(
                "shrink-0 rounded-t-xl px-4 py-2.5 text-[13px] font-semibold transition",
                isActive
                  ? "bg-white text-zinc-900 shadow-[0_-1px_0_0_rgba(15,23,42,0.06)] ring-1 ring-zinc-200/60 ring-b-white"
                  : "text-zinc-500 hover:bg-white/50 hover:text-zinc-800",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
