"use client";

import { HeroIdentityEditor } from "@/components/builder/editors/hero-identity-editor";
import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import { BUILDER_PANEL_SURFACE_COMPACT } from "@/lib/builder/layout";
import { THEMES } from "@/lib/themes";
import type { BlockInstance, TeamSpace } from "@/lib/types";

export function TeamIdentityPanel({
  team,
  heroBlock,
  onPatchTeam,
  onPatchLogo,
  onPatchBlock,
  expanded,
  onExpandedChange,
  focusAboutKey,
}: {
  team: TeamSpace;
  heroBlock: BlockInstance | undefined;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
  onPatchLogo?: (url: string) => void;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  focusAboutKey?: number;
}) {
  const activeTheme = THEMES.find((t) => t.id === team.themeId) ?? THEMES[0];

  return (
    <BuilderCollapsiblePanel
      className={BUILDER_PANEL_SURFACE_COMPACT}
      density="compact"
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      title="Header"
      description="Logo · Cover image · Team name"
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
      defaultExpanded={expanded === undefined}
    >
      {heroBlock ? (
        <HeroIdentityEditor
          block={heroBlock}
          team={team}
          onPatchBlock={onPatchBlock}
          onPatchTeam={onPatchTeam}
          onPatchLogo={onPatchLogo}
          focusAboutKey={focusAboutKey}
        />
      ) : (
        <p className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">
          Hero block missing — refresh the page or contact support.
        </p>
      )}
    </BuilderCollapsiblePanel>
  );
}
