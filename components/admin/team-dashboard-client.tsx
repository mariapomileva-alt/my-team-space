"use client";

import Link from "next/link";
import { PremiumEmptyState } from "@/components/admin/premium-empty-state";
import { TeamAssistantPanel } from "@/components/admin/team-assistant-panel";
import { TeamProgressWidget } from "@/components/admin/team-progress-widget";
import { TeamQuickActions } from "@/components/admin/team-quick-actions";
import { TeamAdminShell } from "@/components/admin/team-admin-shell";
import { getCompletionGuidance } from "@/lib/builder/page-completion";
import { getTeamLevel } from "@/lib/builder/team-levels";
import { ADMIN_CARD, ADMIN_CARD_PAD, ADMIN_SECTION_GAP, ADMIN_SUBTITLE, ADMIN_TITLE } from "@/lib/admin/admin-layout";
import type { TeamAdminStats } from "@/lib/admin/load-team-admin-context";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className={cn(ADMIN_CARD, "p-5 sm:p-6")}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">{value}</p>
      {hint ? <p className="mt-1 text-[12px] text-zinc-500">{hint}</p> : null}
    </div>
  );
}

function formatEventDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

export function TeamDashboardClient({
  teamId,
  team,
  publicUrl,
  stats,
}: {
  teamId: string;
  team: TeamSpace;
  publicUrl: string;
  stats: TeamAdminStats;
}) {
  const guidance = getCompletionGuidance(team);
  const level = getTeamLevel(team);

  return (
    <TeamAdminShell teamId={teamId} team={team} activeNav="build">
      <div className={ADMIN_SECTION_GAP}>
        <div className="lg:hidden">
          <TeamProgressWidget team={team} />
        </div>

        <header>
          <p className="text-sm font-medium text-violet-700">
            {level.emoji} {level.label}
          </p>
          <h1 className={ADMIN_TITLE}>{team.name}</h1>
          <p className={ADMIN_SUBTITLE}>
            Your team&apos;s digital home — calm, proud, and ready for parents and athletes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/admin/team/${teamId}/build`}
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98]"
            >
              Continue building
            </Link>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              View live page
            </a>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Completion" value={`${guidance.readinessPercent}%`} hint={guidance.summaryLine} />
          <StatCard label="Members" value={stats.memberCount} hint="Coaches & assistants" />
          <StatCard label="Upcoming" value={stats.upcomingEvents.length} hint="Events on calendar" />
          <StatCard label="Achievements" value={stats.achievementCount} hint="Milestones shared" />
        </div>

        <TeamQuickActions teamId={teamId} />

        <div className="grid gap-6 lg:grid-cols-2">
          <section className={cn(ADMIN_CARD, ADMIN_CARD_PAD)}>
            <h2 className="text-base font-bold text-zinc-900">Upcoming events</h2>
            {stats.upcomingEvents.length === 0 ? (
              <div className="mt-4">
                <PremiumEmptyState
                  emoji="📅"
                  title="No events yet"
                  description="Add your first event to keep parents and athletes informed."
                  action={
                    <Link
                      href={`/admin/team/${teamId}/calendar`}
                      className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Add event
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {stats.upcomingEvents.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex items-start justify-between gap-3 rounded-2xl bg-zinc-50/80 px-4 py-3 ring-1 ring-zinc-100"
                  >
                    <div>
                      <p className="font-semibold text-zinc-900">{ev.title}</p>
                      <p className="mt-0.5 text-[12px] text-zinc-500">{formatEventDate(ev.starts_at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={cn(ADMIN_CARD, ADMIN_CARD_PAD)}>
            <h2 className="text-base font-bold text-zinc-900">Recent activity</h2>
            {stats.recentUpdates.length === 0 ? (
              <div className="mt-4">
                <PremiumEmptyState
                  emoji="📣"
                  title="No updates yet"
                  description="Share news, reminders and wins — families check your page for the latest."
                  action={
                    <Link
                      href={`/admin/team/${teamId}/build?focus=sections`}
                      className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Add announcement
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {stats.recentUpdates.map((u) => (
                  <li key={u.id} className="rounded-2xl bg-zinc-50/80 px-4 py-3 ring-1 ring-zinc-100">
                    <p className="font-semibold text-zinc-900">{u.title}</p>
                    <p className="mt-0.5 text-[12px] text-zinc-500">{formatEventDate(u.published_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <TeamAssistantPanel team={team} teamId={teamId} />
      </div>
    </TeamAdminShell>
  );
}
