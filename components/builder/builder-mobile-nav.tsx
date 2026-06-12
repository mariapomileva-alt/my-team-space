"use client";

import { cn } from "@/lib/utils/cn";

export type BuilderMobileTab = "edit" | "sections" | "preview" | "publish";

const TABS: { id: BuilderMobileTab; label: string; icon: string }[] = [
  { id: "edit", label: "Edit", icon: "✎" },
  { id: "sections", label: "Sections", icon: "▦" },
  { id: "preview", label: "Preview", icon: "▣" },
  { id: "publish", label: "Publish", icon: "✦" },
];

export function BuilderMobileNav({
  active,
  onTab,
  publishDisabled,
  className,
}: {
  active: BuilderMobileTab;
  onTab: (tab: BuilderMobileTab) => void;
  publishDisabled?: boolean;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "builder-mobile-nav fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200/70 bg-white/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl xl:hidden",
        className,
      )}
      aria-label="Builder mobile navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around gap-1">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const disabled = tab.id === "publish" && publishDisabled;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={disabled}
              onClick={() => onTab(tab.id)}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-center transition",
                isActive ? "bg-violet-50 text-violet-700" : "text-zinc-600",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              <span className="text-base leading-none" aria-hidden>
                {tab.icon}
              </span>
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
