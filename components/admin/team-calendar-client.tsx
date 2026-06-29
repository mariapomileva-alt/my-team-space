"use client";

import Link from "next/link";
import { PremiumEmptyState } from "@/components/admin/premium-empty-state";
import { TeamAdminShell } from "@/components/admin/team-admin-shell";
import { ADMIN_CARD, ADMIN_CARD_PAD, ADMIN_SECTION_GAP, ADMIN_SUBTITLE, ADMIN_TITLE } from "@/lib/admin/admin-layout";
import type { TeamAdminStats } from "@/lib/admin/load-team-admin-context";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function TeamCalendarClient({
  teamId,
  team,
  events,
  showAcademyHub = false,
}: {
  teamId: string;
  team: TeamSpace;
  events: TeamAdminStats["upcomingEvents"];
  showAcademyHub?: boolean;
}) {
  return (
    <TeamAdminShell teamId={teamId} team={team} activeNav="calendar" showAcademyHub={showAcademyHub}>
      <div className={ADMIN_SECTION_GAP}>
        <header>
          <h1 className={ADMIN_TITLE}>Schedule</h1>
          <p className={ADMIN_SUBTITLE}>
            Same schedule as your team page — edit events in the page builder calendar block.
          </p>
        </header>

        {events.length === 0 ? (
          <PremiumEmptyState
            emoji="📅"
            title="No events yet"
            description="Add your first event to keep parents and athletes informed about what's coming up."
            action={
              <Link
                href={`/admin/team/${teamId}/build?focus=sections`}
                className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Set up calendar block
              </Link>
            }
          />
        ) : (
          <section className={cn(ADMIN_CARD, ADMIN_CARD_PAD)}>
            <ul className="space-y-3">
              {events.map((ev) => (
                <li key={ev.id} className="rounded-2xl bg-zinc-50/80 px-4 py-4 ring-1 ring-zinc-100">
                  <p className="font-semibold text-zinc-900">{ev.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">{formatDate(ev.starts_at)}</p>
                  {ev.location ? <p className="mt-0.5 text-xs text-zinc-400">{ev.location}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link
          href={`/admin/team/${teamId}/build?focus=sections`}
          className="inline-flex rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700"
        >
          Edit calendar on team page
        </Link>
      </div>
    </TeamAdminShell>
  );
}
