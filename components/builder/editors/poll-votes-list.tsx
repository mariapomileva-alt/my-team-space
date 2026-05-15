"use client";

import { useEffect, useState } from "react";

type VoteRow = { voter_name: string; choice: string; created_at: string };

export function PollVotesList({ teamId, blockId }: { teamId: string; blockId: string }) {
  const [votes, setVotes] = useState<VoteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/teams/${teamId}/poll-votes?blockId=${encodeURIComponent(blockId)}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as { votes?: VoteRow[] };
        if (!cancelled) setVotes(data.votes ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teamId, blockId]);

  if (loading) return <p className="text-xs text-zinc-400">Loading answers…</p>;
  if (votes.length === 0) return <p className="text-xs text-zinc-500">No votes yet.</p>;

  return (
    <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs">
      {votes.map((v) => (
        <li key={`${v.voter_name}-${v.created_at}`} className="flex justify-between gap-2 rounded-lg bg-white px-2 py-1">
          <span className="font-medium">{v.voter_name}</span>
          <span className={v.choice === "yes" ? "text-emerald-600" : "text-zinc-500"}>
            {v.choice === "yes" ? "✓ In" : "✗ Out"}
          </span>
        </li>
      ))}
    </ul>
  );
}
