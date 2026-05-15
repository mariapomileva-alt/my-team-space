"use client";

import { TeamShell } from "@/components/mts/team-shell";
import { TeamPageBlocks } from "@/components/mts/team-page-blocks";
import type { TeamSpace } from "@/lib/types";

/** Phone-frame live preview for desktop builder */
export function BuilderLivePreview({ team }: { team: TeamSpace }) {
  return (
    <div className="hidden lg:block">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Live preview</p>
      <div className="sticky top-28 mx-auto w-[320px] overflow-hidden rounded-[2rem] border-[6px] border-zinc-900 bg-zinc-900 shadow-2xl">
        <div className="h-6 bg-zinc-900" />
        <div className="max-h-[min(70vh,640px)] overflow-y-auto bg-[var(--mts-bg,#f8fafc)]">
          <TeamShell themeId={team.themeId}>
            <TeamPageBlocks team={team} hasAccess />
          </TeamShell>
        </div>
        <div className="h-5 bg-zinc-900" />
      </div>
    </div>
  );
}
