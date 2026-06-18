"use client";

import {
  formatSetupAction,
  getSetupSnapshot,
  type BuilderProgressTarget,
} from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

/** Optional details panel for standalone builder (no sidebar progress card). */
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
  const hasDetails = snap.completed.length > 0 || snap.recommended.length > 0;

  if (isReady && !hasDetails) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {!isReady && snap.next ? (
        <p className="text-[12px] leading-snug text-zinc-600">
          <span className="font-semibold text-violet-700">Next:</span> {formatSetupAction(snap.next)}
        </p>
      ) : null}

      {hasDetails && !isReady ? (
        <>
          <button
            type="button"
            onClick={() => setDetailsOpen((v) => !v)}
            className="self-start rounded-full border border-zinc-200/70 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-600 transition hover:bg-zinc-50"
          >
            {detailsOpen ? "Hide details" : "Setup details"}
          </button>
          {detailsOpen ? (
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
        </>
      ) : null}
    </div>
  );
}
