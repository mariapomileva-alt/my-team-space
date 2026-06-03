"use client";

import {
  completedCelebrationLabel,
  getCompletionGuidance,
  requiredPublishAction,
  type BuilderProgressTarget,
} from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

export type { BuilderProgressTarget } from "@/lib/builder/page-completion";
export { builderCompletionPercent } from "@/lib/builder/page-completion";

const RECOMMENDATIONS_LABEL = {
  show: "Show recommendations",
  hide: "Hide recommendations",
} as const;

export function BuilderProgress({
  team,
  onJump,
  className,
}: {
  team: TeamSpace;
  onJump: (target: BuilderProgressTarget) => void;
  className?: string;
}) {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const {
    statusTitle,
    helperText,
    nextStep,
    tone,
    doneCount,
    totalCount,
    remainingCount,
    completed,
    requiredMissing,
    publishRemainingMessage,
    suggestions,
    isFullyReady,
  } = getCompletionGuidance(team);

  const showRecommendationsToggle = !isFullyReady;
  const incompleteTips = suggestions.filter((i) => !i.done);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border px-3 py-2.5 ring-1 ring-inset",
        tone === "ready"
          ? "border-emerald-200/70 bg-emerald-50/40 ring-emerald-100/60"
          : "border-violet-200/60 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/30 ring-violet-100/50",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600/80">
          <span aria-hidden className="mr-0.5">
            ✨
          </span>
          Team page progress
        </p>
        <div className="flex flex-wrap items-baseline gap-x-2 text-[11px] font-medium text-zinc-500">
          <span className="tabular-nums text-zinc-600">
            {doneCount} of {totalCount} completed
          </span>
          {!isFullyReady ? (
            <>
              <span className="text-zinc-300" aria-hidden>
                ·
              </span>
              <span>
                {remainingCount} {remainingCount === 1 ? "item" : "items"} remaining
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-1.5 flex items-start gap-2">
        <p className="min-w-0 text-[12px] font-semibold leading-snug text-zinc-900">{statusTitle}</p>
        <span className="text-zinc-300" aria-hidden>
          ·
        </span>
        <p className="min-w-0 text-[12px] leading-snug text-zinc-600">{helperText}</p>
      </div>

      {completed.length > 0 ? (
        <ul className="mt-2 space-y-0.5" aria-label="Completed items">
          {completed.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => onJump(item.id)}
                className="inline-flex items-center gap-1.5 text-left text-[11px] font-medium text-emerald-800/90 transition hover:text-emerald-900"
                title="Tap to review"
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

      {publishRemainingMessage ? (
        <div className="mt-2 rounded-xl bg-white/70 px-2.5 py-2 ring-1 ring-violet-100/80">
          <p className="text-[11px] font-semibold leading-snug text-zinc-800">
            {publishRemainingMessage.split("\n")[0]}
          </p>
          {requiredMissing[0] ? (
            <button
              type="button"
              onClick={() => onJump(requiredMissing[0]!.id)}
              className="mt-0.5 text-[11px] font-semibold text-indigo-700 transition hover:text-indigo-800 hover:underline"
            >
              {requiredPublishAction(requiredMissing[0]!)}
            </button>
          ) : null}
        </div>
      ) : null}

      {!isFullyReady && nextStep && !publishRemainingMessage ? (
        <p className="mt-2 text-[11px] leading-snug text-zinc-600">
          <span className="font-medium text-zinc-500">Tip:</span> {nextStep}
        </p>
      ) : null}

      {isFullyReady ? (
        <p className="mt-2 text-[11px] font-medium text-emerald-800">
          Your team page is ready — publish when you&apos;re happy with it.
        </p>
      ) : null}

      {showRecommendationsToggle && incompleteTips.length > 0 ? (
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-violet-100/80 pt-2">
          <button
            type="button"
            onClick={() => setShowRecommendations((v) => !v)}
            className="text-[10px] font-semibold text-indigo-600/90 underline-offset-2 transition hover:text-indigo-700 hover:underline"
          >
            {showRecommendations ? RECOMMENDATIONS_LABEL.hide : RECOMMENDATIONS_LABEL.show}
          </button>
        </div>
      ) : null}

      {showRecommendations && incompleteTips.length > 0 ? (
        <ul className="mt-1.5 space-y-0.5" aria-label="Improvement tips">
          {incompleteTips.map((it) => (
            <li key={it.label}>
              <button
                type="button"
                onClick={() => onJump(it.id)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-700 transition hover:text-indigo-800"
              >
                <span className="text-violet-400" aria-hidden>
                  →
                </span>
                Add {it.label.toLowerCase()}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
