"use client";

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
    <section className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">Payments tracker</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Coach-only. Track paid / pending — paste Revolut or Stripe links in messages, not here.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
          Not public
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {rows.length === 0 ? (
          <li className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500">
            Add rows for monthly fees — Emma paid, Noah pending…
          </li>
        ) : (
          rows.map((row) => (
            <li
              key={row.id}
              className="grid gap-2 rounded-xl border border-zinc-100 bg-white p-3 sm:grid-cols-[1fr_auto_auto]"
            >
              <input
                className="rounded-lg border border-zinc-100 px-2 py-1.5 text-sm"
                value={row.label}
                onChange={(e) => update(row.id, { label: e.target.value })}
                placeholder="Name"
              />
              <input
                className="rounded-lg border border-zinc-100 px-2 py-1.5 text-sm"
                value={row.month}
                onChange={(e) => update(row.id, { month: e.target.value })}
                placeholder="Month"
              />
              <div className="flex gap-2">
                <select
                  className="min-w-0 flex-1 rounded-lg border border-zinc-100 px-2 py-1.5 text-sm"
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
    </section>
  );
}
