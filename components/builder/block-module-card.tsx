"use client";

import { BlockSettingsEditor } from "@/components/builder/block-settings-editor";
import { BlockShapePreview } from "@/components/builder/block-shape-preview";
import {
  builderCardGridClass,
  builderCardSizeClass,
} from "@/lib/blocks/builder-section-styles";
import { BUILDER_RADIUS_CHOICE } from "@/lib/builder/layout";
import { cn } from "@/lib/utils/cn";
import { BLOCK_META } from "@/lib/blocks/meta";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  block: BlockInstance;
  team: TeamSpace;
  expanded: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleExpand: () => void;
  onToggleEnabled: () => void;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
};

const RESULTS_TYPES = new Set(["results", "achievements"]);

export function BlockModuleCard({
  block,
  team,
  expanded,
  canMoveUp = false,
  canMoveDown = false,
  onMoveUp,
  onMoveDown,
  onToggleExpand,
  onToggleEnabled,
  onPatchBlock,
  onPatchTeam,
}: Props) {
  const meta = BLOCK_META[block.type];
  const isGallery = block.type === "gallery";
  const isResults = RESULTS_TYPES.has(block.type);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: !block.enabled,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <motion.li layout className={`list-none ${builderCardGridClass(block)} ${builderCardSizeClass(block.type)}`}>
      <motion.article
        whileHover={block.enabled ? { y: -2 } : undefined}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={cn(
          "group relative flex h-full min-w-0 flex-col overflow-hidden border bg-white/95 transition-[box-shadow,border-color,transform] duration-300",
          BUILDER_RADIUS_CHOICE,
          block.enabled
            ? expanded
              ? "border-indigo-300/90 shadow-[0_0_0_3px_rgba(99,102,241,0.18),0_12px_40px_-16px_rgba(99,102,241,0.35)]"
              : "border-white/90 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)] hover:shadow-[0_16px_48px_-20px_rgba(99,102,241,0.28)]"
            : "border-zinc-200/80 opacity-75 shadow-sm",
          isDragging && "z-30 scale-[1.02] shadow-2xl ring-2 ring-indigo-400",
          isResults && "ring-1 ring-orange-100/80",
        )}
      >
        <motion.div
          className={`pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
            isGallery
              ? "bg-gradient-to-br from-rose-50/50 via-transparent to-indigo-50/40"
              : isResults
                ? "bg-gradient-to-br from-orange-50/60 via-transparent to-amber-50/30"
                : "bg-gradient-to-br from-indigo-50/40 via-transparent to-violet-50/30"
          }`}
        />

        <motion.div ref={setNodeRef} style={style} className="relative z-[1] flex flex-1 flex-col p-3.5 sm:p-4">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex shrink-0 flex-col items-center gap-0.5">
              <div className="flex flex-col overflow-hidden rounded-lg border border-zinc-200/80 bg-zinc-50/80">
                <button
                  type="button"
                  disabled={!canMoveUp}
                  onClick={onMoveUp}
                  className="px-2 py-1 text-[11px] font-semibold leading-none text-zinc-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Move block up"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={!canMoveDown}
                  onClick={onMoveDown}
                  className="border-t border-zinc-200/80 px-2 py-1 text-[11px] font-semibold leading-none text-zinc-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Move block down"
                  title="Move down"
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                className="flex h-7 w-7 cursor-grab touch-manipulation flex-col items-center justify-center gap-0.5 rounded-lg text-zinc-300 transition hover:bg-zinc-100 hover:text-zinc-500 active:cursor-grabbing"
                aria-label="Drag to reorder"
                {...attributes}
                {...listeners}
              >
                <span className="block h-0.5 w-3 rounded-full bg-current" />
                <span className="block h-0.5 w-3 rounded-full bg-current" />
                <span className="block h-0.5 w-3 rounded-full bg-current" />
              </button>
            </div>

            <BlockShapePreview
              shape={meta.previewShape}
              blockType={block.type}
              large={isGallery || block.type === "hero"}
            />

            <button
              type="button"
              onClick={onToggleExpand}
              disabled={!block.enabled}
              className="flex min-w-0 flex-1 flex-col gap-1 text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  {meta.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold tracking-tight text-zinc-900">{meta.title}</span>
                  <span className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-zinc-500">
                    {meta.description}
                  </span>
                </span>
                <motion.span
                  animate={{ rotate: expanded && block.enabled ? 180 : 0 }}
                  transition={{ duration: 0.22 }}
                  className="shrink-0 text-sm text-zinc-400"
                  aria-hidden
                >
                  ▾
                </motion.span>
              </div>
            </button>

            <label className="flex shrink-0 flex-col items-center gap-1">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-400">On</span>
              <input
                type="checkbox"
                checked={block.enabled}
                onChange={onToggleEnabled}
                disabled={!meta.canDisable}
                className="h-5 w-5 rounded-md border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </motion.div>

        <AnimatePresence initial={false}>
          {expanded && block.enabled ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20 overflow-hidden bg-white"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <BlockSettingsEditor
                block={block}
                team={team}
                onPatchBlock={onPatchBlock}
                onPatchTeam={onPatchTeam}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.article>
    </motion.li>
  );
}
