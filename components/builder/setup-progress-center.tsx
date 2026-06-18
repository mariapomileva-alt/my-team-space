"use client";

import {
  completedCelebrationLabel,
  formatSetupAction,
  getSetupSnapshot,
  type BuilderProgressTarget,
} from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function SetupProgressCenter({
  team,
  onJump,
  className,
}: {
  team: TeamSpace;
  onJump: (target: BuilderProgressTarget) => void;
  className?: string;
}) {
  const snap = getSetupSnapshot(team);
  const isReady = snap.percent >= 100;

  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200/45 bg-zinc-50/40 px-4 py-3.5 sm:px-5",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold tracking-tight text-zinc-900">{snap.percent}% Ready</p>
          {snap.next ? (
            <div className="mt-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Next step</p>
              <p className="mt-0.5 text-[13px] font-semibold text-zinc-800">{formatSetupAction(snap.next)}</p>
            </div>
          ) : (
            <p className="mt-1 text-[13px] font-medium text-emerald-700">Your team page is ready to share.</p>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:max-w-[55%]">
          {snap.completed.length > 0 ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Completed</p>
              <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                {snap.completed.map((item) => (
                  <li key={item.label} className="text-[11px] font-medium text-emerald-800/90">
                    <span aria-hidden>✓ </span>
                    {completedCelebrationLabel(item)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {snap.recommended.length > 0 ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Recommended</p>
              <ul className="mt-1 space-y-0.5">
                {snap.recommended.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => onJump(item.id)}
                      className="text-left text-[11px] font-medium text-zinc-600 transition hover:text-violet-700"
                    >
                      <span className="text-zinc-400" aria-hidden>
                        ○{" "}
                      </span>
                      {formatSetupAction(item)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {snap.next && !isReady ? (
        <button
          type="button"
          onClick={() => onJump(snap.next!.id)}
          className="mt-3 inline-flex min-h-[36px] items-center justify-center rounded-full bg-violet-600 px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-[0.98]"
        >
          Continue setup
        </button>
      ) : null}
    </div>
  );
}
