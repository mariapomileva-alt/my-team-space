"use client";

import { useEffect, useState } from "react";

export function CampTripConfirm({ eventId, title }: { eventId: string; title: string }) {
  const key = `mts_confirm_${eventId}`;
  const [status, setStatus] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    const v = localStorage.getItem(key);
    if (v === "yes" || v === "no") setStatus(v);
  }, [key]);

  function choose(v: "yes" | "no") {
    localStorage.setItem(key, v);
    setStatus(v);
  }

  if (status) {
    return (
      <p className="mt-2 text-xs font-semibold text-emerald-700">
        {status === "yes" ? "✓ Confirmed" : "Declined"} — coach will see in admin soon
      </p>
    );
  }

  return (
    <div className="mt-3 flex gap-2">
      <button
        type="button"
        onClick={() => choose("yes")}
        className="min-h-10 flex-1 rounded-xl bg-[var(--mts-primary)] text-xs font-semibold text-white"
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={() => choose("no")}
        className="min-h-10 flex-1 rounded-xl border border-[color:var(--mts-card-border)] text-xs font-semibold"
      >
        Can&apos;t go
      </button>
    </div>
  );
}
