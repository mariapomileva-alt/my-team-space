"use client";

import {
  builderCompletionPercent,
  formatSetupAction,
  getSetupSnapshot,
} from "@/lib/builder/page-completion";
import { getPageStructureNav, type PageStructureNavId } from "@/lib/builder/page-structure";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export function BuilderPageStructureNav({
  teamId,
  team,
  activeId,
  onSelect,
  className,
}: {
  teamId: string;
  team: TeamSpace;
  activeId: PageStructureNavId | null;
  onSelect: (id: PageStructureNavId) => void;
  className?: string;
}) {
  const items = getPageStructureNav(team);
  const percent = builderCompletionPercent(team);
  const snap = getSetupSnapshot(team);
  const doneCount = items.filter((i) => i.done).length;

  return (
    <nav className={cn("flex flex-col", className)} aria-label="Page sections">
      <div className="mb-4 rounded-2xl border border-zinc-200/50 bg-white/80 px-3.5 py-3 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Page progress</p>
        <p className="mt-1 text-lg font-bold text-zinc-900">{percent}% Ready</p>
        <p className="mt-0.5 text-[11px] text-zinc-500">
          {doneCount} of {items.length} sections complete
        </p>
        {snap.next ? (
          <p className="mt-2 text-[11px] leading-snug text-zinc-600">
            <span className="font-semibold text-zinc-500">Next:</span> {formatSetupAction(snap.next)}
          </p>
        ) : null}
      </div>

      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        Your page
      </p>

      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition",
                  isActive
                    ? "bg-violet-50 text-violet-950 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.15)]"
                    : "text-zinc-700 hover:bg-white/70",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[13px]",
                    isActive ? "bg-violet-600 text-white" : "bg-zinc-100",
                  )}
                  aria-hidden
                >
                  {item.emoji}
                </span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    item.done
                      ? "bg-emerald-100 text-emerald-700"
                      : item.enabled
                        ? "bg-zinc-100 text-zinc-400"
                        : "bg-zinc-50 text-zinc-300",
                  )}
                  aria-label={item.done ? "Complete" : item.enabled ? "Incomplete" : "Not on page"}
                >
                  {item.done ? "✓" : item.enabled ? "·" : "—"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 space-y-1 border-t border-zinc-200/60 pt-4">
        <Link
          href={`/admin/team/${teamId}`}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-semibold text-zinc-500 transition hover:bg-white/60 hover:text-zinc-800"
        >
          ← Dashboard
        </Link>
        <Link
          href={`/admin/team/${teamId}/settings`}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-semibold text-zinc-500 transition hover:bg-white/60 hover:text-zinc-800"
        >
          ⚙️ Settings
        </Link>
      </div>
    </nav>
  );
}

export function BuilderPageStructureNavMobile({
  team,
  activeId,
  onSelect,
  className,
}: {
  team: TeamSpace;
  activeId: PageStructureNavId | null;
  onSelect: (id: PageStructureNavId) => void;
  className?: string;
}) {
  const items = getPageStructureNav(team);

  return (
    <nav
      className={cn(
        "flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      aria-label="Page sections"
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
              isActive
                ? "bg-violet-600 text-white"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200/80",
            )}
          >
            <span aria-hidden>{item.emoji}</span>
            {item.label}
            {item.done ? (
              <span className="text-[10px] opacity-90" aria-hidden>
                ✓
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
