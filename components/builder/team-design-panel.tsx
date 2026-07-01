"use client";

import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import { BUILDER_PANEL_SURFACE, builderChoiceClass } from "@/lib/builder/layout";
import {
  personalityTeamPatch,
  resolveDesignStyle,
  TEAM_PAGE_STYLES,
  teamPageStyleSpec,
  type TeamPageDesignStyle,
} from "@/lib/team-page-styles";
import type { TeamSpace } from "@/lib/types";

export function TeamDesignPanel({
  team,
  onPatchTeam,
  expanded,
  onExpandedChange,
}: {
  team: TeamSpace;
  onPatchTeam?: (patch: Partial<TeamSpace>) => void;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const personality = resolveDesignStyle(team.pageSettings, team.themeId);
  const activeSpec = teamPageStyleSpec(personality);

  function setPersonality(value: TeamPageDesignStyle) {
    onPatchTeam?.(personalityTeamPatch(value, team.pageSettings));
  }

  return (
    <BuilderCollapsiblePanel
      className={BUILDER_PANEL_SURFACE}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      title="Design"
      description="Choose how your team page feels."
      summary={
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700 ring-1 ring-zinc-200/80">
          <span className="text-sm leading-none" aria-hidden>
            {activeSpec.emoji}
          </span>
          {activeSpec.label}
        </span>
      }
      defaultExpanded={expanded === undefined ? false : undefined}
    >
      {onPatchTeam ? (
        <>
          <p className="text-xs font-bold text-zinc-800">Choose your team personality</p>
          <p className="mt-1 text-[11px] leading-snug text-zinc-500">
            One choice — we apply colors, cards, icons, and buttons automatically. No design work needed.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {TEAM_PAGE_STYLES.map((style) => {
              const selected = personality === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setPersonality(style.id)}
                  className={builderChoiceClass(selected, "flex flex-col items-start gap-1 p-3 text-left")}
                >
                  <span className="text-xl" aria-hidden>
                    {style.emoji}
                  </span>
                  <span className="text-xs font-bold text-zinc-900">{style.label}</span>
                  <span className="text-[10px] font-semibold text-indigo-700/90">{style.tagline}</span>
                  <span className="line-clamp-2 text-[10px] leading-snug text-zinc-500">{style.description}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-[13px] text-zinc-500">
          Personality: <span className="font-semibold text-zinc-800">{activeSpec.label}</span>
        </p>
      )}
    </BuilderCollapsiblePanel>
  );
}
