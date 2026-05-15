"use client";

import { BlockSettingsEditor } from "@/components/builder/block-settings-editor";
import { BlockShapePreview } from "@/components/builder/block-shape-preview";
import { BLOCK_META } from "@/lib/blocks/meta";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  block: BlockInstance;
  team: TeamSpace;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleEnabled: () => void;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
};

export function BlockModuleCard({
  block,
  team,
  expanded,
  onToggleExpand,
  onToggleEnabled,
  onPatchBlock,
  onPatchTeam,
}: Props) {
  const meta = BLOCK_META[block.type];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: !block.enabled,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  function onEnableChange() {
    onToggleEnabled();
  }

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      layout
      className={`list-none overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow ${
        block.enabled ? "border-indigo-200/80 ring-1 ring-indigo-50" : "border-zinc-200 opacity-80"
      } ${isDragging ? "z-20 shadow-lg ring-2 ring-indigo-400" : ""}`}
    >
      <div className="flex items-start gap-2 px-3 py-3 sm:px-4">
        <button
          type="button"
          className="mt-1 touch-manipulation cursor-grab px-1 text-zinc-400 active:cursor-grabbing"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>
        <BlockShapePreview shape={meta.previewShape} />
        <button
          type="button"
          onClick={onToggleExpand}
          disabled={!block.enabled}
          className="flex min-w-0 flex-1 items-start gap-2 text-left disabled:opacity-50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl sm:hidden">
            {meta.emoji}
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-semibold text-zinc-900">{meta.title}</span>
            <span className="mt-0.5 block text-xs leading-snug text-zinc-500">{meta.description}</span>
          </span>
          <span className="shrink-0 text-zinc-400" aria-hidden>
            {expanded && block.enabled ? "▾" : "▸"}
          </span>
        </button>
        <label className="flex shrink-0 items-center gap-2">
          <span className="sr-only">Show on page</span>
          <input
            type="checkbox"
            checked={block.enabled}
            onChange={onEnableChange}
            disabled={!meta.canDisable}
            className="h-5 w-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
        </label>
      </div>

      <AnimatePresence initial={false}>
        {expanded && block.enabled ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <BlockSettingsEditor block={block} team={team} onPatchBlock={onPatchBlock} onPatchTeam={onPatchTeam} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.li>
  );
}
