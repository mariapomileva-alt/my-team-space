"use client";

import { ResultsBoardView } from "@/components/results/results-board-view";
import { WhatsAppShareButton } from "@/components/shared/whatsapp-share-button";
import { rosterFromTeam } from "@/lib/blocks/roster";
import { CategoryPicker, ResultsCategoryEditor } from "@/components/builder/editors/results-category-editor";
import {
  categoryLabel,
  DEFAULT_SCORING,
  duplicateCompetition,
  getResultsBoardSettings,
  medalForPlace,
  newCompetition,
  newCompetitionResult,
  newSimpleResult,
  pointsForPlace,
  resultsBoardHasContent,
  type Competition,
  type ResultsBoardSettings,
  type ScoringRules,
  type SimpleResult,
} from "@/lib/blocks/results-board";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { buildResultsShareMessage } from "@/lib/whatsapp-summaries";
import { useEffect, useMemo, useState } from "react";

type Tab = "setup" | "competitions" | "scoring" | "preview";

const TABS: { id: Tab; label: string }[] = [
  { id: "setup", label: "Setup" },
  { id: "competitions", label: "Competitions" },
  { id: "scoring", label: "Scoring" },
  { id: "preview", label: "Preview" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{children}</label>;
}

function inputClass() {
  return "mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
}

export function ResultsBoardEditor({
  block,
  team,
  onPatchBlock,
}: {
  block: BlockInstance;
  team: TeamSpace;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const [tab, setTab] = useState<Tab>("competitions");
  const [openComp, setOpenComp] = useState<Set<string>>(() => new Set());
  const [draft, setDraft] = useState<ResultsBoardSettings>(() => getResultsBoardSettings(block));
  const roster = rosterFromTeam(team);

  useEffect(() => {
    setDraft(getResultsBoardSettings(block));
  }, [block.id]);

  function save(patch: Partial<ResultsBoardSettings>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      const persisted = { ...next } as ResultsBoardSettings & { items?: unknown };
      delete persisted.items;
      onPatchBlock(block.id, { settings: persisted });
      return next;
    });
  }

  function toggleComp(id: string) {
    setOpenComp((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const previewBlock = useMemo(() => ({ ...block, settings: draft }), [block, draft]);

  const resultsShareMessage = useMemo(() => {
    const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${team.slug}` : undefined;
    return buildResultsShareMessage({
      teamName: team.name,
      publicUrl,
      settings: draft,
    });
  }, [draft, team.name, team.slug]);

  return (
    <div className="relative z-20 space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 flex-wrap gap-1 rounded-2xl bg-zinc-100/80 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition sm:text-xs ${
              tab === t.id ? "bg-white text-indigo-700 shadow-sm" : "text-zinc-600"
            }`}
          >
            {t.label}
          </button>
        ))}
        </div>
        <WhatsAppShareButton
          message={resultsShareMessage}
          label="Share in WhatsApp"
          size="compact"
          disabledReason={
            resultsBoardHasContent(draft) ? undefined : "Add results first — then share with parents."
          }
        />
      </div>

      {tab === "setup" ? (
        <div className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-4">
          <p className="text-xs text-zinc-500">
            Measurable competition results — separate from emotional Achievement cards.
          </p>
          <div>
            <FieldLabel>Block title</FieldLabel>
            <input className={inputClass()} value={draft.blockTitle} onChange={(e) => save({ blockTitle: e.target.value })} />
          </div>
          <div>
            <FieldLabel>Mode</FieldLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  { id: "simple" as const, label: "Simple", hint: "One-off results" },
                  { id: "season" as const, label: "Season", hint: "Full season ranking" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => save({ mode: m.id })}
                  className={`rounded-xl border px-3 py-2 text-left text-xs ${
                    draft.mode === m.id ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100" : "border-zinc-200"
                  }`}
                >
                  <span className="font-semibold">{m.label}</span>
                  <span className="mt-0.5 block text-zinc-500">{m.hint}</span>
                </button>
              ))}
            </div>
          </div>
          {draft.mode === "season" ? (
            <>
              <div>
                <FieldLabel>Season name</FieldLabel>
                <input
                  className={inputClass()}
                  placeholder="2026 Season"
                  value={draft.seasonName}
                  onChange={(e) => save({ seasonName: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>Your categories</FieldLabel>
                <ResultsCategoryEditor settings={draft} onSave={save} />
              </div>
            </>
          ) : null}
          <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-3">
            <label className="flex items-start gap-2 text-sm text-zinc-800">
              <input
                type="checkbox"
                className="mt-1 rounded"
                checked={draft.seasonTimeline}
                onChange={(e) => save({ seasonTimeline: e.target.checked })}
              />
              <span>
                <span className="font-semibold">Season timeline</span>
                <span className="mt-0.5 block text-xs font-normal text-zinc-600">
                  Optional “season memories” tab — chronological story of competitions, medals, and rank changes.
                </span>
              </span>
            </label>
            {draft.seasonTimeline ? (
              <div className="mt-3">
                <FieldLabel>Timeline title</FieldLabel>
                <input
                  className={inputClass()}
                  placeholder="Season memories"
                  value={draft.timelineTitle}
                  onChange={(e) => save({ timelineTitle: e.target.value })}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "competitions" ? (
        <div className="relative z-10 space-y-3">
          {draft.mode === "simple" ? (
            <>
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-900 ring-1 ring-amber-100">
                Simple mode — for a full season table with auto points, switch to <strong>Season</strong> in the
                Setup tab.
              </p>
              <SimpleResultsEditor settings={draft} roster={roster} onSave={save} />
            </>
          ) : (
            <SeasonCompetitionsEditor
              settings={draft}
              roster={roster}
              openComp={openComp}
              onToggleComp={toggleComp}
              onSave={save}
            />
          )}
        </div>
      ) : null}

      {tab === "scoring" ? (
        <ScoringEditor settings={draft} onSave={save} />
      ) : null}

      {tab === "preview" ? (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-white p-3 sm:p-4">
          <p className="mb-3 text-xs text-zinc-500">Live preview — same layout as the published team page.</p>
          <div className="max-h-[min(70vh,640px)] overflow-y-auto rounded-xl bg-[color:var(--mts-bg,#f8fafc)] p-3 ring-1 ring-zinc-100">
            <ResultsBoardView block={previewBlock} team={team} celebrate={false} settings={draft} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SimpleResultsEditor({
  settings: s,
  roster,
  onSave,
}: {
  settings: ResultsBoardSettings;
  roster: { id: string; name: string }[];
  onSave: (p: Partial<ResultsBoardSettings>) => void;
}) {
  const rows = s.simpleResults;

  function update(id: string, patch: Partial<SimpleResult>) {
    onSave({ simpleResults: rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  }

  return (
    <>
      <p className="text-xs text-zinc-500">Quick rows for a single event or highlight.</p>
      {rows.map((row) => (
        <div key={row.id} className="space-y-2 rounded-2xl border border-orange-100 bg-orange-50/30 p-4">
          <input
            className={inputClass()}
            placeholder="Competition name"
            value={row.competitionName}
            onChange={(e) => update(row.id, { competitionName: e.target.value })}
          />
          <input
            type="date"
            className={inputClass()}
            value={row.date}
            onChange={(e) => update(row.id, { date: e.target.value })}
          />
          {roster.length > 0 ? (
            <select
              className={inputClass()}
              value={row.athleteName}
              onChange={(e) => update(row.id, { athleteName: e.target.value })}
            >
              <option value="">Athlete</option>
              {roster.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              className={inputClass()}
              placeholder="Athlete name"
              value={row.athleteName}
              onChange={(e) => update(row.id, { athleteName: e.target.value })}
            />
          )}
          <div className="grid grid-cols-2 gap-2">
            <select
              className={inputClass()}
              value={row.place || 1}
              onChange={(e) => {
                const place = parseInt(e.target.value, 10) || 1;
                update(row.id, { place, medal: medalForPlace(place) });
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                <option key={p} value={p}>
                  {p === 1 ? "1st" : p === 2 ? "2nd" : p === 3 ? "3rd" : `${p}th`} place
                </option>
              ))}
            </select>
            <span className="flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-lg">
              {medalForPlace(row.place || 1)}
            </span>
          </div>
          <button
            type="button"
            className="text-xs text-red-600"
            onClick={() => onSave({ simpleResults: rows.filter((r) => r.id !== row.id) })}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="w-full rounded-xl border border-dashed border-indigo-300 py-2.5 text-xs font-semibold text-indigo-700"
        onClick={() => onSave({ simpleResults: [...rows, newSimpleResult()] })}
      >
        + Add result
      </button>
    </>
  );
}

function SeasonCompetitionsEditor({
  settings: s,
  roster,
  openComp,
  onToggleComp,
  onSave,
}: {
  settings: ResultsBoardSettings;
  roster: { id: string; name: string }[];
  openComp: Set<string>;
  onToggleComp: (id: string) => void;
  onSave: (p: Partial<ResultsBoardSettings>) => void;
}) {
  const comps = s.competitions;

  function setComps(next: Competition[]) {
    onSave({ competitions: next });
  }

  function updateComp(id: string, patch: Partial<Competition>) {
    setComps(comps.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <>
      <p className="text-xs text-zinc-500">
        Add each competition once, then add every athlete who took part. Points are calculated automatically.
      </p>
      {comps.map((comp) => {
        const open = openComp.has(comp.id);
        return (
          <div key={comp.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
              onClick={() => onToggleComp(comp.id)}
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-zinc-900">{comp.name || "New competition"}</p>
                <p className="text-[11px] text-zinc-500">
                  {comp.date || "No date"} · {categoryLabel(s, comp.categoryId)} · {comp.results.length} athletes
                </p>
              </div>
              <span className="text-zinc-400">{open ? "▾" : "▸"}</span>
            </button>
            {open ? (
              <div className="space-y-3 border-t border-zinc-100 px-4 pb-4 pt-3">
                <input
                  className={inputClass()}
                  placeholder="Competition name"
                  value={comp.name}
                  onChange={(e) => updateComp(comp.id, { name: e.target.value })}
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="date"
                    className={inputClass()}
                    value={comp.date}
                    onChange={(e) => updateComp(comp.id, { date: e.target.value })}
                  />
                  <CategoryPicker
                    settings={s}
                    value={comp.categoryId}
                    onChange={(categoryId) => updateComp(comp.id, { categoryId })}
                    onSaveCategories={(categories) => onSave({ categories })}
                  />
                </div>
                {comp.results.map((r) => (
                  <AthleteResultRow
                    key={r.id}
                    result={r}
                    roster={roster}
                    scoring={s.scoring}
                    onChange={(patch) =>
                      updateComp(comp.id, {
                        results: comp.results.map((x) => (x.id === r.id ? { ...x, ...patch } : x)),
                      })
                    }
                    onRemove={() =>
                      updateComp(comp.id, { results: comp.results.filter((x) => x.id !== r.id) })
                    }
                  />
                ))}
                <button
                  type="button"
                  className="w-full rounded-xl border border-dashed border-zinc-300 py-2 text-xs font-semibold text-zinc-700"
                  onClick={() =>
                    updateComp(comp.id, { results: [...comp.results, newCompetitionResult()] })
                  }
                >
                  + Add athlete result
                </button>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    className="text-xs font-semibold text-indigo-600"
                    onClick={() => setComps([...comps, duplicateCompetition(comp)])}
                  >
                    Duplicate structure
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => setComps(comps.filter((c) => c.id !== comp.id))}
                  >
                    Delete competition
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
      <button
        type="button"
        className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-md"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const c = newCompetition();
          const next = [c, ...comps];
          setComps(next);
          onToggleComp(c.id);
        }}
      >
        + Add competition
      </button>
    </>
  );
}

function AthleteResultRow({
  result: r,
  roster,
  scoring,
  onChange,
  onRemove,
}: {
  result: import("@/lib/blocks/results-board").CompetitionAthleteResult;
  roster: { id: string; name: string }[];
  scoring: ScoringRules;
  onChange: (p: Partial<import("@/lib/blocks/results-board").CompetitionAthleteResult>) => void;
  onRemove: () => void;
}) {
  const skipped = r.status === "skipped";
  const autoPts = skipped ? scoring.skipped : pointsForPlace(r.place, scoring);

  return (
    <div className="rounded-xl bg-zinc-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 text-[11px] text-zinc-600">
          <input
            type="checkbox"
            checked={skipped}
            onChange={(e) =>
              onChange({
                status: e.target.checked ? "skipped" : "participated",
                place: e.target.checked ? 0 : 1,
                medal: e.target.checked ? "—" : medalForPlace(1),
              })
            }
          />
          Did not participate
        </label>
        <button type="button" className="ml-auto text-[11px] text-red-600" onClick={onRemove}>
          Remove
        </button>
      </div>
      {!skipped ? (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {roster.length > 0 ? (
            <select
              className={inputClass()}
              value={r.athleteId || r.athleteName}
              onChange={(e) => {
                const p = roster.find((x) => x.id === e.target.value || x.name === e.target.value);
                onChange({ athleteId: p?.id ?? "", athleteName: p?.name ?? e.target.value });
              }}
            >
              <option value="">Select athlete</option>
              {roster.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              className={inputClass()}
              placeholder="Athlete name"
              value={r.athleteName}
              onChange={(e) => onChange({ athleteName: e.target.value })}
            />
          )}
          <select
            className={inputClass()}
            value={r.place || 1}
            onChange={(e) => {
              const place = parseInt(e.target.value, 10) || 1;
              onChange({ place, medal: medalForPlace(place) });
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
              <option key={p} value={p}>
                {p === 1 ? "1st" : p === 2 ? "2nd" : p === 3 ? "3rd" : `${p}th`} · {medalForPlace(p)}
              </option>
            ))}
          </select>
          <span className="flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-lg">
            {medalForPlace(r.place || 1)}
          </span>
          <input
            type="number"
            className={inputClass()}
            placeholder={`Auto: ${autoPts} pts`}
            value={r.points ?? ""}
            onChange={(e) =>
              onChange({ points: e.target.value === "" ? undefined : parseInt(e.target.value, 10) || 0 })
            }
          />
        </div>
      ) : null}
    </div>
  );
}

function ScoringEditor({
  settings: s,
  onSave,
}: {
  settings: ResultsBoardSettings;
  onSave: (p: Partial<ResultsBoardSettings>) => void;
}) {
  const scoring = s.scoring;

  function setScoring(patch: Partial<ScoringRules>) {
    onSave({ scoring: { ...scoring, ...patch } });
  }

  const rows: { key: keyof ScoringRules; label: string }[] = [
    { key: "first", label: "1st place" },
    { key: "second", label: "2nd place" },
    { key: "third", label: "3rd place" },
    { key: "fourth", label: "4th place" },
    { key: "fifth", label: "5th place" },
    { key: "sixth", label: "6th place" },
    { key: "other", label: "7th+ place" },
    { key: "skipped", label: "Did not participate" },
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-4">
      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={s.usePointsRating}
          onChange={(e) => onSave({ usePointsRating: e.target.checked, medalsOnly: false })}
        />
        Use points rating (recommended)
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={s.medalsOnly}
          onChange={(e) => onSave({ medalsOnly: e.target.checked, usePointsRating: !e.target.checked })}
        />
        Medals only (no points table)
      </label>
      <p className="text-xs text-zinc-500">Default season scoring — edit anytime.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {rows.map(({ key, label }) => (
          <div key={key}>
            <FieldLabel>{label}</FieldLabel>
            <input
              type="number"
              min={0}
              className={inputClass()}
              value={scoring[key]}
              onChange={(e) => setScoring({ [key]: parseInt(e.target.value, 10) || 0 })}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="text-xs font-semibold text-indigo-600"
        onClick={() => onSave({ scoring: { ...DEFAULT_SCORING } })}
      >
        Reset to defaults
      </button>
    </div>
  );
}
