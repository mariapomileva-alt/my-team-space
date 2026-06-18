"use client";

import { HeroIdentityEditor } from "@/components/builder/editors/hero-identity-editor";
import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import {
  BUILDER_PANEL_SURFACE,
  builderChoiceClass,
} from "@/lib/builder/layout";
import {
  STYLE_PRESETS,
  stylePresetForTheme,
  type StylePresetId,
} from "@/lib/style-presets";
import { THEMES } from "@/lib/themes";
import type { BlockInstance, TeamSpace, ThemeId } from "@/lib/types";
import { useState } from "react";

export function TeamIdentityPanel({
  team,
  heroBlock,
  onPatchTeam,
  onPatchBlock,
  onSelectTheme,
}: {
  team: TeamSpace;
  heroBlock: BlockInstance | undefined;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onSelectTheme: (id: ThemeId) => void;
}) {
  const activePreset = stylePresetForTheme(team.themeId);
  const [showCustomPalettes, setShowCustomPalettes] = useState(
    activePreset === "custom",
  );

  function pickPreset(id: StylePresetId) {
    const preset = STYLE_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    if (id === "custom") {
      setShowCustomPalettes(true);
      return;
    }
    setShowCustomPalettes(false);
    if (preset.themeId) onSelectTheme(preset.themeId);
  }

  const activeTheme = THEMES.find((t) => t.id === team.themeId) ?? THEMES[0];

  return (
    <BuilderCollapsiblePanel
      className={BUILDER_PANEL_SURFACE}
      title="Header"
      description="Logo, name and cover — how families recognize your team."
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

      <details id="builder-design" className="mt-5 scroll-mt-28 border-t border-zinc-100/90 pt-4">
        <summary className="cursor-pointer list-none text-xs font-bold uppercase tracking-wide text-zinc-500 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            Team style
            <span className="text-[10px] font-semibold normal-case tracking-normal text-zinc-400">Optional</span>
          </span>
        </summary>
        <p className="mt-2 text-[13px] text-zinc-500">Pick a mood — colors, spacing & cards update together.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {STYLE_PRESETS.map((preset) => {
            const selected =
              preset.id === "custom" ? showCustomPalettes || activePreset === "custom" : activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => pickPreset(preset.id)}
                className={builderChoiceClass(selected, "flex flex-col items-start gap-1 p-3 text-left")}
              >
                <span className="text-xl" aria-hidden>
                  {preset.emoji}
                </span>
                <span className="text-xs font-bold text-zinc-900">{preset.label}</span>
                <span className="line-clamp-2 text-[10px] leading-snug text-zinc-500">{preset.description}</span>
              </button>
            );
          })}
        </div>

        {showCustomPalettes || activePreset === "custom" ? (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTheme(t.id)}
                className={builderChoiceClass(team.themeId === t.id, "text-xs")}
              >
                <div className="flex gap-1.5">
                  <span
                    className="h-6 w-6 rounded-full border border-black/5 shadow-sm"
                    style={{ background: (t.cssVars as Record<string, string>)["--mts-primary"] }}
                  />
                  <span
                    className="h-6 w-6 rounded-full border border-black/5 shadow-sm"
                    style={{ background: (t.cssVars as Record<string, string>)["--mts-accent"] }}
                  />
                </div>
                <span className="mt-2 block font-bold text-zinc-800">{t.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </details>
    </BuilderCollapsiblePanel>
  );
}
