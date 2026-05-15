"use client";

import type { BlockInstance, TeamSpace } from "@/lib/types";
import { getBlockSettings, newRosterPlayer, type RosterPlayer } from "@/lib/blocks/settings";

type Settings = { roster: RosterPlayer[] };

export function RosterEditor({
  block,
  team,
  onPatchBlock,
}: {
  block: BlockInstance;
  team: TeamSpace;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const rosterBlock =
    block.type === "attendance"
      ? block
      : team.blocks.find((b) => b.type === "attendance") ?? block;
  const s = getBlockSettings<Settings>(rosterBlock);
  const roster = s.roster ?? [];

  function setRoster(next: RosterPlayer[]) {
    onPatchBlock(rosterBlock.id, { settings: { ...s, roster: next } });
  }

  function update(id: string, patch: Partial<RosterPlayer>) {
    setRoster(roster.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">
        Optional roster unlocks attendance, birthdays, and player pickers. Paste CSV later — for now add manually.
      </p>
      {roster.map((p) => (
        <div key={p.id} className="grid gap-2 rounded-xl border border-zinc-200 bg-white p-3 sm:grid-cols-3">
          <input
            className="rounded-lg border border-zinc-100 px-2 py-1.5 text-sm"
            placeholder="Name"
            value={p.name}
            onChange={(e) => update(p.id, { name: e.target.value })}
          />
          <input
            className="rounded-lg border border-zinc-100 px-2 py-1.5 text-sm"
            placeholder="Age"
            value={p.age ?? ""}
            onChange={(e) => update(p.id, { age: e.target.value })}
          />
          <input
            className="rounded-lg border border-zinc-100 px-2 py-1.5 text-sm"
            placeholder="Role / group"
            value={p.role ?? ""}
            onChange={(e) => update(p.id, { role: e.target.value })}
          />
          <button
            type="button"
            className="text-left text-xs text-red-600 sm:col-span-3"
            onClick={() => setRoster(roster.filter((x) => x.id !== p.id))}
          >
            Remove player
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-full border border-dashed border-indigo-300 px-4 py-2 text-xs font-semibold text-indigo-700"
        onClick={() => setRoster([...roster, newRosterPlayer()])}
      >
        + Add player
      </button>
    </div>
  );
}
