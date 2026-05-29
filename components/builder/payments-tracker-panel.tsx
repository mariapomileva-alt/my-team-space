"use client";

import {
  BUILDER_FIELD_INPUT,
  BUILDER_PANEL_SURFACE,
  BUILDER_RADIUS_CHOICE,
} from "@/lib/builder/layout";
import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import { cn } from "@/lib/utils/cn";
import type { PaymentStatus, PaymentTrackerRow, TeamSpace } from "@/lib/types";

function uid() {
  return `pay_${Math.random().toString(36).slice(2, 9)}`;
}

const STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  unpaid: "Unpaid",
};

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
    setRows([
      ...rows,
      { id: uid(), label: "Athlete name", month: "September", status: "pending", note: "" },
    ]);
  }

  function update(id: string, patch: Partial<PaymentTrackerRow>) {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function remove(id: string) {
    setRows(rows.filter((r) => r.id !== id));
  }

  return (
    <BuilderCollapsiblePanel
      className={`${BUILDER_PANEL_SURFACE} border-amber-200/60 bg-gradient-to-br from-orange-50/50 via-amber-50/25 to-white shadow-[0_4px_32px_-16px_rgba(251,146,60,0.1)]`}
      title="Payments tracker"
      description="Coach-only. Track paid / pending — paste Revolut or Stripe links in messages, not here."
      summary={
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
          {rows.length ? `${rows.length} row${rows.length === 1 ? "" : "s"}` : "Empty"}
        </span>
      }
      headerRight={
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
          Not public
        </span>
      }
    >
      <ul className="space-y-2">
        {rows.length === 0 ? (
          <li className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">
            Add rows for monthly fees — Emma paid, Noah pending…
          </li>
        ) : (
          rows.map((row) => (
            <li
              key={row.id}
              className={cn(
                "grid gap-2 border border-zinc-100 bg-white p-3 sm:grid-cols-[1fr_auto_auto]",
                BUILDER_RADIUS_CHOICE,
              )}
            >
              <input
                className={BUILDER_FIELD_INPUT}
                value={row.label}
                onChange={(e) => update(row.id, { label: e.target.value })}
                placeholder="Name"
              />
              <input
                className={BUILDER_FIELD_INPUT}
                value={row.month}
                onChange={(e) => update(row.id, { month: e.target.value })}
                placeholder="Month"
              />
              <div className="flex gap-2">
                <select
                  className={cn("min-w-0 flex-1", BUILDER_FIELD_INPUT)}
                  value={row.status}
                  onChange={(e) => update(row.id, { status: e.target.value as PaymentStatus })}
                >
                  {(Object.keys(STATUS_LABELS) as PaymentStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  className="rounded-lg px-2 text-zinc-400 hover:text-red-600"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 w-full rounded-xl border border-dashed border-zinc-300 py-2 text-sm font-semibold text-zinc-600"
      >
        + Add row
      </button>
    </BuilderCollapsiblePanel>
  );
}
