import {
  medalForPlace,
  resultsBoardHasContent,
  type ResultsBoardSettings,
} from "@/lib/blocks/results-board";
import type { PaymentStatus, PaymentTrackerRow } from "@/lib/types";

const STATUS_ICON: Record<PaymentStatus, string> = {
  paid: "✅",
  pending: "⏳",
  unpaid: "❌",
};

export type PollVoteSummary = {
  voter_name: string;
  choice: string;
};

function formatShortDate(iso: string): string {
  if (!iso?.trim()) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function ordinal(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "st";
  if (mod10 === 2 && mod100 !== 12) return "nd";
  if (mod10 === 3 && mod100 !== 13) return "rd";
  return "th";
}

function placeLine(place: number, athleteName: string): string {
  return `${medalForPlace(place)} ${athleteName} — ${place}${ordinal(place)}`;
}

type CompSummary = { name: string; date: string; lines: string[] };

function collectCompetitions(settings: ResultsBoardSettings): CompSummary[] {
  const comps: CompSummary[] = [];

  if (settings.mode === "simple") {
    const byKey = new Map<string, CompSummary>();
    for (const r of settings.simpleResults) {
      if (!r.competitionName?.trim() || !r.athleteName?.trim() || r.place <= 0) continue;
      const key = `${r.competitionName}::${r.date}`;
      const hit = byKey.get(key) ?? {
        name: r.competitionName.trim(),
        date: r.date,
        lines: [],
      };
      hit.lines.push(placeLine(r.place, r.athleteName.trim()));
      byKey.set(key, hit);
    }
    comps.push(...byKey.values());
  } else {
    for (const c of settings.competitions) {
      if (!c.name?.trim()) continue;
      const lines = c.results
        .filter((r) => r.status === "participated" && r.athleteName?.trim() && r.place > 0)
        .sort((a, b) => a.place - b.place)
        .slice(0, 6)
        .map((r) => placeLine(r.place, r.athleteName.trim()));
      if (lines.length) comps.push({ name: c.name.trim(), date: c.date, lines });
    }
  }

  return comps.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function buildResultsShareMessage(opts: {
  teamName: string;
  publicUrl?: string;
  settings: ResultsBoardSettings;
}): string | null {
  if (!resultsBoardHasContent(opts.settings)) return null;

  const comps = collectCompetitions(opts.settings).slice(0, 5);
  const lines = [`MyTeamSpace · ${opts.teamName}`, "🏆 Competition results", ""];

  for (const c of comps) {
    const datePart = formatShortDate(c.date);
    lines.push(datePart ? `${c.name} · ${datePart}` : c.name);
    lines.push(...c.lines);
    lines.push("");
  }

  if (opts.publicUrl) lines.push(`Full results: ${opts.publicUrl}`);

  return lines.join("\n").trim();
}

export function buildPaymentsShareMessage(opts: {
  teamName: string;
  rows: PaymentTrackerRow[];
}): string | null {
  if (!opts.rows.length) return null;

  let paid = 0;
  let pending = 0;
  let unpaid = 0;
  for (const r of opts.rows) {
    if (r.status === "paid") paid++;
    else if (r.status === "pending") pending++;
    else unpaid++;
  }

  const byMonth = new Map<string, PaymentTrackerRow[]>();
  for (const row of opts.rows) {
    const key = row.month.trim() || "Fees";
    const list = byMonth.get(key) ?? [];
    list.push(row);
    byMonth.set(key, list);
  }

  const lines = [`MyTeamSpace · ${opts.teamName}`, "💳 Payment status", ""];

  for (const [month, monthRows] of byMonth) {
    lines.push(month);
    for (const r of monthRows) {
      lines.push(`${STATUS_ICON[r.status]} ${r.label.trim()}`);
    }
    lines.push("");
  }

  const parts: string[] = [];
  if (paid) parts.push(`${paid} paid`);
  if (pending) parts.push(`${pending} pending`);
  if (unpaid) parts.push(`${unpaid} unpaid`);
  if (parts.length) lines.push(parts.join(" · "));

  return lines.join("\n").trim();
}

export function buildPollShareMessage(opts: {
  teamName: string;
  publicUrl?: string;
  question: string;
  optionYes: string;
  optionNo: string;
  votes: PollVoteSummary[];
}): string | null {
  if (!opts.votes.length) return null;

  const question = opts.question.trim() || "Poll";
  const yesLabel = opts.optionYes.trim() || "Yes";
  const noLabel = opts.optionNo.trim() || "No";
  const yes = opts.votes.filter((v) => v.choice === "yes");
  const no = opts.votes.filter((v) => v.choice === "no");

  const lines = [`MyTeamSpace · ${opts.teamName}`, `📊 ${question}`, ""];

  if (yes.length) {
    lines.push(`✓ ${yesLabel} (${yes.length}): ${yes.map((v) => v.voter_name).join(", ")}`);
  }
  if (no.length) {
    lines.push(`✗ ${noLabel} (${no.length}): ${no.map((v) => v.voter_name).join(", ")}`);
  }

  if (opts.publicUrl) {
    lines.push("", opts.publicUrl);
  }

  return lines.join("\n").trim();
}
