"use client";

import {
  builderCompletionPercent,
  formatSetupAction,
  getProgressMotivationLine,
  getSetupSnapshot,
} from "@/lib/builder/page-completion";
import { BuilderSectionIcon } from "@/components/builder/builder-section-icon";
import { getPageStructureNav, type PageStructureNavId } from "@/lib/builder/page-structure";
import { BuilderHowItWorksGuideButton, BuilderHowItWorksSidebar } from "@/components/builder/builder-how-it-works";
import { BUILDER_TEAM_TOOL_LINKS } from "@/lib/admin/admin-nav";
import type { BuilderProgressTarget } from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export function BuilderPageStructureNav({
  teamId,
  team,
  activeId,
  onSelect,
  onJump,
  showAcademyHub = false,
  className,
}: {
  teamId: string;
  team: TeamSpace;
  activeId: PageStructureNavId | null;
  onSelect: (id: PageStructureNavId) => void;
  onJump?: (target: BuilderProgressTarget) => void;
  showAcademyHub?: boolean;
  className?: string;
}) {
  const items = getPageStructureNav(team);
  const percent = builderCompletionPercent(team);
  const snap = getSetupSnapshot(team);
  const motivation = getProgressMotivationLine(team);
  const doneCount = items.filter((i) => i.done).length;

  return (
    <nav className={cn("flex flex-col", className)} aria-label="Page sections">
      <div className="mb-3 rounded-xl border border-zinc-200/50 bg-white/80 px-3 py-2.5 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[15px] font-bold text-zinc-900">{percent}% Ready</p>
          <p className="text-[10px] font-medium text-zinc-500">
            {doneCount}/{items.length}
          </p>
        </div>
        <p className="mt-1 text-[11px] leading-snug text-zinc-500">{motivation}</p>
        {snap.next ? (
          onJump ? (
            <button
              type="button"
              onClick={() => onJump(snap.next!.id)}
              className="mt-1.5 w-full text-left text-[11px] leading-snug text-zinc-600 transition hover:text-violet-800"
            >
              <span className="font-semibold text-violet-700">Next:</span> {formatSetupAction(snap.next)}
            </button>
          ) : (
            <p className="mt-1.5 text-[11px] leading-snug text-zinc-600">
              <span className="font-semibold text-violet-700">Next:</span> {formatSetupAction(snap.next)}
            </p>
          )
        ) : (
          <p className="mt-1.5 text-[11px] font-medium text-emerald-700">All sections complete</p>
        )}
      </div>

      <p className="mb-1.5 px-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        Your page
      </p>

      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-semibold transition-colors duration-150",
                  isActive
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-white/80",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                    isActive ? "bg-white/20" : "bg-zinc-100",
                  )}
                  aria-hidden
                >
                  <BuilderSectionIcon structureId={item.id} size="sm" />
                </span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span
                  className={cn(
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                    item.done
                      ? isActive
                        ? "bg-white/25 text-white"
                        : "bg-emerald-100 text-emerald-700"
                      : isActive
                        ? "bg-white/15 text-white/80"
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

      <div className="mt-5 space-y-0.5 border-t border-zinc-200/60 pt-3">
        <p className="mb-1.5 px-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Team tools
        </p>
        {BUILDER_TEAM_TOOL_LINKS.map((item) => (
          <Link
            key={item.label}
            href={item.href(teamId)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-zinc-500 transition hover:bg-white/60 hover:text-zinc-800"
          >
            <BuilderSectionIcon icon={item.icon} size="sm" className="opacity-70" />
            {item.label}
          </Link>
        ))}
        <Link
          href={`/admin/team/${teamId}/settings`}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-zinc-500 transition hover:bg-white/60 hover:text-zinc-800"
        >
          <BuilderSectionIcon icon="settings" size="sm" className="opacity-70" />
          Settings
        </Link>
        {showAcademyHub ? (
          <Link
            href="/admin"
            className="mt-1 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-zinc-500 transition hover:bg-white/60 hover:text-zinc-800"
          >
            ← All teams
          </Link>
        ) : null}
      </div>

      <div className="hidden lg:block">
        <BuilderHowItWorksSidebar isAcademy={showAcademyHub} />
      </div>
    </nav>
  );
}

export function BuilderPageStructureNavMobile({
  team,
  activeId,
  onSelect,
  onOpenGuide,
  className,
}: {
  team: TeamSpace;
  activeId: PageStructureNavId | null;
  onSelect: (id: PageStructureNavId) => void;
  onOpenGuide?: () => void;
  className?: string;
}) {
  const items = getPageStructureNav(team);

  return (
    <nav
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      aria-label="Page sections"
    >
      {onOpenGuide ? <BuilderHowItWorksGuideButton onClick={onOpenGuide} /> : null}
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors duration-150",
              isActive
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200/80",
            )}
          >
            <BuilderSectionIcon structureId={item.id} size="xs" />
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
