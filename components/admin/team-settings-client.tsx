"use client";

import Link from "next/link";
import { TeamAdminShell } from "@/components/admin/team-admin-shell";
import { ADMIN_CARD, ADMIN_CARD_PAD, ADMIN_SECTION_GAP, ADMIN_SUBTITLE, ADMIN_TITLE } from "@/lib/admin/admin-layout";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function TeamSettingsClient({
  teamId,
  team,
  publicUrl,
}: {
  teamId: string;
  team: TeamSpace;
  publicUrl: string;
}) {
  const visibility = team.pageVisibility ?? "public";

  return (
    <TeamAdminShell teamId={teamId} team={team} activeNav="settings">
      <div className={ADMIN_SECTION_GAP}>
        <header>
          <h1 className={ADMIN_TITLE}>Settings</h1>
          <p className={ADMIN_SUBTITLE}>Privacy, access and how families reach your team page.</p>
        </header>

        <section className={cn(ADMIN_CARD, ADMIN_CARD_PAD, "space-y-6")}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Public link</p>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block truncate font-mono text-sm text-violet-700 underline-offset-2 hover:underline"
            >
              {publicUrl}
            </a>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Visibility</p>
            <p className="mt-2 text-sm font-medium capitalize text-zinc-800">{visibility}</p>
          </div>
          <Link
            href={`/admin/team/${teamId}/build?focus=settings`}
            className="inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open privacy & access
          </Link>
        </section>
      </div>
    </TeamAdminShell>
  );
}
