"use client";

import { TeamShell } from "@/components/mts/team-shell";
import { TeamPageBlocks } from "@/components/mts/team-page-blocks";
import type { TeamSpace } from "@/lib/types";
import { mergeStoredPreview, previewStorageKey } from "@/lib/preview-storage";
import Link from "next/link";
import { useEffect, useState } from "react";

export function TeamPublicPage({ initialTeam }: { initialTeam: TeamSpace }) {
  const [team, setTeam] = useState(initialTeam);

  useEffect(() => {
    setTeam(mergeStoredPreview(initialTeam));
  }, [initialTeam]);

  useEffect(() => {
    const key = previewStorageKey(initialTeam.slug);
    function onStorage(e: StorageEvent) {
      if (e.key === key || e.key === null) {
        setTeam(mergeStoredPreview(initialTeam));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [initialTeam]);

  useEffect(() => {
    function refresh() {
      setTeam(mergeStoredPreview(initialTeam));
    }
    window.addEventListener("mts-team-preview", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("mts-team-preview", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [initialTeam]);

  return (
    <TeamShell themeId={team.themeId}>
      <header className="border-b border-[color:var(--mts-card-border)] bg-white/40 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-wider text-[color:var(--mts-muted)]"
          >
            О сервисе
          </Link>
          <Link
            href={`/admin/${team.slug}`}
            className="rounded-full border border-[color:var(--mts-card-border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--mts-text)]"
          >
            Редактор страницы
          </Link>
        </div>
      </header>
      <TeamPageBlocks team={team} />
    </TeamShell>
  );
}
