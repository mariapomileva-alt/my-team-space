"use client";

import {
  formatSetupAction,
  getSetupSnapshot,
  type BuilderProgressTarget,
} from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

export function SetupProgressStrip({
  team,
  onJump,
  className,
}: {
  team: TeamSpace;
  onJump: (target: BuilderProgressTarget) => void;
  className?: string;
}) {
  const snap = getSetupSnapshot(team);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isReady = snap.percent >= 100;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-zinc-900">{snap.percent}% Ready</p>
          {snap.next && !isReady ? (
            <p className="mt-0.5 text-[12px] text-zinc-600">
              <span className="font-semibold text-zinc-500">Next step:</span> {formatSetupAction(snap.next)}
            </p>
          ) : (
            <p className="mt-0.5 text-[12px] font-medium text-emerald-700">Ready to share with families.</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {(snap.completed.length > 0 || snap.recommended.length > 0) && !isReady ? (
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              className="rounded-full border border-zinc-200/70 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-600 transition hover:bg-zinc-50"
            >
              {detailsOpen ? "Hide details" : "Details"}
            </button>
          ) : null}
          {snap.next && !isReady ? (
            <button
              type="button"
              onClick={() => onJump(snap.next!.id)}
              className="rounded-full bg-violet-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-[0.98]"
            >
              Continue setup
            </button>
          ) : null}
        </div>
      </div>

      {detailsOpen && !isReady ? (
        <div className="grid gap-3 rounded-xl border border-zinc-200/40 bg-zinc-50/50 px-3 py-2.5 sm:grid-cols-2">
          {snap.completed.length > 0 ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Completed</p>
              <ul className="mt-1 space-y-0.5">
                {snap.completed.map((item) => (
                  <li key={item.label} className="text-[11px] font-medium text-emerald-800/90">
                    ✓ {item.label}
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
                      {formatSetupAction(item)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
