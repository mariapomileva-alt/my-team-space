"use client";

import type { BlockInstance, TeamSpace } from "@/lib/types";
import {
  ACHIEVEMENT_ICONS,
  getBlockSettings,
  newAchievementCard,
  type AchievementCard,
} from "@/lib/blocks/settings";

type Settings = { cards: AchievementCard[]; roster?: { id: string; name: string }[] };

function rosterFromTeam(team: TeamSpace): { id: string; name: string }[] {
  const att = team.blocks.find((b) => b.type === "attendance");
  const roster = (att?.settings?.roster as { id: string; name: string }[] | undefined) ?? [];
  return roster.filter((p) => p.name?.trim());
}

export function AchievementsEditor({
  block,
  team,
  onPatchBlock,
}: {
  block: BlockInstance;
  team: TeamSpace;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<Settings>(block);
  const cards = s.cards ?? [];
  const roster = rosterFromTeam(team);

  function set(patch: Partial<Settings>) {
    onPatchBlock(block.id, { settings: { ...s, ...patch } });
  }

  function updateCard(id: string, patch: Partial<AchievementCard>) {
    set({ cards: cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">Collectible cards kids love — pick an icon and highlight a player.</p>
      {cards.map((card) => (
        <div
          key={card.id}
          className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm"
        >
          <div className="flex flex-wrap gap-1">
            {ACHIEVEMENT_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => updateCard(card.id, { icon })}
                className={`rounded-lg px-2 py-1 text-lg ${card.icon === icon ? "bg-amber-200 ring-2 ring-amber-400" : "bg-white"}`}
              >
                {icon}
              </button>
            ))}
          </div>
          <input
            className="mt-2 w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm font-semibold"
            placeholder="Achievement title"
            value={card.title}
            onChange={(e) => updateCard(card.id, { title: e.target.value })}
          />
          {roster.length > 0 ? (
            <select
              className="mt-2 w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
              value={card.player}
              onChange={(e) => updateCard(card.id, { player: e.target.value })}
            >
              <option value="">Select player</option>
              {roster.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="mt-2 w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
              placeholder="Player name"
              value={card.player}
              onChange={(e) => updateCard(card.id, { player: e.target.value })}
            />
          )}
          <textarea
            className="mt-2 w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm"
            rows={2}
            placeholder="What happened?"
            value={card.description}
            onChange={(e) => updateCard(card.id, { description: e.target.value })}
          />
          <button
            type="button"
            className="mt-2 text-xs text-red-600"
            onClick={() => set({ cards: cards.filter((c) => c.id !== card.id) })}
          >
            Remove card
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm"
        onClick={() => set({ cards: [...cards, newAchievementCard()] })}
      >
        + Add achievement
      </button>
    </div>
  );
}
