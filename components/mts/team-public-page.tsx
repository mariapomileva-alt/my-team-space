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
      <header className="sticky top-0 z-30 bg-[color-mix(in_srgb,var(--mts-page-bg)_78%,transparent)] px-[1.125rem] py-2.5 backdrop-blur-xl md:px-7">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 md:max-w-3xl">
          <Link href="/" className="flex items-center gap-2 opacity-90 transition hover:opacity-100">
            <img src="/brand/logo-mark.svg" alt="" width={20} height={20} className="h-5 w-5" />
            <span className="font-[family-name:var(--font-brand)] text-[12px] font-bold text-[color:var(--mts-muted)]">
              MyTeamSpace
            </span>
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full bg-[color-mix(in_srgb,var(--mts-accent-soft)_70%,transparent)] px-3 py-1.5 text-[11px] font-semibold text-[color:var(--mts-text)] ring-1 ring-[color:var(--mts-card-border)] transition active:scale-[0.98]"
          >
            Coach login
          </Link>
        </div>
      </header>
      {team.pageVisibility === "mixed" && !hasAccess ? (
        <p className="mx-auto max-w-lg px-4 py-2.5 text-center text-[12px] font-medium leading-snug text-[color:var(--mts-primary)] md:max-w-3xl">
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
