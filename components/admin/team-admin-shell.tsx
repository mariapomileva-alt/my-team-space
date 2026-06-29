"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BuilderSectionIcon } from "@/components/builder/builder-section-icon";
import { TeamProgressWidget } from "@/components/admin/team-progress-widget";
import { TEAM_ADMIN_NAV, teamBuildPath, type TeamAdminNavId } from "@/lib/admin/admin-nav";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export type { TeamAdminNavId };

export function TeamAdminShell({
  teamId,
  team,
  children,
  activeNav,
  hideSidebar = false,
  showAcademyHub = false,
}: {
  teamId: string;
  team: TeamSpace;
  children: React.ReactNode;
  activeNav: TeamAdminNavId;
  /** Build page uses in-workspace section nav instead */
  hideSidebar?: boolean;
  /** When true, show a link back to the multi-team hub at /admin */
  showAcademyHub?: boolean;
}) {
  const pathname = usePathname();
  const isBuild = activeNav === "build";

  const backHref = isBuild
    ? showAcademyHub
      ? "/admin"
      : teamBuildPath(teamId)
    : showAcademyHub
      ? "/admin"
      : teamBuildPath(teamId);
  const backLabel = isBuild
    ? showAcademyHub
      ? "← All teams"
      : "← Build page"
    : showAcademyHub
      ? "← All teams"
      : "← Build page";

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <header className="sticky top-0 z-30 border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
          {!isBuild || showAcademyHub ? (
            <Link
              href={backHref}
              className="text-sm font-semibold text-zinc-500 transition hover:text-zinc-800"
            >
              {backLabel}
            </Link>
          ) : (
            <span className="text-sm font-semibold text-zinc-400">Build</span>
          )}
          {!isBuild ? <p className="truncate text-sm font-bold text-zinc-900">{team.name}</p> : <span />}
        </div>
      </header>

      <div
        className={cn(
          "mx-auto flex max-w-[1680px] gap-8 px-5 py-8 sm:px-8 lg:py-10",
          hideSidebar && "gap-0",
        )}
      >
        {!hideSidebar ? (
          <aside className="hidden w-[15.5rem] shrink-0 lg:block">
            <TeamProgressWidget team={team} className="mb-6" />
            <nav className="space-y-1" aria-label="Team admin">
              {TEAM_ADMIN_NAV.map((item) => {
                const href = item.href(teamId);
                const isActive = item.id === activeNav || pathname === href;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-[14px] font-semibold transition",
                      isActive
                        ? "bg-white text-zinc-900 shadow-[0_4px_24px_-16px_rgba(15,23,42,0.15)] ring-1 ring-zinc-200/60"
                        : "text-zinc-600 hover:bg-white/60 hover:text-zinc-900",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        isActive ? "bg-violet-100 text-violet-700" : "bg-zinc-100 text-zinc-600",
                      )}
                      aria-hidden
                    >
                      <BuilderSectionIcon icon={item.icon} size="sm" />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        ) : null}

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {!hideSidebar ? (
        <nav
          className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-zinc-200/60 bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden"
          aria-label="Team admin mobile"
        >
          {TEAM_ADMIN_NAV.map((item) => {
            const href = item.href(teamId);
            const isActive = item.id === activeNav;
            return (
              <Link
                key={item.id}
                href={href}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold",
                  isActive ? "text-violet-700" : "text-zinc-500",
                )}
              >
                <BuilderSectionIcon icon={item.icon} size="sm" className={isActive ? "text-violet-700" : undefined} />
                <span className="truncate">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
      ) : null}
      {!hideSidebar ? <div className="h-20 lg:hidden" aria-hidden /> : null}
    </div>
  );
}
