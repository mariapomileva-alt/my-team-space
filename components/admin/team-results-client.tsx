"use client";

import Link from "next/link";
import { PremiumEmptyState } from "@/components/admin/premium-empty-state";
import { TeamAdminShell } from "@/components/admin/team-admin-shell";
import { ADMIN_SECTION_GAP, ADMIN_SUBTITLE, ADMIN_TITLE } from "@/lib/admin/admin-layout";
import type { TeamSpace } from "@/lib/types";

export function TeamResultsClient({
  teamId,
  team,
  achievementCount,
}: {
  teamId: string;
  team: TeamSpace;
  achievementCount: number;
}) {
  const resultsBlock = team.blocks.find((b) => b.type === "results");
  const hasResults = resultsBlock?.enabled;

  return (
    <TeamAdminShell teamId={teamId} team={team} activeNav="results">
      <div className={ADMIN_SECTION_GAP}>
        <header>
          <h1 className={ADMIN_TITLE}>Results</h1>
          <p className={ADMIN_SUBTITLE}>
            Display competition results and rankings — show pride in every podium and personal best.
          </p>
        </header>

        {!hasResults ? (
          <PremiumEmptyState
            emoji="🏆"
            title="No results yet"
            description="Add competition results so parents and athletes can celebrate progress together."
            action={
              <Link
                href={`/admin/team/${teamId}/build?focus=sections`}
                className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Add results block
              </Link>
            }
          />
        ) : (
          <PremiumEmptyState
            emoji="🥇"
            title={`${achievementCount} achievements on record`}
            description="Edit results and achievements on your team page to keep the story current."
            action={
              <Link
                href={`/admin/team/${teamId}/build?focus=sections`}
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Edit results
              </Link>
            }
          />
        )}
      </div>
    </TeamAdminShell>
  );
}
