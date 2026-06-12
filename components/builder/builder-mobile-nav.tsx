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
  publishLocked,
  className,
}: {
  active: BuilderMobileTab;
  onTab: (tab: BuilderMobileTab) => void;
  /** Hard disable (e.g. publishing in progress, not coach). */
  publishDisabled?: boolean;
  /** Billing lock — button stays tappable; parent shows a message. */
  publishLocked?: boolean;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "builder-mobile-nav pointer-events-auto fixed inset-x-0 bottom-0 z-[120] border-t border-zinc-200/70 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl xl:hidden",
        className,
      )}
      aria-label="Builder mobile navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around gap-1">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const disabled = tab.id === "publish" && publishDisabled;
          const locked = tab.id === "publish" && publishLocked && !publishDisabled;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={disabled}
              onClick={() => onTab(tab.id)}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-center transition touch-manipulation",
                isActive ? "bg-violet-50 text-violet-700" : "text-zinc-600",
                tab.id === "publish" && !disabled && "text-violet-700",
                disabled && "cursor-not-allowed opacity-40",
                locked && "text-amber-700",
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
