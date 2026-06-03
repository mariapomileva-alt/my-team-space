"use client";

import {
  getCompletionGuidance,
  requiredMissingLabel,
  type BuilderProgressTarget,
} from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

export type { BuilderProgressTarget } from "@/lib/builder/page-completion";
export { builderCompletionPercent } from "@/lib/builder/page-completion";

function StatusIcon({ tone }: { tone: "ready" | "almost" | "needs-work" }) {
  if (tone === "ready") {
    return (
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[9px] leading-none text-emerald-700"
        aria-hidden
      >
        ✓
      </span>
    );
  }
  return (
    <span
      className={cn(
        "h-2 w-2 shrink-0 rounded-full",
        tone === "almost" ? "bg-amber-400" : "bg-amber-500",
      )}
      aria-hidden
    />
  );
}

export function BuilderProgress({
  team,
  onJump,
  className,
}: {
  team: TeamSpace;
  onJump: (target: BuilderProgressTarget) => void;
  className?: string;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    statusTitle,
    helperText,
    nextStep,
    tone,
    doneCount,
    totalCount,
    completed,
    requiredMissing,
    suggestions,
    isFullyReady,
  } = getCompletionGuidance(team);

  const showSuggestionsToggle = !isFullyReady;

  return (
    <div
      className={cn(
        "w-full rounded-2xl border px-3 py-2 ring-1 ring-inset",
        tone === "ready"
          ? "border-emerald-200/70 bg-emerald-50/35 ring-emerald-100/60"
          : "border-amber-200/75 bg-[#fffbeb]/90 ring-amber-100/70",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
          <span aria-hidden className="mr-0.5">
            ✨
          </span>
          Team page progress
        </p>
        <p className="shrink-0 text-[11px] font-semibold tabular-nums text-zinc-500">
          {doneCount}/{totalCount} completed
        </p>
      </div>

      {!isFullyReady && nextStep ? (
        <p className="mt-1 text-[11px] leading-snug text-zinc-600">
          <span className="font-medium text-zinc-500">Next step:</span> {nextStep}
        </p>
      ) : null}

      <div className="mt-1.5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <StatusIcon tone={tone} />
          <p className="min-w-0 text-[12px] font-semibold leading-snug text-zinc-900">
            <span>{statusTitle}</span>
            <span className="font-normal text-zinc-500"> · {helperText}</span>
          </p>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {completed.map((it) => (
            <button
              key={it.label}
              type="button"
              onClick={() => onJump(it.id)}
              className="inline-flex max-w-full items-center gap-0.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-2 py-0.5 text-[10px] font-semibold leading-none text-emerald-800 transition hover:bg-emerald-100/90"
              title="Tap to review"
            >
              <span className="text-[9px] text-emerald-600" aria-hidden>
                ✓
              </span>
              <span className="truncate">{it.label}</span>
            </button>
          ))}
          {requiredMissing.map((it) => (
            <button
              key={`req-${it.label}`}
              type="button"
              onClick={() => onJump(it.id)}
              className="inline-flex items-center rounded-full border border-amber-300/70 bg-amber-50/90 px-2 py-0.5 text-[10px] font-semibold leading-none text-amber-900 transition hover:bg-amber-100/80"
            >
              {requiredMissingLabel(it)}
            </button>
          ))}
        </div>
        {showSuggestionsToggle ? (
          <button
            type="button"
            onClick={() => setShowSuggestions((v) => !v)}
            className="shrink-0 text-[10px] font-semibold leading-none text-zinc-500 underline-offset-2 transition hover:text-zinc-700 hover:underline"
          >
            {showSuggestions ? "Hide" : "Suggestions"}
          </button>
        ) : null}
      </div>

      {showSuggestions && showSuggestionsToggle ? (
        <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 border-t border-amber-200/40 pt-1.5">
          {suggestions.map((it) => (
            <li key={it.label}>
              <button
                type="button"
                onClick={() => onJump(it.id)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-700 transition hover:text-zinc-900"
              >
                <span
                  className={cn(
                    "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] text-[9px] leading-none",
                    it.done
                      ? "bg-emerald-500/15 font-bold text-emerald-700"
                      : "border border-zinc-300/80 bg-white",
                  )}
                  aria-hidden
                >
                  {it.done ? "✓" : ""}
                </span>
                <span className={it.done ? "text-zinc-500" : "text-zinc-800"}>{it.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
