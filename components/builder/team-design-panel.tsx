"use client";

import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import { BUILDER_PANEL_SURFACE, builderChoiceClass } from "@/lib/builder/layout";
import { TEAM_COLOR_PALETTES, paletteForTheme, resolvePaletteThemeId } from "@/lib/team-color-palettes";
import {
  personalityTeamPatch,
  resolveDesignStyle,
  TEAM_PERSONALITIES,
  teamPageStyleSpec,
  type TeamPageDesignStyle,
} from "@/lib/team-page-styles";
import type { TeamSpace, ThemeId } from "@/lib/types";

export function TeamDesignPanel({
  team,
  onSelectTheme,
  onPatchTeam,
  expanded,
  onExpandedChange,
}: {
  team: TeamSpace;
  onSelectTheme: (id: ThemeId) => void;
  onPatchTeam?: (patch: Partial<TeamSpace>) => void;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const personality = resolveDesignStyle(team.pageSettings, team.themeId);
  const personalitySpec = teamPageStyleSpec(personality);
  const paletteId = resolvePaletteThemeId(team.themeId);
  const palette = paletteForTheme(team.themeId);

  function setPersonality(value: TeamPageDesignStyle) {
    onPatchTeam?.(personalityTeamPatch(value, team.pageSettings));
  }

  return (
    <BuilderCollapsiblePanel
      className={BUILDER_PANEL_SURFACE}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      title="Design"
      description="Personality and color — two layers, one beautiful page."
      summary={
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700 ring-1 ring-zinc-200/80">
          <span className="text-sm leading-none" aria-hidden>
            {personalitySpec.emoji}
          </span>
          {personalitySpec.label}
          <span className="text-zinc-300" aria-hidden>
            ·
          </span>
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/5"
            style={{ background: team.primaryColor || "var(--mts-primary)" }}
          />
          {palette.label}
        </span>
      }
      defaultExpanded={expanded === undefined ? false : undefined}
    >
      {onPatchTeam ? (
        <div className="mb-6">
          <p className="text-xs font-bold text-zinc-800">Team personality</p>
          <p className="mt-1 text-[11px] leading-snug text-zinc-500">
            Shapes cards, icons, typography, and rhythm. Your palette recolors this — it never changes the
            feel.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {TEAM_PERSONALITIES.map((style) => {
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
        </div>
      ) : (
        <p className="text-[13px] text-zinc-500">
          Personality: <span className="font-semibold text-zinc-800">{personalitySpec.label}</span>
        </p>
      )}

      <div className={onPatchTeam ? "border-t border-zinc-100 pt-5" : ""}>
        <p className="text-xs font-bold text-zinc-800">Color palette</p>
        <p className="mt-1 text-[11px] leading-snug text-zinc-500">
          Recolors your page while keeping the personality intact — Premium stays elegant, Performance stays
          bold.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TEAM_COLOR_PALETTES.map((item) => {
            const selected = paletteId === item.themeId;
            return (
              <button
                key={item.themeId}
                type="button"
                onClick={() => onSelectTheme(item.themeId)}
                className={builderChoiceClass(selected, "flex flex-col items-start gap-1 p-3 text-left")}
              >
                <span className="text-lg" aria-hidden>
                  {item.emoji}
                </span>
                <span className="text-xs font-bold text-zinc-900">{item.label}</span>
                <span className="line-clamp-2 text-[10px] leading-snug text-zinc-500">{item.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </BuilderCollapsiblePanel>
  );
}
