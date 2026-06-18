"use client";

import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import { BUILDER_PANEL_SURFACE, builderChoiceClass } from "@/lib/builder/layout";
import { STYLE_PRESETS, stylePresetForTheme, type StylePresetId } from "@/lib/style-presets";
import { THEMES } from "@/lib/themes";
import type { TeamSpace, ThemeId } from "@/lib/types";
import { useState } from "react";

export function TeamDesignPanel({
  team,
  onSelectTheme,
  expanded,
  onExpandedChange,
}: {
  team: TeamSpace;
  onSelectTheme: (id: ThemeId) => void;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const activePreset = stylePresetForTheme(team.themeId);
  const [showCustomPalettes, setShowCustomPalettes] = useState(activePreset === "custom");
  const activeTheme = THEMES.find((t) => t.id === team.themeId) ?? THEMES[0];

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

  return (
    <BuilderCollapsiblePanel
      className={BUILDER_PANEL_SURFACE}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      title="Design"
      description="Colors and theme."
      summary={
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700 ring-1 ring-zinc-200/80">
          <span
            className="h-3 w-3 shrink-0 rounded-full border border-black/5"
            style={{
              background: (activeTheme.cssVars as Record<string, string>)["--mts-primary"],
            }}
          />
          {activeTheme.label}
        </span>
      }
      defaultExpanded={expanded === undefined ? false : undefined}
    >
      <p className="text-[13px] text-zinc-500">Pick a mood — colors, spacing and cards update together.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
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
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
    </BuilderCollapsiblePanel>
  );
}
