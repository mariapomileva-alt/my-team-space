"use client";

import { PollVotesList } from "@/components/builder/editors/poll-votes-list";
import { getBlockSettings, type PollSettings } from "@/lib/blocks/settings";
import type { BlockInstance, TeamSpace } from "@/lib/types";

export function PollsEditor({
  block,
  team,
  onPatchBlock,
  onPatchTeam,
}: {
  block: BlockInstance;
  team: TeamSpace;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
}) {
  const s = getBlockSettings<PollSettings>(block);
  const settings = team.pageSettings ?? {};

  function set(patch: Partial<PollSettings>) {
    onPatchBlock(block.id, { settings: { ...s, ...patch } });
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-zinc-500">Poll question</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Who is coming Saturday?"
        value={s.question}
        onChange={(e) => set({ question: e.target.value })}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="Yes option"
          value={s.optionYes}
          onChange={(e) => set({ optionYes: e.target.value })}
        />
        <input
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="No option"
          value={s.optionNo}
          onChange={(e) => set({ optionNo: e.target.value })}
        />
      </div>
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
        <p className="text-xs font-semibold text-indigo-900">Notify coach on each vote</p>
        <p className="mt-1 text-xs text-indigo-800/80">
          SMS or WhatsApp (via Twilio). Include country code, e.g. +371 2xxxxxxx
        </p>
        <label className="mt-2 block text-xs font-semibold text-zinc-500">Your phone (SMS / WhatsApp)</label>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          placeholder="+371 …"
          value={settings.coachWhatsapp ?? ""}
          onChange={(e) =>
            onPatchTeam({ pageSettings: { ...settings, coachWhatsapp: e.target.value } })
          }
        />
        <p className="mt-3 text-xs font-semibold text-zinc-500">Recent answers</p>
        <PollVotesList teamId={team.id} blockId={block.id} />
      </div>
    </div>
  );
}
