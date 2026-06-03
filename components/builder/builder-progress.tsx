"use client";

import {
  completedCelebrationLabel,
  getCompletionGuidance,
  type BuilderProgressTarget,
} from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

export type { BuilderProgressTarget } from "@/lib/builder/page-completion";
export { builderCompletionPercent } from "@/lib/builder/page-completion";

export function BuilderProgress({
  team,
  onJump,
  className,
}: {
  team: TeamSpace;
  onJump: (target: BuilderProgressTarget) => void;
  className?: string;
}) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const g = getCompletionGuidance(team);
  const incompleteTips = g.suggestions.filter((i) => !i.done);
  const showRecommendationsToggle = !g.isFullyReady && incompleteTips.length > 0;

  return (
    <div
      className={cn(
        "w-full rounded-2xl border px-3 py-2 ring-1 ring-inset",
        g.tone === "ready"
          ? "border-emerald-200/70 bg-emerald-50/35 ring-emerald-100/60"
          : "border-violet-200/50 bg-white/80 ring-violet-100/40",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600/75">
          <span aria-hidden className="mr-0.5">
            ✨
          </span>
          Team page progress
        </p>
        <p className="text-[11px] font-medium text-zinc-500">{g.summaryLine}</p>
      </div>

      <p className="mt-1 text-[11px] font-medium text-zinc-600">{g.emotionalHeadline}</p>

      <div className="mt-1.5 rounded-xl bg-violet-50/60 px-2.5 py-2 ring-1 ring-violet-100/60">
        <p className="text-[12px] font-bold leading-snug text-zinc-900">
          <span aria-hidden className="mr-1">
            🚀
          </span>
          {g.primaryHeadline}
        </p>
        <p className="mt-0.5 text-[12px] font-medium text-zinc-700">{g.primaryActionText}</p>
        {g.primaryCtaLabel ? (
          <button
            type="button"
            onClick={() => onJump(g.primaryTarget)}
            className="mt-2 inline-flex min-h-[32px] items-center justify-center rounded-full bg-indigo-600 px-4 text-[11px] font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            {g.primaryCtaLabel}
          </button>
        ) : null}
        {!g.isFullyReady && g.missingForPublish.length > 0 && g.missingForPublish.length <= 2 ? (
          <p className="mt-1.5 text-[10px] text-zinc-500">
            Missing:{" "}
            {g.missingForPublish.map((m) => (
              <span key={m.label} className="font-medium text-zinc-600">
                {m.label}
              </span>
            ))}
          </p>
        ) : null}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
        {g.completed.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowCompleted((v) => !v)}
            className="text-[10px] font-semibold text-zinc-500 underline-offset-2 transition hover:text-zinc-700 hover:underline"
          >
            {showCompleted ? "Hide completed items" : `Show completed items (${g.completed.length})`}
          </button>
        ) : null}
        {showRecommendationsToggle ? (
          <button
            type="button"
            onClick={() => setShowRecommendations((v) => !v)}
            className="text-[10px] font-semibold text-indigo-600/80 underline-offset-2 transition hover:text-indigo-700 hover:underline"
          >
            {showRecommendations ? "Hide recommendations" : "Show recommendations"}
          </button>
        ) : null}
      </div>

      {showCompleted && g.completed.length > 0 ? (
        <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5" aria-label="Completed items">
          {g.completed.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => onJump(item.id)}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800/90 hover:text-emerald-900"
              >
                <span className="text-emerald-600" aria-hidden>
                  ✓
                </span>
                {completedCelebrationLabel(item)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {showRecommendations && incompleteTips.length > 0 ? (
        <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5" aria-label="Recommendations">
          {incompleteTips.map((it) => (
            <li key={it.label}>
              <button
                type="button"
                onClick={() => onJump(it.id)}
                className="text-[10px] font-medium text-zinc-600 hover:text-indigo-700"
              >
                + {it.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
