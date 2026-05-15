"use client";

import { TeamShell } from "@/components/mts/team-shell";
import { TeamPageBlocks } from "@/components/mts/team-page-blocks";
import { TeamAccessGate } from "@/components/mts/team-access-gate";
import { teamRequiresAccess } from "@/lib/team-access";
import type { TeamSpace } from "@/lib/types";
import { mergeStoredPreview, previewStorageKey } from "@/lib/preview-storage";
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
      <header className="border-b border-[color:var(--mts-card-border)] bg-white/40 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img src="/brand/logo-mark.svg" alt="" width={24} height={24} className="h-6 w-6" />
            <span className="font-[family-name:var(--font-brand)] text-sm font-bold text-[color:var(--mts-text)]">
              MyTeamSpace
            </span>
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full border border-[color:var(--mts-card-border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--mts-text)]"
          >
            Coach login
          </Link>
        </div>
      </header>
      {team.pageVisibility === "mixed" && !hasAccess ? (
        <p className="mx-auto max-w-3xl px-4 py-2 text-center text-xs text-indigo-800">
          Some sections are members-only — enter your team code below to unlock everything.
        </p>
      ) : null}
      <TeamPageBlocks team={team} hasAccess={hasAccess} />
      {saasExtras}
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
  const [team, setTeam] = useState(initialTeam);

  useEffect(() => {
    if (!enableLocalPreview) {
      setTeam(initialTeam);
      return;
    }
    setTeam(mergeStoredPreview(initialTeam));
  }, [initialTeam, enableLocalPreview]);

  useEffect(() => {
    if (!enableLocalPreview) return;
    const key = previewStorageKey(initialTeam.slug);
    function onStorage(e: StorageEvent) {
      if (e.key === key || e.key === null) {
        setTeam(mergeStoredPreview(initialTeam));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [initialTeam, enableLocalPreview]);

  useEffect(() => {
    if (!enableLocalPreview) return;
    function refresh() {
      setTeam(mergeStoredPreview(initialTeam));
    }
    window.addEventListener("mts-team-preview", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("mts-team-preview", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [initialTeam, enableLocalPreview]);

  return (
    <TeamShell themeId={team.themeId}>
      <TeamPublicWithAccess team={team} saasExtras={saasExtras} />
    </TeamShell>
  );
}
