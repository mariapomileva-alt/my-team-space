"use client";

import { TeamLogoProgressRing } from "@/components/builder/team-logo-progress-ring";
import { getCompletionGuidance, formatSetupAction, getSetupSnapshot } from "@/lib/builder/page-completion";
import { getTeamLevel } from "@/lib/builder/team-levels";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function TeamProgressWidget({
  team,
  className,
  compact = false,
}: {
  team: TeamSpace;
  className?: string;
  compact?: boolean;
}) {
  const guidance = getCompletionGuidance(team);
  const level = getTeamLevel(team);
  const snap = getSetupSnapshot(team);

  const nextStepLabel = snap.next ? formatSetupAction(snap.next) : "Ready to share with families";

  return (
    <div className={cn("rounded-2xl border border-zinc-200/50 bg-white/80 p-4 shadow-sm", className)}>
      <div className="flex items-start gap-3">
        <TeamLogoProgressRing logoUrl={team.logoUrl} percent={guidance.readinessPercent} size={48} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-zinc-900">{team.name || "Your team"}</p>
          <p className="mt-0.5 text-[12px] font-semibold text-violet-700">{guidance.readinessPercent}% Ready</p>
          <p className="mt-0.5 text-[11px] font-medium text-zinc-500">
            {level.emoji} {level.label}
          </p>
        </div>
      </div>

      {!compact ? (
        <div className="mt-4 rounded-xl bg-zinc-50/80 px-3 py-2.5 ring-1 ring-zinc-100/80">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Next step</p>
          <p className="mt-1 text-[13px] font-medium leading-snug text-zinc-800">{nextStepLabel}</p>
        </div>
      ) : null}
    </div>
  );
}
