"use client";

import Link from "next/link";
import { PremiumEmptyState } from "@/components/admin/premium-empty-state";
import { TeamAdminShell } from "@/components/admin/team-admin-shell";
import { TeamAssistantPanel } from "@/components/admin/team-assistant-panel";
import { ADMIN_CARD, ADMIN_CARD_PAD, ADMIN_SECTION_GAP, ADMIN_SUBTITLE, ADMIN_TITLE } from "@/lib/admin/admin-layout";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function TeamMembersClient({
  teamId,
  team,
  memberCount,
}: {
  teamId: string;
  team: TeamSpace;
  memberCount: number;
}) {
  return (
    <TeamAdminShell teamId={teamId} team={team} activeNav="members">
      <div className={ADMIN_SECTION_GAP}>
        <header>
          <h1 className={ADMIN_TITLE}>Members</h1>
          <p className={ADMIN_SUBTITLE}>Coaches, assistants and everyone who helps run this team page.</p>
        </header>

        <section className={cn(ADMIN_CARD, ADMIN_CARD_PAD)}>
          <p className="text-4xl font-bold text-zinc-900">{memberCount}</p>
          <p className="mt-1 text-sm text-zinc-500">people with access</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/admin/team/${teamId}/settings`}
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Invite assistant
            </Link>
          </div>
        </section>

        <PremiumEmptyState
          emoji="👥"
          title="Grow your coaching team"
          description="Invite an assistant to help edit the page while you focus on the athletes."
          action={
            <Link href={`/admin/team/${teamId}/settings`} className="text-sm font-semibold text-violet-700 underline">
              Open page admins in settings
            </Link>
          }
        />

        <TeamAssistantPanel team={team} teamId={teamId} />
      </div>
    </TeamAdminShell>
  );
}
