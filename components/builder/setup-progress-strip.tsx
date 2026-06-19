"use client";

import {
  getLaunchChecklist,
  nextLaunchStep,
  type LaunchChecklistId,
} from "@/lib/builder/launch-checklist";
import type { BuilderProgressTarget } from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

const CHECKLIST_JUMP: Record<LaunchChecklistId, BuilderProgressTarget | "publish" | "share"> = {
  team_name: "identity",
  logo: "identity",
  schedule: "schedule",
  contacts: "contacts",
  publish: "publish",
  share: "share",
};

/** Setup checklist with clear next actions toward publishing. */
export function SetupProgressStrip({
  team,
  onJump,
  onPublish,
  onShare,
  className,
}: {
  team: TeamSpace;
  onJump: (target: BuilderProgressTarget) => void;
  onPublish?: () => void;
  onShare?: () => void;
  className?: string;
}) {
  const checklist = getLaunchChecklist(team);
  const next = nextLaunchStep(team);
  const doneCount = checklist.filter((i) => i.done).length;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isComplete = doneCount === checklist.length;

  function handleStep(id: LaunchChecklistId) {
    const target = CHECKLIST_JUMP[id];
    if (target === "publish") {
      onPublish?.();
      return;
    }
    if (target === "share") {
      onShare?.();
      return;
    }
    onJump(target);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {next ? (
        <p className="text-[12px] leading-snug text-zinc-600">
          <span className="font-semibold text-violet-700">Next:</span> {next.nextAction}
        </p>
      ) : isComplete ? (
        <p className="text-[12px] font-medium text-emerald-700">All set — share your page with parents!</p>
      ) : null}

      <button
        type="button"
        onClick={() => setDetailsOpen((v) => !v)}
        className="self-start rounded-full border border-zinc-200/70 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-600 transition hover:bg-zinc-50"
      >
        {detailsOpen ? "Hide checklist" : `Setup checklist (${doneCount}/${checklist.length})`}
      </button>

      {detailsOpen ? (
        <ol className="space-y-1 rounded-xl border border-zinc-200/40 bg-zinc-50/50 px-3 py-2.5">
          {checklist.map((item, index) => (
            <li key={item.id}>
              {item.done ? (
                <span className="flex items-center gap-2 text-[11px] font-medium text-emerald-800/90">
                  <span className="text-[10px]">{index + 1}.</span> ✓ {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStep(item.id)}
                  className="flex w-full items-center gap-2 text-left text-[11px] font-medium text-zinc-600 transition hover:text-violet-700"
                >
                  <span className="text-[10px] text-zinc-400">{index + 1}.</span>
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
