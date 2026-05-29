"use client";

import {
  BUILDER_FIELD_INPUT,
  BUILDER_PANEL_SURFACE,
  BUILDER_RADIUS_CHOICE,
} from "@/lib/builder/layout";
import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import { cn } from "@/lib/utils/cn";
import type { PaymentStatus, PaymentTrackerRow, TeamSpace } from "@/lib/types";
import { useMemo } from "react";

function uid() {
  return `pay_${Math.random().toString(36).slice(2, 9)}`;
}

const STATUS_ICON: Record<PaymentStatus, string> = {
  paid: "✅",
  pending: "⏳",
  unpaid: "❌",
};

const STATUS_CYCLE: PaymentStatus[] = ["paid", "pending", "unpaid"];

function nextStatus(current: PaymentStatus): PaymentStatus {
  const i = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length];
}

export function PaymentsTrackerPanel({
  team,
  onPatchTeam,
}: {
  team: TeamSpace;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
}) {
  const rows = team.pageSettings?.payments ?? [];

  function setRows(next: PaymentTrackerRow[]) {
    onPatchTeam({ pageSettings: { ...team.pageSettings, payments: next } });
  }

  function addRow() {
    const month = new Date().toLocaleString("en-US", { month: "long" });
    setRows([...rows, { id: uid(), label: "Athlete name", month, status: "pending", note: "" }]);
  }

  function update(id: string, patch: Partial<PaymentTrackerRow>) {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function remove(id: string) {
    setRows(rows.filter((r) => r.id !== id));
  }

  const summary = useMemo(() => {
    let paid = 0;
    let pending = 0;
    let unpaid = 0;
    for (const r of rows) {
      if (r.status === "paid") paid++;
      else if (r.status === "pending") pending++;
      else unpaid++;
    }
    return { paid, pending, unpaid };
  }, [rows]);

  const byMonth = useMemo(() => {
    const map = new Map<string, PaymentTrackerRow[]>();
    for (const row of rows) {
      const key = row.month.trim() || "No month";
      const list = map.get(key) ?? [];
      list.push(row);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [rows]);

  return (
    <BuilderCollapsiblePanel
      className={`${BUILDER_PANEL_SURFACE} border-amber-200/50 bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20`}
      title="Payments tracker"
      description="Optional coach tool — never shown on your public team page."
      summary={
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
          {rows.length ? `${summary.paid} paid` : "Empty"}
        </span>
      }
      headerRight={
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
          Coach only
        </span>
      }
      defaultExpanded={false}
    >
      {rows.length > 0 ? (
        <div className="mb-4 grid grid-cols-3 gap-2">
          {(
            [
              { label: "Paid", value: summary.paid, tone: "bg-emerald-50 text-emerald-800 ring-emerald-100" },
              { label: "Pending", value: summary.pending, tone: "bg-amber-50 text-amber-900 ring-amber-100" },
              { label: "Unpaid", value: summary.unpaid, tone: "bg-rose-50 text-rose-800 ring-rose-100" },
            ] as const
          ).map((card) => (
            <div
              key={card.label}
              className={cn("rounded-xl px-3 py-3 text-center ring-1", card.tone, BUILDER_RADIUS_CHOICE)}
            >
              <p className="text-2xl font-bold tabular-nums">{card.value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{card.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-200/80 bg-amber-50/30 px-4 py-8 text-center">
          <p className="text-sm font-semibold text-zinc-800">Track monthly fees at a glance</p>
          <p className="mt-1 text-xs text-zinc-500">Tap status icons to mark paid, pending, or unpaid.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {byMonth.map(([month, monthRows]) => (
            <section key={month}>
              <h3 className="text-sm font-bold text-zinc-900">{month}</h3>
              <ul className="mt-2 space-y-1.5">
                {monthRows.map((row) => (
                  <li
                    key={row.id}
                    className={cn(
                      "group flex items-center gap-2 border border-zinc-100 bg-white px-3 py-2.5",
                      BUILDER_RADIUS_CHOICE,
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => update(row.id, { status: nextStatus(row.status) })}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition hover:bg-zinc-50 active:scale-95"
                      title="Tap to change status"
                      aria-label={`Status: ${row.status}. Tap to change.`}
                    >
                      {STATUS_ICON[row.status]}
                    </button>
                    <input
                      className={cn(BUILDER_FIELD_INPUT, "min-w-0 flex-1 border-0 bg-transparent px-0 py-1 shadow-none focus:ring-0")}
                      value={row.label}
                      onChange={(e) => update(row.id, { label: e.target.value })}
                      placeholder="Athlete name"
                    />
                    <input
                      className={cn(
                        BUILDER_FIELD_INPUT,
                        "hidden w-24 border-0 bg-transparent px-0 py-1 text-xs text-zinc-400 shadow-none focus:ring-0 sm:block",
                      )}
                      value={row.month}
                      onChange={(e) => update(row.id, { month: e.target.value })}
                      placeholder="Month"
                      aria-label="Month"
                    />
                    <button
                      type="button"
                      onClick={() => remove(row.id)}
                      className="rounded-lg px-2 py-1 text-zinc-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addRow}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.99]"
      >
        <span aria-hidden>➕</span>
        Add athlete
      </button>
    </BuilderCollapsiblePanel>
  );
}
