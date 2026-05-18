"use client";

import { TeamAppDetailSheet } from "@/components/mts/team-app/team-app-detail-sheet";
import { TeamAppTile } from "@/components/mts/team-app/team-app-tile";
import type { BlockAppMeta } from "@/lib/blocks/block-app-meta";
import type { BlockInstance } from "@/lib/types";
import { useState, type ReactNode } from "react";

type ScheduleRow = { id: string; title: string; starts_at: string; location: string | null };
type UpdateRow = { id: string; title: string; body: string; published_at: string };
type AchRow = { id: string; title: string; body: string; icon: string | null; created_at: string };

type ExtraCard = {
  id: string;
  meta: BlockAppMeta;
  headline: string;
  detail?: string;
  badge?: string;
  body: ReactNode;
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const stubBlock = (id: string): BlockInstance => ({
  id,
  type: "team_feed",
  enabled: true,
  order: 0,
});

export function TeamSaaSExtras({
  schedule,
  updates,
  achievements,
}: {
  schedule: ScheduleRow[];
  updates: UpdateRow[];
  achievements: AchRow[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const cards: ExtraCard[] = [];

  if (schedule.length > 0) {
    const next = schedule[0];
    cards.push({
      id: "saas-schedule",
      meta: {
        emoji: "📅",
        title: "Schedule",
        subtitle: "Training & events",
        tileClass: "bg-sky-100 text-sky-700",
      },
      headline: next.title,
      detail: `${formatWhen(next.starts_at)}${next.location ? ` · ${next.location}` : ""}`,
      badge: String(schedule.length),
      body: (
        <ul className="space-y-2">
          {schedule.map((s) => (
            <li
              key={s.id}
              className="rounded-2xl border border-neutral-100 bg-neutral-50/90 px-4 py-3 text-sm ring-1 ring-neutral-100/80"
            >
              <p className="font-semibold text-neutral-900">{s.title}</p>
              <p className="mt-0.5 text-neutral-500">
                {formatWhen(s.starts_at)}
                {s.location ? ` · ${s.location}` : ""}
              </p>
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (updates.length > 0) {
    const u = updates[0];
    cards.push({
      id: "saas-updates",
      meta: {
        emoji: "📣",
        title: "Announcements",
        subtitle: "Team updates",
        tileClass: "bg-indigo-100 text-indigo-700",
      },
      headline: u.title,
      detail: u.body.slice(0, 72) || `${updates.length} messages`,
      badge: "New",
      body: (
        <ul className="space-y-3">
          {updates.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-neutral-100 bg-white px-4 py-3 shadow-sm ring-1 ring-neutral-100/80"
            >
              <p className="font-semibold text-neutral-900">{row.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{row.body}</p>
              <p className="mt-2 text-xs text-neutral-400">
                {new Date(row.published_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (achievements.length > 0) {
    const a = achievements[0];
    cards.push({
      id: "saas-achievements",
      meta: {
        emoji: "🏆",
        title: "Cups & achievements",
        subtitle: "Celebrate wins",
        tileClass: "bg-amber-100 text-amber-800",
      },
      headline: a.title,
      detail: a.body?.slice(0, 72) || `${achievements.length} highlights`,
      badge: a.icon || "🏆",
      body: (
        <ul className="space-y-2">
          {achievements.map((row) => (
            <li
              key={row.id}
              className="flex gap-3 rounded-2xl border border-amber-100/80 bg-gradient-to-br from-amber-50 to-white px-4 py-3 ring-1 ring-amber-100/60"
            >
              <span className="text-2xl">{row.icon || "🏆"}</span>
              <div className="min-w-0">
                <p className="font-semibold text-neutral-900">{row.title}</p>
                {row.body ? <p className="mt-0.5 text-sm text-neutral-600">{row.body}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (cards.length === 0) return null;

  const open = cards.find((c) => c.id === openId) ?? null;

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
        {cards.map((card, i) => (
          <div key={card.id}>
            <TeamAppTile
              block={stubBlock(card.id)}
              metaOverride={card.meta}
              preview={{
                headline: card.headline,
                detail: card.detail,
                badge: card.badge,
                isEmpty: false,
              }}
              index={i}
              onOpen={() => setOpenId(card.id)}
            />
          </div>
        ))}
      </div>
      <TeamAppDetailSheet
        block={open ? stubBlock(open.id) : null}
        metaOverride={open?.meta}
        open={Boolean(open)}
        onClose={() => setOpenId(null)}
      >
        {open?.body}
      </TeamAppDetailSheet>
    </>
  );
}
