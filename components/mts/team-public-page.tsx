"use client";

import { TeamShell } from "@/components/mts/team-shell";
import { TeamPageBlocks } from "@/components/mts/team-page-blocks";
import type { TeamSpace } from "@/lib/types";
import { mergeStoredPreview, previewStorageKey } from "@/lib/preview-storage";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function TeamPublicPage({
  initialTeam,
  enableLocalPreview = true,
  saasExtras,
}: {
  initialTeam: TeamSpace;
  /** When false (live DB page), skip localStorage merge for coach drafts. */
  enableLocalPreview?: boolean;
  /** Optional DB-driven sections (schedule, updates, achievements). */
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
      <header className="border-b border-[color:var(--mts-card-border)] bg-white/40 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-wider text-[color:var(--mts-muted)]"
          >
            MyTeamSpace
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-[color:var(--mts-card-border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--mts-text)]"
          >
            Coach login
          </Link>
        </div>
      </header>
      <TeamPageBlocks team={team} />
      {saasExtras}
    </TeamShell>
  );
}
