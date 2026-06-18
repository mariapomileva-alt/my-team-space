"use client";

import { TeamProgressWidget } from "@/components/admin/team-progress-widget";
import { cn } from "@/lib/utils/cn";
import type { TeamSpace } from "@/lib/types";

export type BuilderNavSection =
  | "overview"
  | "header"
  | "sections"
  | "design"
  | "payments"
  | "preview"
  | "settings";

const NAV_ITEMS: {
  id: BuilderNavSection;
  label: string;
  description: string;
  icon: string;
}[] = [
  { id: "overview", label: "Page", description: "Overview & publish", icon: "◆" },
  { id: "header", label: "Header", description: "Logo, name, cover", icon: "◎" },
  { id: "sections", label: "Sections", description: "Blocks on your page", icon: "▦" },
  { id: "design", label: "Design", description: "Colors & theme", icon: "◐" },
  { id: "payments", label: "Payments", description: "Fee tracker", icon: "◇" },
  { id: "preview", label: "Preview", description: "Live page view", icon: "▣" },
  { id: "settings", label: "Settings", description: "Privacy & access", icon: "⚙" },
];

export function BuilderSidebar({
  active,
  onNavigate,
  team,
  className,
}: {
  active: BuilderNavSection;
  onNavigate: (section: BuilderNavSection) => void;
  team?: TeamSpace;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "builder-sidebar sticky top-[4.5rem] z-20 hidden h-[calc(100dvh-5.5rem)] w-[13.5rem] shrink-0 flex-col xl:flex",
        className,
      )}
      aria-label="Builder sections"
    >
      <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-zinc-200/60 bg-white/70 p-2 shadow-[0_8px_40px_-24px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        {team ? <TeamProgressWidget team={team} compact className="mb-2 border-0 shadow-none" /> : null}
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Page sections
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                isActive
                  ? "bg-violet-50/90 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.12)]"
                  : "hover:bg-zinc-50/80",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[13px] transition",
                  isActive
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200/80 group-hover:text-zinc-700",
                )}
                aria-hidden
              >
                {item.icon}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-[13px] font-semibold leading-tight",
                    isActive ? "text-violet-950" : "text-zinc-800",
                  )}
                >
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-zinc-500">{item.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
