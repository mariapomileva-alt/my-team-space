"use client";

import type { BlockInstance, TeamSpace } from "@/lib/types";

export function BlockAudiencePicker({
  team,
  block,
  onPatchBlock,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  if (team.pageVisibility !== "mixed") return null;
  const audience = (block.settings?.audience as string) ?? "public";
  return (
    <div className="flex flex-wrap gap-2">
      <span className="w-full text-xs font-semibold text-zinc-500">Who can see this block</span>
      {(["public", "private"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() =>
            onPatchBlock(block.id, {
              settings: { ...block.settings, audience: v },
            })
          }
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            audience === v ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {v === "public" ? "Everyone" : "Members only"}
        </button>
      ))}
    </div>
  );
}
