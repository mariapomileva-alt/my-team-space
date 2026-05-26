"use client";

import { athletePhotoMap } from "@/lib/blocks/roster";
import {
  computeResultsBoard,
  resolveResultsBoardSettings,
  resultsBoardHasContent,
  resultsBoardHasDraft,
  type LeaderboardRow,
  type ResultsBoardSettings,
  type ResultsFilter,
} from "@/lib/blocks/results-board";
import { getCelebration, type AthleteCelebration } from "@/lib/results/celebrations";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { useMemo, useState } from "react";
import { SeasonTimelineSection } from "@/components/results/season-timeline";
import { useResultsCelebrations } from "@/components/results/use-results-celebrations";

type BoardView = "rankings" | "memories";

const PERIODS: { id: ResultsFilter["period"]; label: string }[] = [
  { id: "season", label: "Full season" },
  { id: "month", label: "This month" },
  { id: "recent", label: "Last competitions" },
];

function AthleteAvatar({
  name,
  photoUrl,
  size = "md",
  hero = false,
  pulse = false,
}: {
  name: string;
  photoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  hero?: boolean;
  pulse?: boolean;
}) {
  const sz =
    size === "xl"
      ? "h-24 w-24 text-3xl"
      : size === "lg"
        ? "h-16 w-16 text-xl"
        : size === "md"
          ? "h-11 w-11 text-base"
          : "h-9 w-9 text-sm";
  const ring = hero ? "ring-4 ring-amber-200/90" : "ring-2 ring-white";
  const shadow = hero
    ? "shadow-[0_12px_40px_-8px_rgba(251,191,36,0.55)]"
    : "shadow-md";
  const avatar = photoUrl ? (
    <img src={photoUrl} alt="" className={`${sz} shrink-0 rounded-full object-cover ${ring} ${shadow}`} />
  ) : (
    <span
      className={`${sz} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 font-bold text-white ${ring} ${shadow}`}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );

  if (pulse) {
    return <span className="results-celebrate-pulse inline-flex shrink-0">{avatar}</span>;
  }
  return avatar;
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition active:scale-[0.98] ${
        active
          ? "bg-[color:var(--mts-primary)] text-white shadow-[0_4px_14px_-4px_rgba(99,102,241,0.55)]"
          : "bg-white/95 text-[color:var(--mts-muted)] ring-1 ring-[color:var(--mts-card-border)]"
      }`}
    >
      {children}
    </button>
  );
}

function RankDelta({ delta, celebrate }: { delta: number | null; celebrate?: boolean }) {
  if (delta == null || delta === 0) return null;
  if (delta > 0) {
    return (
      <span
        className={`text-[11px] font-bold text-emerald-600 ${celebrate ? "results-celebrate-rank-up inline-flex rounded-full bg-emerald-50/90 px-1.5 py-0.5 ring-1 ring-emerald-100" : ""}`}
      >
        ↑ {delta}
      </span>
    );
  }
  return <span className="text-[11px] font-bold text-rose-500">↓ {Math.abs(delta)}</span>;
}

function CelebrationNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="results-celebrate-notice mx-auto mt-4 max-w-sm rounded-full border border-amber-200/70 bg-white/90 px-4 py-2 text-center text-[12px] font-semibold text-amber-900 shadow-[0_4px_20px_-10px_rgba(251,191,36,0.35)] backdrop-blur-sm">
      {children}
    </p>
  );
}

function PodiumCard({
  row,
  place,
  photoUrl,
  maxPoints,
  celebrate,
}: {
  row: LeaderboardRow;
  place: 1 | 2 | 3;
  photoUrl?: string;
  maxPoints: number;
  celebrate?: AthleteCelebration;
}) {
  const isFirst = place === 1;
  const medals = { 1: "🏆", 2: "🥈", 3: "🥉" } as const;
  const placeLabels = { 1: "1st", 2: "2nd", 3: "3rd" } as const;

  const celebrateClass = [
    celebrate?.newLeader ? "results-celebrate-new-leader" : "",
    celebrate?.firstMedal ? "results-celebrate-first-medal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cardClass = isFirst
    ? `results-podium-card results-podium-card--champion relative z-20 order-1 border-amber-200/70 bg-gradient-to-b from-white via-amber-50/90 to-amber-100/50 px-4 pb-5 pt-5 shadow-[0_24px_60px_-16px_rgba(251,191,36,0.45),0_8px_24px_-8px_rgba(15,23,42,0.12)] sm:order-none sm:col-start-2 sm:min-h-[220px] ${celebrateClass}`
    : place === 2
      ? `results-podium-card results-podium-card--side relative z-10 order-2 border-zinc-200/60 bg-white/95 px-3 pb-4 pt-4 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.18)] sm:order-none sm:col-start-1 sm:min-h-[168px] ${celebrateClass}`
      : `results-podium-card results-podium-card--side relative z-10 order-3 border-zinc-200/60 bg-white/95 px-3 pb-4 pt-4 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.18)] sm:order-none sm:col-start-3 sm:min-h-[168px] ${celebrateClass}`;

  return (
    <div
      className={`flex flex-col items-center justify-end rounded-[1.25rem] border text-center backdrop-blur-sm ${cardClass}`}
      style={{ animationDelay: `${place * 100}ms` }}
    >
      <span
        className={`inline-flex items-center justify-center rounded-full font-bold tabular-nums ${
          isFirst
            ? "mb-1 h-7 min-w-7 bg-amber-400/20 px-2 text-[11px] text-amber-900 ring-1 ring-amber-300/50"
            : "mb-1 h-6 min-w-6 bg-zinc-100 text-[10px] text-zinc-600"
        }`}
      >
        {placeLabels[place]}
      </span>
      <span className={isFirst ? "text-4xl drop-shadow-sm" : "text-2xl"}>{medals[place]}</span>
      <div className={isFirst ? "mt-3" : "mt-2"}>
        <AthleteAvatar
          name={row.athleteName}
          photoUrl={photoUrl}
          size={isFirst ? "xl" : "md"}
          hero={isFirst}
          pulse={Boolean(celebrate?.personalBest)}
        />
      </div>
      <p
        className={`mt-3 line-clamp-2 w-full font-bold leading-tight text-zinc-900 ${
          isFirst ? "text-base sm:text-lg" : "text-[13px]"
        }`}
      >
        {row.athleteName}
      </p>
      <p
        className={`mt-1 font-extrabold tabular-nums ${
          isFirst ? "text-xl text-amber-700 sm:text-2xl" : "text-[15px] text-[color:var(--mts-primary)]"
        }`}
      >
        {row.totalPoints}
        <span className={isFirst ? "ml-1 text-sm font-semibold text-amber-600/90" : " text-xs"}> pts</span>
      </p>
      <p className={`font-medium text-zinc-500 ${isFirst ? "mt-1 text-[11px]" : "text-[10px]"}`}>
        🥇 {row.gold} · 🥈 {row.silver} · 🥉 {row.bronze}
      </p>
      <div className={`w-full overflow-hidden rounded-full bg-zinc-100/90 ${isFirst ? "mt-3 h-2" : "mt-2 h-1.5"}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isFirst
              ? "bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200"
              : "bg-gradient-to-r from-[color:var(--mts-primary)] to-violet-400"
          }`}
          style={{ width: `${maxPoints > 0 ? (row.totalPoints / maxPoints) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}

function PodiumSection({
  podium,
  photos,
  maxPoints,
  badgeLabels,
  celebrations,
  heroNewLeader,
}: {
  podium: LeaderboardRow[];
  photos: Record<string, string>;
  maxPoints: number;
  badgeLabels: Record<string, string>;
  celebrations: Record<string, AthleteCelebration>;
  heroNewLeader: boolean;
}) {
  if (podium.length === 0) return null;
  const first = podium.find((r) => r.rank === 1);
  const second = podium.find((r) => r.rank === 2);
  const third = podium.find((r) => r.rank === 3);

  const photo = (r?: LeaderboardRow) =>
    r ? photos[r.athleteId] ?? photos[r.athleteName.toLowerCase()] : undefined;

  return (
    <section
      className={`results-podium-hero relative overflow-hidden rounded-[1.75rem] px-4 py-8 sm:px-8 sm:py-10 ${heroNewLeader ? "results-podium-hero--new-leader" : ""}`}
    >
      <div className="results-podium-hero__spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div className="results-podium-hero__glow pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-10 mb-8 text-center sm:mb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800/70">Season leaders</p>
        <h4 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
          {first ? (
            <>
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                {first.athleteName}
              </span>
              <span className="mt-1 block text-lg font-semibold text-zinc-600 sm:text-xl">leads the season</span>
            </>
          ) : (
            "Top athletes"
          )}
        </h4>
        {first ? (
          <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-zinc-500">
            {first.totalPoints} points · {first.gold + first.silver + first.bronze} medals earned
          </p>
        ) : null}
        {heroNewLeader && first ? (
          <CelebrationNotice>✨ New season leader — {first.athleteName}</CelebrationNotice>
        ) : null}
      </header>

      <div className="relative z-10">
        <div className="results-podium-stage pointer-events-none absolute bottom-0 left-1/2 h-8 w-[92%] -translate-x-1/2 rounded-[100%] sm:h-10" aria-hidden />
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3 sm:gap-5 sm:px-2">
          {second ? (
            <PodiumCard
              row={second}
              place={2}
              photoUrl={photo(second)}
              maxPoints={maxPoints}
              celebrate={getCelebration(second.athleteKey, celebrations)}
            />
          ) : (
            <div className="hidden sm:block" />
          )}
          {first ? (
            <PodiumCard
              row={first}
              place={1}
              photoUrl={photo(first)}
              maxPoints={maxPoints}
              celebrate={getCelebration(first.athleteKey, celebrations)}
            />
          ) : null}
          {third ? (
            <PodiumCard
              row={third}
              place={3}
              photoUrl={photo(third)}
              maxPoints={maxPoints}
              celebrate={getCelebration(third.athleteKey, celebrations)}
            />
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>
      </div>

      {first?.badges.length ? (
        <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-2">
          {first.badges.slice(0, 3).map((b) => {
            const c = getCelebration(first.athleteKey, celebrations);
            const isNew = c.newBadges.includes(b);
            return (
              <span
                key={b}
                className={`rounded-full border border-amber-200/60 bg-white/80 px-3 py-1 text-[11px] font-semibold text-zinc-800 shadow-[0_4px_16px_-8px_rgba(251,191,36,0.35)] backdrop-blur-sm ${isNew ? "results-celebrate-badge" : ""}`}
              >
                {badgeLabels[b] ?? b}
              </span>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

function LeaderboardCard({
  row,
  photoUrl,
  badgeLabels,
  celebrate,
}: {
  row: LeaderboardRow;
  photoUrl?: string;
  badgeLabels: Record<string, string>;
  celebrate?: AthleteCelebration;
}) {
  const cardFx = [
    celebrate?.firstMedal ? "results-celebrate-first-medal" : "",
    celebrate?.newLeader ? "results-celebrate-new-leader" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-zinc-100/90 bg-white p-3 shadow-[0_4px_20px_-14px_rgba(15,23,42,0.12)] ring-1 ring-zinc-50 ${cardFx}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-sm font-extrabold tabular-nums text-zinc-600">
        {row.rank}
      </span>
      <AthleteAvatar
        name={row.athleteName}
        photoUrl={photoUrl}
        size="md"
        pulse={Boolean(celebrate?.personalBest)}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[14px] font-bold text-zinc-900">{row.athleteName}</p>
          <RankDelta delta={row.rankDelta} celebrate={celebrate?.rankUp} />
        </div>
        <p className="mt-0.5 text-[12px] font-semibold text-[color:var(--mts-primary)]">{row.totalPoints} points</p>
        <p className="mt-0.5 text-[11px] text-zinc-500">
          🥇 {row.gold} · 🥈 {row.silver} · 🥉 {row.bronze} · {row.competitions} events
          {row.bestPlace ? ` · best #${row.bestPlace}` : ""}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
            style={{ width: `${row.progressPercent}%` }}
          />
        </div>
        {row.badges.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {row.badges.slice(0, 2).map((b) => (
              <span
                key={b}
                className={`rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-900 ring-1 ring-amber-100 ${
                  celebrate?.newBadges.includes(b) ? "results-celebrate-badge" : ""
                }`}
              >
                {badgeLabels[b] ?? b}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CompetitionCard({ comp }: { comp: import("@/lib/blocks/results-board").CompetitionSummary }) {
  return (
    <article className="flex flex-col rounded-2xl border border-zinc-100 bg-white p-3.5 shadow-[0_4px_22px_-14px_rgba(15,23,42,0.1)] ring-1 ring-zinc-50">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="line-clamp-2 text-[14px] font-bold leading-snug text-zinc-900">{comp.name}</h4>
          <p className="mt-1 text-[11px] text-zinc-500">
            {comp.date
              ? new Date(comp.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
              : "Date TBD"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700 ring-1 ring-violet-100">
          {comp.categoryLabel}
        </span>
      </div>
      {comp.topThree.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {comp.topThree.map((t) => (
            <li
              key={`${t.name}-${t.place}`}
              className="flex items-center justify-between rounded-xl bg-zinc-50/90 px-2.5 py-1.5 text-[12px]"
            >
              <span className="flex items-center gap-2 font-semibold text-zinc-800">
                <span>{t.medal}</span>
                <span className="truncate">{t.name}</span>
              </span>
              <span className="tabular-nums text-zinc-400">#{t.place}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl bg-zinc-50 px-3 py-2 text-center text-[11px] text-zinc-400">Results coming soon</p>
      )}
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="text-[10px] font-medium text-zinc-400">{comp.athleteCount} athletes</span>
        <span className="text-[11px] font-semibold text-[color:var(--mts-primary)]">View all ›</span>
      </div>
    </article>
  );
}

function MonthlySection({
  monthly,
  insights,
}: {
  monthly: import("@/lib/blocks/results-board").MonthlyProgressRow[];
  insights: import("@/lib/blocks/results-board").ResultsInsights;
}) {
  if (monthly.length === 0) return null;
  const maxPts = Math.max(1, ...monthly.map((m) => m.totalPoints));

  return (
    <section className="rounded-[1.35rem] border border-zinc-100 bg-white p-4 shadow-sm ring-1 ring-zinc-50">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">Monthly progress</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-emerald-50/80 p-3 ring-1 ring-emerald-100">
          <p className="text-[10px] font-semibold uppercase text-emerald-800/70">Points this month</p>
          <p className="mt-1 text-lg font-bold text-emerald-900">{insights.topPointsThisMonth?.points ?? 0}</p>
          <p className="truncate text-[11px] text-emerald-800">{insights.topPointsThisMonth?.name ?? "—"}</p>
        </div>
        <div className="rounded-xl bg-amber-50/80 p-3 ring-1 ring-amber-100">
          <p className="text-[10px] font-semibold uppercase text-amber-800/70">Medal growth</p>
          <p className="mt-1 text-lg font-bold text-amber-900">{insights.medalGrowth >= 0 ? `+${insights.medalGrowth}` : insights.medalGrowth}</p>
          <p className="text-[11px] text-amber-800">vs last month</p>
        </div>
        <div className="rounded-xl bg-sky-50/80 p-3 ring-1 ring-sky-100">
          <p className="text-[10px] font-semibold uppercase text-sky-800/70">Most active</p>
          <p className="mt-1 truncate text-lg font-bold text-sky-900">{insights.mostActive?.name ?? "—"}</p>
          <p className="text-[11px] text-sky-800">{insights.mostActive?.count ?? 0} events</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {monthly.map((m) => (
          <div key={m.monthKey}>
            <div className="mb-1 flex justify-between text-[11px] font-semibold text-zinc-600">
              <span>{m.label}</span>
              <span>{m.totalPoints} pts · {m.totalMedals} medals</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[color:var(--mts-primary-bright)] to-indigo-400"
                style={{ width: `${(m.totalPoints / maxPts) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ResultsBoardView({
  block,
  team,
  compact = false,
  celebrate = true,
  settings: settingsOverride,
}: {
  block: BlockInstance;
  team?: TeamSpace;
  compact?: boolean;
  /** Animate milestones when results change (off in builder preview). */
  celebrate?: boolean;
  /** Live editor draft — keeps preview in sync before publish. */
  settings?: ResultsBoardSettings;
}) {
  const settings = useMemo(
    () => resolveResultsBoardSettings(block, settingsOverride),
    [block, settingsOverride],
  );
  const photos = team ? athletePhotoMap(team) : {};
  const [categoryId, setCategoryId] = useState<string>("all");
  const [period, setPeriod] = useState<ResultsFilter["period"]>("season");
  const [showAllComps, setShowAllComps] = useState(false);
  const [boardView, setBoardView] = useState<BoardView>("rankings");

  const timelineEnabled = settings.seasonTimeline;

  const filter: ResultsFilter = { categoryId, period };
  const data = useMemo(() => computeResultsBoard(settings, filter), [settings, categoryId, period]);

  const celebrationsEnabled = celebrate && Boolean(team?.slug) && !compact;
  const { celebrations, heroNewLeader, ready: celebrationsReady } = useResultsCelebrations({
    enabled: celebrationsEnabled,
    teamSlug: team?.slug,
    blockId: block.id,
    categoryId,
    period,
    leaderboard: data.leaderboard,
  });
  const fx = celebrationsReady ? celebrations : {};

  const title = settings.blockTitle?.trim() || "Results board";
  const categories = data.filterCategories;
  const comps = showAllComps ? data.competitions : data.competitions.slice(0, 4);

  const hasScoredResults = resultsBoardHasContent(settings);
  const hasDraft = resultsBoardHasDraft(settings);
  const isEmpty =
    !hasScoredResults && data.leaderboard.length === 0 && data.competitions.length === 0;

  if (isEmpty) {
    return (
      <div className="rounded-[1.35rem] border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center">
        <p className="text-2xl">🏁</p>
        <p className="mt-2 text-sm font-semibold text-zinc-700">
          {hasDraft ? "Add athlete results to see the board" : "Results will appear here"}
        </p>
        <p className="mt-1 text-[12px] text-zinc-500">
          {hasDraft
            ? "Open each competition → add athlete name + place. Rankings update instantly."
            : "Add a competition in the Competitions tab — points and medals calculate automatically."}
        </p>
      </div>
    );
  }

  const photoFor = (row: LeaderboardRow) => photos[row.athleteId] ?? photos[row.athleteName.toLowerCase()];

  return (
    <div className="results-board space-y-4">
      <header className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--mts-muted)]">
          {settings.seasonName}
        </p>
        <h3 className="text-xl font-bold tracking-tight text-[color:var(--mts-text)] sm:text-2xl">{title}</h3>
        <p className="text-[13px] leading-relaxed text-[color:var(--mts-muted)]">
          Track team progress and competition results
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={categoryId === "all"} onClick={() => setCategoryId("all")}>
          All
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.id} active={categoryId === c.id} onClick={() => setCategoryId(c.id)}>
            {c.label}
          </FilterChip>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <FilterChip key={p.id} active={period === p.id} onClick={() => setPeriod(p.id)}>
            {p.label}
          </FilterChip>
        ))}
      </div>

      {timelineEnabled ? (
        <div className="flex rounded-2xl bg-zinc-100/80 p-1 ring-1 ring-zinc-200/60">
          <button
            type="button"
            onClick={() => setBoardView("rankings")}
            className={`flex-1 rounded-xl px-3 py-2 text-[12px] font-semibold transition ${
              boardView === "rankings" ? "bg-white text-indigo-700 shadow-sm" : "text-zinc-600"
            }`}
          >
            Rankings
          </button>
          <button
            type="button"
            onClick={() => setBoardView("memories")}
            className={`flex-1 rounded-xl px-3 py-2 text-[12px] font-semibold transition ${
              boardView === "memories" ? "bg-white text-violet-700 shadow-sm" : "text-zinc-600"
            }`}
          >
            {settings.timelineTitle?.trim() || "Season memories"}
          </button>
        </div>
      ) : null}

      {boardView === "memories" && timelineEnabled ? (
        <SeasonTimelineSection
          months={data.timeline}
          title={settings.timelineTitle?.trim() || "Season memories"}
          seasonName={settings.seasonName}
        />
      ) : null}

      {boardView === "rankings" && data.podium.length > 0 ? (
        <PodiumSection
          podium={data.podium}
          photos={photos}
          maxPoints={data.maxPoints}
          badgeLabels={data.badgeLabels}
          celebrations={fx}
          heroNewLeader={celebrationsReady && heroNewLeader}
        />
      ) : null}

      {boardView === "rankings" && !compact && data.leaderboard.length > 0 ? (
        <section className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">Leaderboard</p>
          {data.leaderboard.map((row) => (
            <LeaderboardCard
              key={row.athleteKey}
              row={row}
              photoUrl={photoFor(row)}
              badgeLabels={data.badgeLabels}
              celebrate={getCelebration(row.athleteKey, fx)}
            />
          ))}
        </section>
      ) : null}

      {boardView === "rankings" && !compact && comps.length > 0 ? (
        <section className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">Latest competitions</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {comps.map((c) => (
              <CompetitionCard key={c.id} comp={c} />
            ))}
          </div>
          {data.competitions.length > 4 ? (
            <button
              type="button"
              onClick={() => setShowAllComps((v) => !v)}
              className="w-full rounded-xl border border-dashed border-indigo-200 py-2.5 text-[12px] font-semibold text-indigo-600"
            >
              {showAllComps ? "Show less" : `View all ${data.competitions.length} competitions`}
            </button>
          ) : null}
        </section>
      ) : null}

      {boardView === "rankings" && !compact ? (
        <MonthlySection monthly={data.monthly} insights={data.insights} />
      ) : null}
    </div>
  );
}
