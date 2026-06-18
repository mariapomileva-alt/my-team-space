"use client";

import { formatSetupAction, getSetupSnapshot, type BuilderProgressTarget } from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function BuilderSuggestionsCard({
  team,
  onJump,
  className,
}: {
  team: TeamSpace;
  onJump: (target: BuilderProgressTarget) => void;
  className?: string;
}) {
  const snap = getSetupSnapshot(team);
  const suggestions = [snap.next, ...snap.recommended].filter(Boolean).slice(0, 3) as NonNullable<
    typeof snap.next
  >[];

  if (suggestions.length === 0) return null;

  const minutes = suggestions.length <= 2 ? 2 : 5;

  return (
    <section
      className={cn(
        "rounded-2xl border border-violet-100/80 bg-gradient-to-br from-violet-50/50 to-white px-5 py-4",
        className,
      )}
    >
      <p className="text-[13px] font-bold text-zinc-900">
        <span aria-hidden className="mr-1">
          💡
        </span>
        Suggestions
      </p>
      <ul className="mt-3 space-y-2">
        {suggestions.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => onJump(item.id)}
              className="text-left text-[13px] font-medium text-zinc-700 transition hover:text-violet-700"
            >
              {formatSetupAction(item)}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-zinc-400">Estimated time: {minutes} minutes</p>
    </section>
  );
}
