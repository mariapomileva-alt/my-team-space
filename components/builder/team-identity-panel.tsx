"use client";

import { HeroIdentityEditor } from "@/components/builder/editors/hero-identity-editor";
import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import { BUILDER_PANEL_SURFACE } from "@/lib/builder/layout";
import { THEMES } from "@/lib/themes";
import type { BlockInstance, TeamSpace } from "@/lib/types";

export function TeamIdentityPanel({
  team,
  heroBlock,
  onPatchTeam,
  onPatchBlock,
}: {
  team: TeamSpace;
  heroBlock: BlockInstance | undefined;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const activeTheme = THEMES.find((t) => t.id === team.themeId) ?? THEMES[0];

  return (
    <BuilderCollapsiblePanel
      className={BUILDER_PANEL_SURFACE}
      title="Header"
      description="Logo, cover image and team name."
      summary={
        <span className="inline-flex max-w-[220px] items-center gap-2 truncate rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700 ring-1 ring-zinc-200/80">
          <span
            className="h-3 w-3 shrink-0 rounded-full border border-black/5"
            style={{
              background: (activeTheme.cssVars as Record<string, string>)["--mts-primary"],
            }}
          />
          {team.name || "Untitled team"}
        </span>
      }
      defaultExpanded
    >
      {heroBlock ? (
        <HeroIdentityEditor
          block={heroBlock}
          team={team}
          onPatchBlock={onPatchBlock}
          onPatchTeam={onPatchTeam}
        />
      ) : (
        <p className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">
          Hero block missing — refresh the page or contact support.
        </p>
      )}
    </BuilderCollapsiblePanel>
  );
}
