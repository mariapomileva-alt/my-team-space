"use client";

import Link from "next/link";
import { getTeamAssistantSuggestions } from "@/lib/builder/team-assistant";
import { ADMIN_CARD, ADMIN_CARD_PAD } from "@/lib/admin/admin-layout";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function TeamAssistantPanel({
  team,
  teamId,
  className,
}: {
  team: TeamSpace;
  teamId: string;
  className?: string;
}) {
  const suggestions = getTeamAssistantSuggestions(team, teamId).filter((s) => !s.done);

  return (
    <section className={cn(ADMIN_CARD, ADMIN_CARD_PAD, className)}>
      <h2 className="text-base font-bold text-zinc-900">Suggestions</h2>
      <p className="mt-1 text-[13px] text-zinc-500">Small steps that make your team page shine.</p>
      <ul className="mt-6 space-y-3">
        {suggestions.length === 0 ? (
          <li className="rounded-2xl bg-emerald-50/80 px-4 py-3 text-[13px] font-medium text-emerald-800">
            ✓ Your team page looks complete. Publish and share with families!
          </li>
        ) : (
          suggestions.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className="group flex gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 px-4 py-3.5 transition hover:border-violet-100 hover:bg-violet-50/30"
              >
                <span className="text-lg" aria-hidden>
                  {s.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-zinc-900 group-hover:text-violet-950">
                    {s.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-zinc-500">{s.description}</span>
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
