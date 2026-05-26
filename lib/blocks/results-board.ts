import { getBlockSettings } from "@/lib/blocks/settings";
import type { BlockInstance, TeamSpace } from "@/lib/types";

export const SPORT_CATEGORIES = [
  "All",
  "Triathlon",
  "Running",
  "Swimming",
  "Cycling",
  "Tennis",
  "Karate",
  "Dance",
  "Other",
] as const;

export type SportCategory = (typeof SPORT_CATEGORIES)[number];

export type ResultsBoardMode = "simple" | "season";

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
  category: SportCategory;
  results: CompetitionAthleteResult[];
};

export type ResultsBoardSettings = {
  enabled: boolean;
  mode: ResultsBoardMode;
  blockTitle: string;
  seasonName: string;
  categories: string[];
  usePointsRating: boolean;
  medalsOnly: boolean;
  scoring: ScoringRules;
  competitions: Competition[];
  simpleResults: SimpleResult[];
};

export type LeaderboardRow = {
  athleteKey: string;
  athleteName: string;
  rank: number;
  totalPoints: number;
  gold: number;
  silver: number;
  bronze: number;
  competitions: number;
  bestPlace: number | null;
  badges: string[];
};

export type CompetitionSummary = {
  id: string;
  name: string;
  date: string;
  category: SportCategory;
  topThree: { name: string; place: number; medal: string }[];
};

export type MonthlyProgressRow = {
  monthKey: string;
  label: string;
  byAthlete: { name: string; points: number }[];
  topGainer: { name: string; points: number } | null;
};

export type ResultsBoardComputed = {
  settings: ResultsBoardSettings;
  leaderboard: LeaderboardRow[];
  podium: LeaderboardRow[];
  competitions: CompetitionSummary[];
  monthly: MonthlyProgressRow[];
  badgeLabels: Record<string, string>;
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
  season_leader: "🏆 Season Leader",
  fast_progress: "🔥 Fast Progress",
  first_medal: "⭐ First Medal",
  most_active: "💪 Most Active",
  best_result: "🎯 Best Result",
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
    categories: ["Triathlon", "Running", "Swimming"],
    usePointsRating: true,
    medalsOnly: false,
    scoring: { ...DEFAULT_SCORING },
    competitions: [],
    simpleResults: [],
  };
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

export function newCompetition(): Competition {
  return {
    id: uid("cmp"),
    name: "",
    date: new Date().toISOString().slice(0, 10),
    category: "All",
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
  place: number;
  medal: string;
  points: number;
  date: string;
  category: SportCategory;
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

/** Merge stored settings with defaults; migrate legacy `items` rows. */
export function getResultsBoardSettings(block: BlockInstance): ResultsBoardSettings {
  const defaults = defaultResultsBoardSettings();
  const raw = getBlockSettings<Record<string, unknown>>(block);

  if (Array.isArray(raw.items) && !raw.competitions && !raw.simpleResults) {
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

  return {
    ...defaults,
    enabled: raw.enabled !== false,
    mode: raw.mode === "simple" ? "simple" : "season",
    blockTitle: str(raw.blockTitle, defaults.blockTitle),
    seasonName: str(raw.seasonName, defaults.seasonName),
    categories: Array.isArray(raw.categories)
      ? raw.categories.filter((c): c is string => typeof c === "string")
      : defaults.categories,
    usePointsRating: raw.usePointsRating !== false,
    medalsOnly: Boolean(raw.medalsOnly),
    scoring: normalizeScoring(raw.scoring),
    competitions: normalizeCompetitions(raw.competitions),
    simpleResults: normalizeSimple(raw.simpleResults),
  };
}

function str(v: unknown, fallback: string) {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
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
      };
    })
    .filter((r) => r.athleteName);
}

function normalizeCompetitions(raw: unknown): Competition[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c) => c && typeof c === "object")
    .map((c) => {
      const row = c as Partial<Competition>;
      return {
        id: row.id ?? uid("cmp"),
        name: str(row.name, ""),
        date: str(row.date, ""),
        category: (SPORT_CATEGORIES.includes(row.category as SportCategory)
          ? row.category
          : "Other") as SportCategory,
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
              .filter((r) => r.athleteName)
          : [],
      };
    })
    .filter((c) => c.name);
}

function collectEvents(settings: ResultsBoardSettings): ResultEvent[] {
  const events: ResultEvent[] = [];
  const scoring = settings.scoring;

  if (settings.mode === "simple") {
    for (const r of settings.simpleResults) {
      const place = r.place > 0 ? r.place : 0;
      events.push({
        athleteKey: athleteKey("", r.athleteName),
        athleteName: r.athleteName,
        place,
        medal: r.medal || medalForPlace(place),
        points: pointsForPlace(place, scoring),
        date: r.date,
        category: "All",
        competitionId: r.id,
        skipped: place <= 0,
      });
    }
    return events;
  }

  for (const comp of settings.competitions) {
    for (const r of comp.results) {
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
        place,
        medal: skipped ? "—" : r.medal || medalForPlace(place),
        points: pts,
        date: comp.date,
        category: comp.category,
        competitionId: comp.id,
        skipped,
      });
    }
  }
  return events;
}

function monthKey(dateStr: string): string {
  if (!dateStr) return "unknown";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "unknown";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  if (key === "unknown") return "Season";
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function isThisMonth(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export type ResultsFilter = {
  category: SportCategory | "All";
  period: "season" | "month";
};

export function filterEvents(events: ResultEvent[], filter: ResultsFilter): ResultEvent[] {
  return events.filter((e) => {
    if (filter.period === "month" && !isThisMonth(e.date)) return false;
    if (filter.category !== "All" && e.category !== "All" && e.category !== filter.category) return false;
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
      points: number;
      gold: number;
      silver: number;
      bronze: number;
      competitions: number;
      bestPlace: number | null;
      monthPoints: Map<string, number>;
    }
  >();

  for (const e of events) {
    if (e.skipped) continue;
    const cur = map.get(e.athleteKey) ?? {
      athleteName: e.athleteName,
      points: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
      competitions: 0,
      bestPlace: null,
      monthPoints: new Map(),
    };
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
    rank: 0,
    totalPoints: v.points,
    gold: v.gold,
    silver: v.silver,
    bronze: v.bronze,
    competitions: v.competitions,
    bestPlace: v.bestPlace,
    badges: [],
  }));

  rows.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.bestPlace == null) return 1;
    if (b.bestPlace == null) return -1;
    return a.bestPlace - b.bestPlace;
  });
  rows.forEach((r, i) => {
    r.rank = i + 1;
  });

  if (rows.length === 0) return rows;

  const leader = rows[0];
  leader.badges.push("season_leader");

  const mostActive = [...rows].sort((a, b) => b.competitions - a.competitions)[0];
  if (mostActive && mostActive.competitions > 0) mostActive.badges.push("most_active");

  const bestResult = [...rows].filter((r) => r.bestPlace != null).sort((a, b) => a.bestPlace! - b.bestPlace!)[0];
  if (bestResult) bestResult.badges.push("best_result");

  for (const r of rows) {
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
    const cur = entry.monthPoints.get(nowKey) ?? 0;
    const last = entry.monthPoints.get(prevKey) ?? 0;
    const gain = cur - last;
    if (gain > bestGain) {
      bestGain = gain;
      gainer = r;
    }
  }
  if (gainer && bestGain > 0) gainer.badges.push("fast_progress");

  return rows;
}

function buildCompetitionSummaries(settings: ResultsBoardSettings): CompetitionSummary[] {
  if (settings.mode === "simple") {
    const byComp = new Map<string, CompetitionSummary>();
    for (const r of settings.simpleResults) {
      const key = r.competitionName || "Competition";
      let c = byComp.get(key);
      if (!c) {
        c = { id: key, name: key, date: r.date, category: "All", topThree: [] };
        byComp.set(key, c);
      }
      if (r.place > 0) {
        c.topThree.push({ name: r.athleteName, place: r.place, medal: r.medal });
      }
    }
    return [...byComp.values()]
      .map((c) => ({
        ...c,
        topThree: c.topThree.sort((a, b) => a.place - b.place).slice(0, 3),
      }))
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }

  return [...settings.competitions]
    .map((c) => ({
      id: c.id,
      name: c.name,
      date: c.date,
      category: c.category,
      topThree: c.results
        .filter((r) => r.status === "participated" && r.place > 0)
        .sort((a, b) => a.place - b.place)
        .slice(0, 3)
        .map((r) => ({ name: r.athleteName, place: r.place, medal: r.medal })),
    }))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

function buildMonthly(events: ResultEvent[]): MonthlyProgressRow[] {
  const months = new Map<string, Map<string, number>>();
  for (const e of events) {
    if (e.skipped) continue;
    const mk = monthKey(e.date);
    if (!months.has(mk)) months.set(mk, new Map());
    const athletes = months.get(mk)!;
    athletes.set(e.athleteName, (athletes.get(e.athleteName) ?? 0) + e.points);
  }
  return [...months.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([monthKeyVal, athletes]) => {
      const byAthlete = [...athletes.entries()]
        .map(([name, points]) => ({ name, points }))
        .sort((a, b) => b.points - a.points);
      return {
        monthKey: monthKeyVal,
        label: monthLabel(monthKeyVal),
        byAthlete,
        topGainer: byAthlete[0] ?? null,
      };
    });
}

export function computeResultsBoard(
  settings: ResultsBoardSettings,
  filter: ResultsFilter = { category: "All", period: "season" },
): ResultsBoardComputed {
  const allEvents = collectEvents(settings);
  const events = filterEvents(allEvents, filter);
  const leaderboard = buildLeaderboard(events, settings);
  return {
    settings,
    leaderboard,
    podium: leaderboard.slice(0, 3),
    competitions: buildCompetitionSummaries(settings),
    monthly: buildMonthly(filterEvents(allEvents, { ...filter, period: "season" })),
    badgeLabels: BADGE_LABELS,
  };
}

export function getResultsBoardForBlock(
  block: BlockInstance,
  filter?: ResultsFilter,
): ResultsBoardComputed {
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
