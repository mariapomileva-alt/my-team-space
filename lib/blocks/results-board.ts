import { getBlockSettings } from "@/lib/blocks/settings";
import type { BlockInstance } from "@/lib/types";

export type ResultsBoardMode = "simple" | "season";

export type TeamCategory = {
  id: string;
  label: string;
};

export type ScoringRules = {
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifth: number;
  sixth: number;
  other: number;
  skipped: number;
};

export type SimpleResult = {
  id: string;
  competitionName: string;
  date: string;
  athleteName: string;
  place: number;
  medal: string;
  note?: string;
  categoryId?: string;
};

export type CompetitionAthleteResult = {
  id: string;
  athleteId: string;
  athleteName: string;
  place: number;
  medal: string;
  points?: number;
  status: "participated" | "skipped";
  note?: string;
};

export type Competition = {
  id: string;
  name: string;
  date: string;
  categoryId: string;
  results: CompetitionAthleteResult[];
};

export type ResultsBoardSettings = {
  enabled: boolean;
  mode: ResultsBoardMode;
  blockTitle: string;
  seasonName: string;
  categories: TeamCategory[];
  usePointsRating: boolean;
  medalsOnly: boolean;
  scoring: ScoringRules;
  competitions: Competition[];
  simpleResults: SimpleResult[];
};

export type LeaderboardRow = {
  athleteKey: string;
  athleteName: string;
  athleteId: string;
  rank: number;
  rankDelta: number | null;
  totalPoints: number;
  gold: number;
  silver: number;
  bronze: number;
  competitions: number;
  bestPlace: number | null;
  progressPercent: number;
  badges: string[];
};

export type CompetitionSummary = {
  id: string;
  name: string;
  date: string;
  categoryLabel: string;
  topThree: { name: string; place: number; medal: string; athleteId?: string }[];
  athleteCount: number;
};

export type MonthlyProgressRow = {
  monthKey: string;
  label: string;
  totalPoints: number;
  totalMedals: number;
  byAthlete: { name: string; points: number }[];
  topGainer: { name: string; points: number } | null;
};

export type ResultsInsights = {
  mostActive: { name: string; count: number } | null;
  topPointsThisMonth: { name: string; points: number } | null;
  medalGrowth: number;
};

export type ResultsBoardComputed = {
  settings: ResultsBoardSettings;
  filterCategories: TeamCategory[];
  leaderboard: LeaderboardRow[];
  podium: LeaderboardRow[];
  competitions: CompetitionSummary[];
  monthly: MonthlyProgressRow[];
  insights: ResultsInsights;
  badgeLabels: Record<string, string>;
  maxPoints: number;
};

export type ResultsFilter = {
  categoryId: string | "all";
  period: "season" | "month" | "recent";
};

export const DEFAULT_SCORING: ScoringRules = {
  first: 10,
  second: 8,
  third: 6,
  fourth: 4,
  fifth: 3,
  sixth: 2,
  other: 1,
  skipped: 0,
};

const BADGE_LABELS: Record<string, string> = {
  season_leader: "🏆 Season leader",
  fast_progress: "🔥 Fast progress",
  first_competition: "⭐ First competition",
  first_medal: "⭐ First medal",
  most_active: "💪 Most active",
  personal_best: "🎯 Personal best",
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultResultsBoardSettings(): ResultsBoardSettings {
  return {
    enabled: true,
    mode: "season",
    blockTitle: "Results board",
    seasonName: `${new Date().getFullYear()} Season`,
    categories: [],
    usePointsRating: true,
    medalsOnly: false,
    scoring: { ...DEFAULT_SCORING },
    competitions: [],
    simpleResults: [],
  };
}

export function newCategory(label = ""): TeamCategory {
  return { id: uid("cat"), label: label.trim() };
}

export function upsertCategory(categories: TeamCategory[], label: string): { categories: TeamCategory[]; id: string } {
  const trimmed = label.trim();
  if (!trimmed) return { categories, id: "" };
  const hit = categories.find((c) => c.label.toLowerCase() === trimmed.toLowerCase());
  if (hit) return { categories, id: hit.id };
  const created = newCategory(trimmed);
  return { categories: [...categories, created], id: created.id };
}

export function categoryLabel(settings: ResultsBoardSettings, categoryId: string): string {
  if (!categoryId) return "General";
  return settings.categories.find((c) => c.id === categoryId)?.label ?? "General";
}

export function mergeCategoryList(settings: ResultsBoardSettings): TeamCategory[] {
  const byId = new Map(settings.categories.map((c) => [c.id, c]));
  for (const comp of settings.competitions) {
    if (comp.categoryId && !byId.has(comp.categoryId)) {
      byId.set(comp.categoryId, { id: comp.categoryId, label: "General" });
    }
  }
  return [...byId.values()];
}

export function newSimpleResult(): SimpleResult {
  return {
    id: uid("sr"),
    competitionName: "",
    date: "",
    athleteName: "",
    place: 1,
    medal: medalForPlace(1),
    note: "",
  };
}

export function newCompetition(categoryId = ""): Competition {
  return {
    id: uid("cmp"),
    name: "",
    date: new Date().toISOString().slice(0, 10),
    categoryId,
    results: [],
  };
}

export function newCompetitionResult(athleteId = "", athleteName = ""): CompetitionAthleteResult {
  return {
    id: uid("res"),
    athleteId,
    athleteName,
    place: 1,
    medal: medalForPlace(1),
    status: "participated",
    note: "",
  };
}

export function medalForPlace(place: number): string {
  if (place === 1) return "🥇";
  if (place === 2) return "🥈";
  if (place === 3) return "🥉";
  if (place > 0) return "🏅";
  return "—";
}

export function pointsForPlace(place: number, scoring: ScoringRules): number {
  if (place <= 0) return scoring.skipped;
  if (place === 1) return scoring.first;
  if (place === 2) return scoring.second;
  if (place === 3) return scoring.third;
  if (place === 4) return scoring.fourth;
  if (place === 5) return scoring.fifth;
  if (place === 6) return scoring.sixth;
  return scoring.other;
}

function athleteKey(id: string, name: string) {
  return id?.trim() || name.trim().toLowerCase();
}

type ResultEvent = {
  athleteKey: string;
  athleteName: string;
  athleteId: string;
  place: number;
  medal: string;
  points: number;
  date: string;
  categoryId: string;
  competitionId: string;
  skipped: boolean;
};

function normalizeScoring(raw: unknown): ScoringRules {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_SCORING };
  const s = raw as Partial<ScoringRules>;
  return {
    first: num(s.first, DEFAULT_SCORING.first),
    second: num(s.second, DEFAULT_SCORING.second),
    third: num(s.third, DEFAULT_SCORING.third),
    fourth: num(s.fourth, DEFAULT_SCORING.fourth),
    fifth: num(s.fifth, DEFAULT_SCORING.fifth),
    sixth: num(s.sixth, DEFAULT_SCORING.sixth),
    other: num(s.other, DEFAULT_SCORING.other),
    skipped: num(s.skipped, DEFAULT_SCORING.skipped),
  };
}

function num(v: unknown, fallback: number) {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function normalizeCategories(raw: unknown): TeamCategory[] {
  if (!Array.isArray(raw)) return [];
  const out: TeamCategory[] = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim()) {
      out.push({ id: uid("cat"), label: item.trim() });
      continue;
    }
    if (item && typeof item === "object") {
      const row = item as { id?: string; label?: string };
      const label = typeof row.label === "string" ? row.label.trim() : "";
      if (label) out.push({ id: row.id?.trim() || uid("cat"), label });
    }
  }
  const seen = new Set<string>();
  return out.filter((c) => {
    const k = c.label.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function getResultsBoardSettings(block: BlockInstance): ResultsBoardSettings {
  const defaults = defaultResultsBoardSettings();
  const raw = getBlockSettings<Record<string, unknown>>(block);

  const hasLegacyItems = Array.isArray(raw.items) && (raw.items as unknown[]).length > 0;
  const hasNewData =
    (Array.isArray(raw.competitions) && raw.competitions.length > 0) ||
    (Array.isArray(raw.simpleResults) && raw.simpleResults.length > 0);

  if (hasLegacyItems && !hasNewData) {
    const simpleResults = (raw.items as { id?: string; name?: string; subtitle?: string; emoji?: string }[])
      .filter((r) => r.name?.trim())
      .map((r) => ({
        id: r.id ?? uid("sr"),
        competitionName: "Competition",
        date: "",
        athleteName: r.name!.trim(),
        place: parsePlace(r.subtitle),
        medal: r.emoji?.trim() || medalForPlace(parsePlace(r.subtitle)),
        note: r.subtitle,
      }));
    return { ...defaults, mode: "simple", simpleResults };
  }

  const settings: ResultsBoardSettings = {
    ...defaults,
    enabled: raw.enabled !== false,
    mode: raw.mode === "simple" ? "simple" : "season",
    blockTitle: str(raw.blockTitle, defaults.blockTitle),
    seasonName: str(raw.seasonName, defaults.seasonName),
    categories: normalizeCategories(raw.categories),
    usePointsRating: raw.usePointsRating !== false,
    medalsOnly: Boolean(raw.medalsOnly),
    scoring: normalizeScoring(raw.scoring),
    competitions: normalizeCompetitions(raw.competitions, normalizeCategories(raw.categories)),
    simpleResults: normalizeSimple(raw.simpleResults),
  };

  return syncCategoriesFromData(settings);
}

function syncCategoriesFromData(settings: ResultsBoardSettings): ResultsBoardSettings {
  let categories = [...settings.categories];
  for (const comp of settings.competitions) {
    if (comp.categoryId) continue;
    const { categories: next, id } = upsertCategory(categories, "General");
    categories = next;
    comp.categoryId = id;
  }
  return { ...settings, categories };
}

function str(v: unknown, fallback: string) {
  return typeof v === "string" ? v : fallback;
}

function parsePlace(subtitle?: string): number {
  if (!subtitle) return 1;
  const m = subtitle.match(/\d+/);
  return m ? Math.max(1, parseInt(m[0], 10)) : 1;
}

function normalizeSimple(raw: unknown): SimpleResult[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r) => r && typeof r === "object")
    .map((r) => {
      const row = r as Partial<SimpleResult>;
      return {
        id: row.id ?? uid("sr"),
        competitionName: str(row.competitionName, ""),
        date: str(row.date, ""),
        athleteName: str(row.athleteName, ""),
        place: num(row.place, 1),
        medal: str(row.medal, medalForPlace(num(row.place, 1))),
        note: row.note?.trim(),
        categoryId: str(row.categoryId, ""),
      };
    });
}

function normalizeCompetitions(raw: unknown, categories: TeamCategory[]): Competition[] {
  if (!Array.isArray(raw)) return [];
  const labelToId = new Map(categories.map((c) => [c.label.toLowerCase(), c.id]));

  return raw
    .filter((c) => c && typeof c === "object")
    .map((c) => {
      const row = c as Partial<Competition> & { category?: string };
      let categoryId = str(row.categoryId, "");
      if (!categoryId && typeof row.category === "string") {
        const legacy = row.category.trim();
        categoryId = labelToId.get(legacy.toLowerCase()) ?? legacy;
      }
      return {
        id: row.id ?? uid("cmp"),
        name: str(row.name, ""),
        date: str(row.date, ""),
        categoryId,
        results: Array.isArray(row.results)
          ? row.results
              .filter((x) => x && typeof x === "object")
              .map((x) => {
                const r = x as Partial<CompetitionAthleteResult>;
                const place = num(r.place, 1);
                const status: CompetitionAthleteResult["status"] =
                  r.status === "skipped" ? "skipped" : "participated";
                return {
                  id: r.id ?? uid("res"),
                  athleteId: str(r.athleteId, ""),
                  athleteName: str(r.athleteName, ""),
                  place: status === "skipped" ? 0 : place,
                  medal: str(r.medal, status === "skipped" ? "—" : medalForPlace(place)),
                  points: typeof r.points === "number" ? r.points : undefined,
                  status,
                  note: r.note?.trim(),
                } satisfies CompetitionAthleteResult;
              })
          : [],
      };
    });
}

function collectEvents(settings: ResultsBoardSettings): ResultEvent[] {
  const events: ResultEvent[] = [];
  const scoring = settings.scoring;

  if (settings.mode === "simple") {
    for (const r of settings.simpleResults) {
      if (!r.athleteName?.trim()) continue;
      const place = r.place > 0 ? r.place : 0;
      events.push({
        athleteKey: athleteKey("", r.athleteName),
        athleteName: r.athleteName,
        athleteId: "",
        place,
        medal: r.medal || medalForPlace(place),
        points: pointsForPlace(place, scoring),
        date: r.date,
        categoryId: r.categoryId ?? "",
        competitionId: r.id,
        skipped: place <= 0,
      });
    }
    return events;
  }

  for (const comp of settings.competitions) {
    if (!comp.name?.trim()) continue;
    for (const r of comp.results) {
      if (!r.athleteName?.trim() && r.status !== "skipped") continue;
      const skipped = r.status === "skipped";
      const place = skipped ? 0 : r.place > 0 ? r.place : 0;
      const pts =
        typeof r.points === "number"
          ? r.points
          : skipped
            ? scoring.skipped
            : pointsForPlace(place, scoring);
      events.push({
        athleteKey: athleteKey(r.athleteId, r.athleteName),
        athleteName: r.athleteName,
        athleteId: r.athleteId,
        place,
        medal: skipped ? "—" : r.medal || medalForPlace(place),
        points: pts,
        date: comp.date,
        categoryId: comp.categoryId,
        competitionId: comp.id,
        skipped,
      });
    }
  }
  return events;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

function monthKey(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return "unknown";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  if (key === "unknown") return "Season";
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function isThisMonth(dateStr: string): boolean {
  const d = parseDate(dateStr);
  if (!d) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function isPrevMonth(dateStr: string): boolean {
  const d = parseDate(dateStr);
  if (!d) return false;
  const now = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth();
}

function recentCompetitionIds(settings: ResultsBoardSettings, limit = 3): Set<string> {
  const ids = [...settings.competitions]
    .filter((c) => c.name?.trim())
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, limit)
    .map((c) => c.id);
  return new Set(ids);
}

export function filterEvents(
  events: ResultEvent[],
  filter: ResultsFilter,
  settings: ResultsBoardSettings,
): ResultEvent[] {
  const recentIds = recentCompetitionIds(settings);
  return events.filter((e) => {
    if (filter.period === "month" && !isThisMonth(e.date)) return false;
    if (filter.period === "recent" && !recentIds.has(e.competitionId)) return false;
    if (filter.categoryId !== "all" && e.categoryId !== filter.categoryId) return false;
    return true;
  });
}

function countMedal(medal: string, place: number) {
  const m = medal.trim();
  if (m === "🥇" || place === 1) return { gold: 1, silver: 0, bronze: 0 };
  if (m === "🥈" || place === 2) return { gold: 0, silver: 1, bronze: 0 };
  if (m === "🥉" || place === 3) return { gold: 0, silver: 0, bronze: 1 };
  return { gold: 0, silver: 0, bronze: 0 };
}

function buildLeaderboard(events: ResultEvent[], settings: ResultsBoardSettings): LeaderboardRow[] {
  const map = new Map<
    string,
    {
      athleteName: string;
      athleteId: string;
      points: number;
      gold: number;
      silver: number;
      bronze: number;
      competitions: number;
      bestPlace: number | null;
      monthPoints: Map<string, number>;
      firstEvent: boolean;
    }
  >();

  for (const e of events) {
    if (e.skipped) continue;
    const cur = map.get(e.athleteKey) ?? {
      athleteName: e.athleteName,
      athleteId: e.athleteId,
      points: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
      competitions: 0,
      bestPlace: null,
      monthPoints: new Map(),
      firstEvent: true,
    };
    cur.firstEvent = false;
    if (!settings.medalsOnly) cur.points += e.points;
    else cur.points += e.place <= 3 ? 4 - e.place : 1;
    const med = countMedal(e.medal, e.place);
    cur.gold += med.gold;
    cur.silver += med.silver;
    cur.bronze += med.bronze;
    cur.competitions += 1;
    if (e.place > 0) cur.bestPlace = cur.bestPlace == null ? e.place : Math.min(cur.bestPlace, e.place);
    const mk = monthKey(e.date);
    cur.monthPoints.set(mk, (cur.monthPoints.get(mk) ?? 0) + e.points);
    map.set(e.athleteKey, cur);
  }

  const rows: LeaderboardRow[] = [...map.entries()].map(([athleteKey, v]) => ({
    athleteKey,
    athleteName: v.athleteName,
    athleteId: v.athleteId,
    rank: 0,
    rankDelta: null,
    totalPoints: v.points,
    gold: v.gold,
    silver: v.silver,
    bronze: v.bronze,
    competitions: v.competitions,
    bestPlace: v.bestPlace,
    progressPercent: 0,
    badges: [],
  }));

  rows.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.bestPlace == null) return 1;
    if (b.bestPlace == null) return -1;
    return a.bestPlace - b.bestPlace;
  });

  const maxPts = rows[0]?.totalPoints ?? 1;
  rows.forEach((r, i) => {
    r.rank = i + 1;
    r.progressPercent = maxPts > 0 ? Math.round((r.totalPoints / maxPts) * 100) : 0;
  });

  if (rows.length === 0) return rows;

  rows[0].badges.push("season_leader");

  const mostActive = [...rows].sort((a, b) => b.competitions - a.competitions)[0];
  if (mostActive?.competitions) mostActive.badges.push("most_active");

  const personalBest = [...rows].filter((r) => r.bestPlace === 1).sort((a, b) => b.totalPoints - a.totalPoints)[0];
  if (personalBest) personalBest.badges.push("personal_best");

  for (const r of rows) {
    if (r.competitions === 1) r.badges.push("first_competition");
    if (r.gold + r.silver + r.bronze > 0) r.badges.push("first_medal");
  }

  const nowKey = monthKey(new Date().toISOString().slice(0, 10));
  const prev = new Date();
  prev.setMonth(prev.getMonth() - 1);
  const prevKey = monthKey(prev.toISOString().slice(0, 10));

  let bestGain = 0;
  let gainer: LeaderboardRow | null = null;
  for (const r of rows) {
    const entry = map.get(r.athleteKey)!;
    const gain = (entry.monthPoints.get(nowKey) ?? 0) - (entry.monthPoints.get(prevKey) ?? 0);
    if (gain > bestGain) {
      bestGain = gain;
      gainer = r;
    }
  }
  if (gainer && bestGain > 0) gainer.badges.push("fast_progress");

  return rows;
}

function attachRankDeltas(current: LeaderboardRow[], previous: LeaderboardRow[]) {
  const prev = new Map(previous.map((r) => [r.athleteKey, r.rank]));
  return current.map((r) => ({
    ...r,
    rankDelta: prev.has(r.athleteKey) ? prev.get(r.athleteKey)! - r.rank : null,
  }));
}

function buildCompetitionSummaries(settings: ResultsBoardSettings, filter: ResultsFilter): CompetitionSummary[] {
  const recentIds = recentCompetitionIds(settings);

  const list =
    settings.mode === "simple"
      ? settings.simpleResults
          .filter((r) => r.competitionName?.trim())
          .reduce<CompetitionSummary[]>((acc, r) => {
            const hit = acc.find((c) => c.name === r.competitionName);
            if (hit) {
              if (r.place > 0) hit.topThree.push({ name: r.athleteName, place: r.place, medal: r.medal });
              hit.athleteCount += 1;
              return acc;
            }
            acc.push({
              id: r.id,
              name: r.competitionName,
              date: r.date,
              categoryLabel: categoryLabel(settings, r.categoryId ?? ""),
              topThree: r.place > 0 ? [{ name: r.athleteName, place: r.place, medal: r.medal }] : [],
              athleteCount: 1,
            });
            return acc;
          }, [])
      : settings.competitions
          .filter((c) => c.name?.trim())
          .map((c) => ({
            id: c.id,
            name: c.name,
            date: c.date,
            categoryLabel: categoryLabel(settings, c.categoryId),
            topThree: c.results
              .filter((r) => r.status === "participated" && r.place > 0)
              .sort((a, b) => a.place - b.place)
              .slice(0, 3)
              .map((r) => ({
                name: r.athleteName,
                place: r.place,
                medal: r.medal,
                athleteId: r.athleteId,
              })),
            athleteCount: c.results.filter((r) => r.status === "participated").length,
          }));

  return list
    .filter((c) => {
      if (filter.period === "month" && !isThisMonth(c.date)) return false;
      if (filter.period === "recent" && !recentIds.has(c.id)) return false;
      if (filter.categoryId !== "all") {
        const comp = settings.competitions.find((x) => x.id === c.id);
        if (comp && comp.categoryId !== filter.categoryId) return false;
      }
      return true;
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .map((c) => ({ ...c, topThree: c.topThree.slice(0, 3) }));
}

function buildMonthly(events: ResultEvent[]): MonthlyProgressRow[] {
  const months = new Map<string, { athletes: Map<string, number>; medals: number }>();
  for (const e of events) {
    if (e.skipped) continue;
    const mk = monthKey(e.date);
    if (!months.has(mk)) months.set(mk, { athletes: new Map(), medals: 0 });
    const bucket = months.get(mk)!;
    bucket.athletes.set(e.athleteName, (bucket.athletes.get(e.athleteName) ?? 0) + e.points);
    const med = countMedal(e.medal, e.place);
    bucket.medals += med.gold + med.silver + med.bronze;
  }
  return [...months.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([monthKeyVal, bucket]) => {
      const byAthlete = [...bucket.athletes.entries()]
        .map(([name, points]) => ({ name, points }))
        .sort((a, b) => b.points - a.points);
      return {
        monthKey: monthKeyVal,
        label: monthLabel(monthKeyVal),
        totalPoints: byAthlete.reduce((s, a) => s + a.points, 0),
        totalMedals: bucket.medals,
        byAthlete,
        topGainer: byAthlete[0] ?? null,
      };
    });
}

function buildInsights(events: ResultEvent[], monthly: MonthlyProgressRow[]): ResultsInsights {
  const counts = new Map<string, number>();
  for (const e of events) {
    if (e.skipped) continue;
    counts.set(e.athleteName, (counts.get(e.athleteName) ?? 0) + 1);
  }
  const sortedCounts = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const mostActive = sortedCounts[0] ? { name: sortedCounts[0][0], count: sortedCounts[0][1] } : null;

  const thisMonthKey = monthKey(new Date().toISOString().slice(0, 10));
  const monthRow = monthly.find((m) => m.monthKey === thisMonthKey);
  const topPointsThisMonth = monthRow?.topGainer ?? null;

  const medalGrowth =
    monthly.length >= 2 ? monthly[monthly.length - 1]!.totalMedals - monthly[monthly.length - 2]!.totalMedals : 0;

  return { mostActive, topPointsThisMonth, medalGrowth };
}

export function computeResultsBoard(
  settings: ResultsBoardSettings,
  filter: ResultsFilter = { categoryId: "all", period: "season" },
): ResultsBoardComputed {
  const synced = syncCategoriesFromData(settings);
  const allEvents = collectEvents(synced);
  const events = filterEvents(allEvents, filter, synced);

  const prevMonthEvents = filterEvents(
    allEvents,
    { categoryId: filter.categoryId, period: "season" },
    synced,
  ).filter((e) => isPrevMonth(e.date));

  const leaderboard = attachRankDeltas(
    buildLeaderboard(events, synced),
    buildLeaderboard(prevMonthEvents, synced),
  );

  const monthly = buildMonthly(
    filterEvents(allEvents, { categoryId: filter.categoryId, period: "season" }, synced),
  );

  return {
    settings: synced,
    filterCategories: mergeCategoryList(synced),
    leaderboard,
    podium: leaderboard.slice(0, 3),
    competitions: buildCompetitionSummaries(synced, filter),
    monthly,
    insights: buildInsights(events, monthly),
    badgeLabels: BADGE_LABELS,
    maxPoints: leaderboard[0]?.totalPoints ?? 1,
  };
}

export function getResultsBoardForBlock(block: BlockInstance, filter?: ResultsFilter): ResultsBoardComputed {
  return computeResultsBoard(getResultsBoardSettings(block), filter);
}

export function duplicateCompetition(comp: Competition): Competition {
  return {
    ...comp,
    id: uid("cmp"),
    name: comp.name ? `${comp.name} (copy)` : "",
    results: comp.results.map((r) => ({ ...r, id: uid("res") })),
  };
}
