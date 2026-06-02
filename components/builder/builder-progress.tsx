"use client";

import {
  getCompletionGuidance,
  type BuilderProgressTarget,
} from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

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
  const { headline, tone, completed, nextSteps } = getCompletionGuidance(team);

  return (
    <div
      className={cn(
        "w-full rounded-xl border px-3.5 py-3 ring-1 ring-inset",
        tone === "ready"
          ? "border-emerald-200/80 bg-emerald-50/50 ring-emerald-100/80"
          : tone === "almost"
            ? "border-indigo-200/80 bg-indigo-50/40 ring-indigo-100/80"
            : "border-amber-200/80 bg-amber-50/40 ring-amber-100/80",
        className,
      )}
    >
      <p className="text-sm font-bold leading-snug text-zinc-900">{headline}</p>

      {completed.length > 0 ? (
        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">Done</p>
          <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
            {completed.map((it) => (
              <li key={it.label}>
                <button
                  type="button"
                  onClick={() => onJump(it.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 transition hover:text-emerald-900"
                  title="Looks good — tap to review"
                >
                  <span className="text-emerald-600" aria-hidden>
                    ✓
                  </span>
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {nextSteps.length > 0 ? (
        <div className={cn(completed.length > 0 ? "mt-3 border-t border-black/5 pt-3" : "mt-3")}>
          <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">Next steps</p>
          <ul className="mt-1.5 space-y-1">
            {nextSteps.map((it) => (
              <li key={it.label}>
                <button
                  type="button"
                  onClick={() => onJump(it.id)}
                  className="inline-flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] font-semibold text-zinc-800 transition hover:bg-white/70"
                >
                  <span className="text-base" aria-hidden>
                    {it.emoji}
                  </span>
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
