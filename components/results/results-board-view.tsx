"use client";

import {
  computeResultsBoard,
  getResultsBoardSettings,
  SPORT_CATEGORIES,
  type ResultsFilter,
  type SportCategory,
} from "@/lib/blocks/results-board";
import type { BlockInstance } from "@/lib/types";
import { useMemo, useState } from "react";

const PERIOD_OPTIONS = [
  { id: "season" as const, label: "Full season" },
  { id: "month" as const, label: "This month" },
];

export function ResultsBoardView({
  block,
  compact = false,
}: {
  block: BlockInstance;
  compact?: boolean;
}) {
  const settings = getResultsBoardSettings(block);
  const [category, setCategory] = useState<SportCategory>("All");
  const [period, setPeriod] = useState<ResultsFilter["period"]>("season");
  const [showAllComps, setShowAllComps] = useState(false);

  const filter: ResultsFilter = { category, period };
  const data = useMemo(() => computeResultsBoard(settings, filter), [settings, category, period]);

  const title = settings.blockTitle?.trim() || "Results board";
  const categories = ["All", ...settings.categories.filter((c) => c !== "All")] as SportCategory[];

  if (settings.mode === "simple" && settings.simpleResults.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-sm text-zinc-500">
        Competition results will appear here once the coach adds them.
      </p>
    );
  }

  if (settings.mode === "season" && settings.competitions.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-sm text-zinc-500">
        Season rankings will appear here once competitions are added.
      </p>
    );
  }

  const comps = showAllComps ? data.competitions : data.competitions.slice(0, 4);
  const maxMonthPts = Math.max(1, ...data.monthly.flatMap((m) => m.byAthlete.map((a) => a.points)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--mts-muted)]">
            {settings.seasonName}
          </p>
          <h3 className="text-lg font-bold tracking-tight text-[color:var(--mts-text)]">{title}</h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
              category === c
                ? "bg-[color:var(--mts-primary)] text-white shadow-sm"
                : "bg-white/90 text-[color:var(--mts-muted)] ring-1 ring-[color:var(--mts-card-border)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {PERIOD_OPTIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriod(p.id)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              period === p.id ? "bg-amber-100 text-amber-900 ring-1 ring-amber-200" : "text-zinc-500"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {data.podium.length > 0 ? (
        <section>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Season leaders</p>
          <div className="grid grid-cols-3 items-end gap-2">
            {[1, 0, 2].map((idx) => {
              const row = data.podium[idx];
              if (!row) return <div key={idx} />;
              const isFirst = row.rank === 1;
              return (
                <div
                  key={row.athleteKey}
                  className={`rounded-2xl border bg-gradient-to-b p-3 text-center shadow-sm ${
                    isFirst
                      ? "col-span-1 min-h-[120px] border-amber-200 from-amber-50 to-white ring-2 ring-amber-300/60"
                      : "min-h-[96px] border-zinc-100 from-zinc-50 to-white"
                  }`}
                >
                  <span className="text-2xl">{isFirst ? "🏆" : row.rank === 2 ? "🥈" : "🥉"}</span>
                  <p className="mt-1 line-clamp-2 text-[12px] font-bold text-zinc-900">{row.athleteName}</p>
                  <p className="text-[11px] font-semibold text-indigo-600">{row.totalPoints} pts</p>
                  <p className="text-[10px] text-zinc-500">
                    🥇{row.gold} · 🥈{row.silver} · 🥉{row.bronze}
                  </p>
                </div>
              );
            })}
          </div>
          {data.podium[0]?.badges.length ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {data.podium[0].badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-zinc-600 ring-1 ring-zinc-100"
                >
                  {data.badgeLabels[b] ?? b}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {data.leaderboard.length > 0 && !compact ? (
        <section className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="px-3 py-2">#</th>
                <th className="px-2 py-2">Athlete</th>
                <th className="px-2 py-2 text-right">Pts</th>
                <th className="hidden px-2 py-2 sm:table-cell">Medals</th>
                <th className="hidden px-2 py-2 text-right sm:table-cell">Events</th>
                <th className="hidden px-3 py-2 text-right sm:table-cell">Best</th>
              </tr>
            </thead>
            <tbody>
              {data.leaderboard.map((row) => (
                <tr key={row.athleteKey} className="border-b border-zinc-50 last:border-0">
                  <td className="px-3 py-2 font-bold tabular-nums text-zinc-400">{row.rank}</td>
                  <td className="max-w-[100px] truncate px-2 py-2 font-semibold text-zinc-900">{row.athleteName}</td>
                  <td className="px-2 py-2 text-right font-bold tabular-nums text-indigo-600">{row.totalPoints}</td>
                  <td className="hidden px-2 py-2 sm:table-cell">
                    {row.gold}/{row.silver}/{row.bronze}
                  </td>
                  <td className="hidden px-2 py-2 text-right tabular-nums text-zinc-500 sm:table-cell">
                    {row.competitions}
                  </td>
                  <td className="hidden px-3 py-2 text-right font-medium text-zinc-600 sm:table-cell">
                    {row.bestPlace ? `#${row.bestPlace}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {data.monthly.length > 0 && !compact ? (
        <section className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Monthly progress</p>
          <div className="mt-3 space-y-3">
            {data.monthly.map((m) => (
              <div key={m.monthKey}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-zinc-700">{m.label}</span>
                  {m.topGainer ? (
                    <span className="text-zinc-500">
                      +{m.topGainer.points} {m.topGainer.name}
                    </span>
                  ) : null}
                </div>
                <div className="flex h-8 items-end gap-1">
                  {m.byAthlete.slice(0, 5).map((a) => (
                    <div key={a.name} className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-300"
                        style={{ height: `${Math.max(12, (a.points / maxMonthPts) * 32)}px` }}
                        title={`${a.name}: ${a.points} pts`}
                      />
                      <span className="max-w-full truncate text-[9px] text-zinc-500">{a.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {comps.length > 0 ? (
        <section className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Latest competitions</p>
          {comps.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm ring-1 ring-zinc-100/80"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-900">{c.name}</p>
                  <p className="text-[11px] text-zinc-500">
                    {c.date ? new Date(c.date).toLocaleDateString() : "—"} · {c.category}
                  </p>
                </div>
              </div>
              {c.topThree.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {c.topThree.map((t) => (
                    <li key={`${t.name}-${t.place}`} className="flex items-center gap-2 text-[12px]">
                      <span>{t.medal}</span>
                      <span className="font-medium text-zinc-800">{t.name}</span>
                      <span className="text-zinc-400">#{t.place}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[11px] text-zinc-400">No results yet</p>
              )}
            </div>
          ))}
          {data.competitions.length > 4 ? (
            <button
              type="button"
              onClick={() => setShowAllComps((v) => !v)}
              className="w-full rounded-xl border border-dashed border-indigo-200 py-2 text-[12px] font-semibold text-indigo-600"
            >
              {showAllComps ? "Show less" : `View all ${data.competitions.length} competitions`}
            </button>
          ) : null}
        </section>
      ) : null}

      {settings.mode === "simple" ? (
        <section className="grid gap-2 sm:grid-cols-2">
          {settings.simpleResults.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[color:var(--mts-card-border)] bg-white p-3 text-center shadow-sm"
            >
              <span className="text-2xl">{r.medal}</span>
              <p className="font-semibold text-[color:var(--mts-text)]">{r.athleteName}</p>
              <p className="text-[11px] text-[color:var(--mts-muted)]">
                {r.competitionName}
                {r.place > 0 ? ` · #${r.place}` : ""}
              </p>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}
