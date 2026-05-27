"use client";

import {
  BUILDER_PANEL_DESC,
  BUILDER_PANEL_SURFACE,
  BUILDER_PANEL_TITLE,
  builderChoiceClass,
} from "@/lib/builder/layout";
import { THEMES } from "@/lib/themes";
import type { ThemeId } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function TeamColorsPanel({
  themeId,
  onSelectTheme,
}: {
  themeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const active = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  return (
    <motion.section className={BUILDER_PANEL_SURFACE}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start justify-between gap-3 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={BUILDER_PANEL_TITLE}>Team colors</h2>
            {!expanded ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/5"
                  style={{ background: (active.cssVars as Record<string, string>)["--mts-primary"] }}
                />
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/5"
                  style={{ background: (active.cssVars as Record<string, string>)["--mts-accent"] }}
                />
                {active.label}
              </span>
            ) : null}
          </div>
          <p className={BUILDER_PANEL_DESC}>Pick a palette — your app updates instantly.</p>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="mt-0.5 shrink-0 text-sm text-zinc-400"
          aria-hidden
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTheme(t.id)}
                  className={builderChoiceClass(themeId === t.id, "text-xs")}
                >
                  <div className="flex gap-1.5">
                    <span
                      className="h-7 w-7 rounded-full border border-black/5 shadow-sm"
                      style={{ background: (t.cssVars as Record<string, string>)["--mts-primary"] }}
                    />
                    <span
                      className="h-7 w-7 rounded-full border border-black/5 shadow-sm"
                      style={{ background: (t.cssVars as Record<string, string>)["--mts-accent"] }}
                    />
                  </div>
                  <span className="mt-2.5 block font-bold text-zinc-800">{t.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
