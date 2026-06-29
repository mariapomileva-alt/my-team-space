"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PremiumEmptyState } from "@/components/admin/premium-empty-state";
import { TeamAdminShell } from "@/components/admin/team-admin-shell";
import { WhatsAppShareButton } from "@/components/shared/whatsapp-share-button";
import { ADMIN_SECTION_GAP, ADMIN_SUBTITLE, ADMIN_TITLE } from "@/lib/admin/admin-layout";
import { getResultsBoardSettings, resultsBoardHasContent } from "@/lib/blocks/results-board";
import type { TeamSpace } from "@/lib/types";
import { buildResultsShareMessage } from "@/lib/whatsapp-summaries";

export function TeamResultsClient({
  teamId,
  team,
  publicUrl,
  achievementCount,
  showAcademyHub = false,
}: {
  teamId: string;
  team: TeamSpace;
  publicUrl: string;
  achievementCount: number;
  showAcademyHub?: boolean;
}) {
  const resultsBlock = team.blocks.find((b) => b.type === "results");
  const hasResults = resultsBlock?.enabled;
  const resultsSettings = resultsBlock ? getResultsBoardSettings(resultsBlock) : null;

  const shareMessage = useMemo(() => {
    if (!resultsSettings) return null;
    return buildResultsShareMessage({
      teamName: team.name,
      publicUrl,
      settings: resultsSettings,
    });
  }, [publicUrl, resultsSettings, team.name]);

  const canShare = Boolean(hasResults && resultsSettings && resultsBoardHasContent(resultsSettings));

  return (
    <TeamAdminShell teamId={teamId} team={team} activeNav="results" showAcademyHub={showAcademyHub}>
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
          <div className="space-y-4">
            <PremiumEmptyState
              emoji="🥇"
              title={`${achievementCount} achievements on record`}
              description="Edit results and achievements on your team page to keep the story current."
              action={
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href={`/admin/team/${teamId}/build?focus=sections`}
                    className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Edit results
                  </Link>
                  <WhatsAppShareButton
                    message={shareMessage}
                    label="Share results in WhatsApp"
                    disabledReason={
                      canShare ? undefined : "Add at least one competition result — then share with parents."
                    }
                  />
                </div>
              }
            />
          </div>
        )}
      </div>
    </TeamAdminShell>
  );
}
