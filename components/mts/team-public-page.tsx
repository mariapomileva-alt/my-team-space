"use client";

import { TeamShell } from "@/components/mts/team-shell";
import { TeamPageBlocks } from "@/components/mts/team-page-blocks";
import { TeamAccessGate } from "@/components/mts/team-access-gate";
import { teamRequiresAccess } from "@/lib/team-access";
import type { TeamSpace } from "@/lib/types";
import { usesCloudTeamStorage } from "@/lib/teams/cloud-storage";
import { mergeStoredPreview, purgeStaleTeamPreview } from "@/lib/preview-storage";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { useEffect, useState } from "react";

function TeamPublicBody({
  team,
  saasExtras,
  hasAccess,
}: {
  team: TeamSpace;
  saasExtras?: ReactNode;
  hasAccess: boolean;
}) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/85 py-2.5 backdrop-blur-xl">
        <div className="team-page-rail flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img src="/brand/logo-mark.svg" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
            <span className="font-[family-name:var(--font-brand)] text-[13px] font-bold text-neutral-800">
              MyTeamSpace
            </span>
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-semibold text-neutral-700 ring-1 ring-neutral-200/80 transition active:scale-[0.98]"
          >
            Coach login
          </Link>
        </div>
      </header>
      {team.pageVisibility === "mixed" && !hasAccess ? (
        <p className="team-page-rail py-2 text-center text-[12px] font-medium text-indigo-800">
          Some sections are members-only — enter your team code below to unlock everything.
        </p>
      ) : null}
      <TeamPageBlocks team={team} hasAccess={hasAccess} saasExtras={saasExtras} />
    </>
  );
}

function TeamPublicWithAccess({
  team,
  saasExtras,
}: {
  team: TeamSpace;
  saasExtras?: ReactNode;
}) {
  const visibility = team.pageVisibility ?? "public";

  if (visibility === "public") {
    return <TeamPublicBody team={team} saasExtras={saasExtras} hasAccess />;
  }

  if (visibility === "mixed") {
    return (
      <Suspense fallback={<TeamPublicBody team={team} saasExtras={saasExtras} hasAccess={false} />}>
        <TeamAccessGate team={team} mode="mixed">
          {(hasAccess) => <TeamPublicBody team={team} saasExtras={saasExtras} hasAccess={hasAccess} />}
        </TeamAccessGate>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <TeamAccessGate team={team} mode="private">
        {(hasAccess) =>
          hasAccess ? <TeamPublicBody team={team} saasExtras={saasExtras} hasAccess /> : null
        }
      </TeamAccessGate>
    </Suspense>
  );
}

export function TeamPublicPage({
  initialTeam,
  enableLocalPreview = true,
  saasExtras,
}: {
  initialTeam: TeamSpace;
  enableLocalPreview?: boolean;
  saasExtras?: ReactNode;
}) {
  const cloud = usesCloudTeamStorage();
  const allowLocalDraft = enableLocalPreview && !cloud;
  const [team, setTeam] = useState(initialTeam);

  useEffect(() => {
    purgeStaleTeamPreview(initialTeam.slug, initialTeam.updatedAt);
    if (!allowLocalDraft) {
      setTeam(initialTeam);
      return;
    }
    setTeam(mergeStoredPreview(initialTeam));
  }, [initialTeam, allowLocalDraft]);

  useEffect(() => {
    if (!allowLocalDraft) return;
    function refresh() {
      setTeam(mergeStoredPreview(initialTeam));
    }
    window.addEventListener("mts-team-preview", refresh);
    return () => window.removeEventListener("mts-team-preview", refresh);
  }, [initialTeam, allowLocalDraft]);

  return (
    <TeamShell themeId={team.themeId} team={team}>
      <TeamPublicWithAccess team={team} saasExtras={saasExtras} />
    </TeamShell>
  );
}
