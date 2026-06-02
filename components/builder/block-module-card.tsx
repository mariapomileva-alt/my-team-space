"use client";

import { BlockSettingsEditor } from "@/components/builder/block-settings-editor";
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
  expanded?: boolean;
  position?: number;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleExpand: () => void;
  onToggleEnabled: () => void;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
  onPreviewBlock?: (id: string) => void;
  isDraggingOverlay?: boolean;
  /** Single-column visual builder cards (Step 2) */
  legoLayout?: boolean;
};

const RESULTS_TYPES = new Set(["results", "achievements"]);

const LEGO_ACCENTS: Partial<Record<string, string>> = {
  gallery: "from-rose-100 to-orange-50",
  calendar: "from-sky-100 to-indigo-50",
  schedule: "from-sky-100 to-indigo-50",
  results: "from-amber-100 to-orange-50",
  achievements: "from-amber-100 to-orange-50",
  contacts: "from-teal-100 to-emerald-50",
  integrations: "from-violet-100 to-fuchsia-50",
  announcement_bar: "from-indigo-100 to-violet-50",
};

export function BlockModuleCard({
  block,
  team,
  expanded = false,
  position,
  canMoveUp = false,
  canMoveDown = false,
  onMoveUp,
  onMoveDown,
  onToggleExpand,
  onToggleEnabled,
  onPatchBlock,
  onPatchTeam,
  onPreviewBlock,
  isDraggingOverlay = false,
  legoLayout = false,
}: Props) {
  const meta = BLOCK_META[block.type];
  const isGallery = block.type === "gallery";
  const isResults = RESULTS_TYPES.has(block.type);
  const sortable = useSortable({
    id: block.id,
    disabled: !block.enabled || isDraggingOverlay,
  });
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;
  const style = isDraggingOverlay
    ? undefined
    : { transform: CSS.Transform.toString(transform), transition };

  const statusLabel = block.enabled ? "On your page" : "Hidden";
  const statusTone = block.enabled
    ? "bg-emerald-50 text-emerald-800 ring-emerald-200/70"
    : "bg-zinc-100 text-zinc-500 ring-zinc-200/80";

  const iconGradient = LEGO_ACCENTS[block.type] ?? "from-indigo-100 to-violet-100";

  return (
    <motion.li
      layout={!isDraggingOverlay}
      data-builder-block-id={block.id}
      data-builder-block-type={block.type}
      className={cn(
        "list-none",
        !isDraggingOverlay && !legoLayout && builderCardGridClass(block),
        !isDraggingOverlay && !legoLayout && builderCardSizeClass(block.type),
        legoLayout && "w-full",
      )}
    >
      <motion.article
        whileHover={block.enabled && !isDraggingOverlay ? { y: -2 } : undefined}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={cn(
          "group relative flex min-w-0 flex-col overflow-hidden border bg-white transition-[box-shadow,border-color] duration-300",
          legoLayout ? "rounded-2xl" : BUILDER_RADIUS_CHOICE,
          block.enabled
            ? expanded
              ? "border-indigo-300/90 shadow-[0_0_0_3px_rgba(99,102,241,0.12),0_16px_48px_-20px_rgba(99,102,241,0.25)]"
              : legoLayout
                ? "border-zinc-200/90 shadow-[0_4px_20px_-12px_rgba(15,23,42,0.12)] hover:border-indigo-200 hover:shadow-[0_12px_32px_-16px_rgba(99,102,241,0.2)]"
                : "border-zinc-200/90 shadow-sm hover:border-indigo-200 hover:shadow-md"
            : "border-zinc-200/80 bg-zinc-50/50 opacity-90 shadow-sm",
          isDragging && !isDraggingOverlay && "z-30 opacity-40",
          isDraggingOverlay && "border-indigo-300 shadow-2xl ring-2 ring-indigo-300",
          isResults && block.enabled && !legoLayout && "ring-1 ring-orange-100/80",
        )}
      >
        {!expanded && block.enabled && !legoLayout ? (
          <motion.div
            className={cn(
              "pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
              isGallery
                ? "bg-gradient-to-br from-rose-50/50 via-transparent to-indigo-50/40"
                : isResults
                  ? "bg-gradient-to-br from-orange-50/60 via-transparent to-amber-50/30"
                  : "bg-gradient-to-br from-indigo-50/40 via-transparent to-violet-50/30",
            )}
          />
        ) : null}

        <motion.div
          ref={isDraggingOverlay ? undefined : setNodeRef}
          style={style}
          className={cn("relative z-[1] flex flex-col", legoLayout ? "p-4" : "p-3 sm:p-3.5")}
        >
          <div className="flex items-start gap-3">
            {!isDraggingOverlay ? (
              <button
                type="button"
                className={cn(
                  "mt-1 flex shrink-0 cursor-grab touch-manipulation flex-col items-center justify-center gap-1 rounded-xl border border-zinc-200/80 bg-zinc-50/80 text-zinc-400 transition hover:border-zinc-300 hover:bg-white hover:text-zinc-600 active:cursor-grabbing",
                  legoLayout ? "h-12 w-8" : "h-9 w-7",
                )}
                aria-label="Drag to reorder"
                {...attributes}
                {...listeners}
              >
                <span className="block h-0.5 w-3.5 rounded-full bg-current" />
                <span className="block h-0.5 w-3.5 rounded-full bg-current" />
                <span className="block h-0.5 w-3.5 rounded-full bg-current" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={onToggleExpand}
              disabled={!block.enabled}
              className="flex min-w-0 flex-1 items-start gap-3 text-left disabled:opacity-50"
            >
              <span
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
                  iconGradient,
                  legoLayout ? "h-12 w-12" : "h-10 w-10 rounded-xl text-lg",
                )}
              >
                {meta.emoji}
              </span>
              <span className="min-w-0 flex-1 pt-0.5">
                <span className="flex flex-wrap items-center gap-2">
                  <span className={cn("font-bold tracking-tight text-zinc-900", legoLayout ? "text-base" : "text-sm")}>
                    {meta.title}
                  </span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1", statusTone)}>
                    {statusLabel}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-1 line-clamp-2 leading-snug text-zinc-500",
                    legoLayout ? "text-xs" : expanded ? "text-[11px]" : "text-[11px]",
                  )}
                >
                  {meta.description}
                </span>
              </span>
              <motion.span
                animate={{ rotate: expanded && block.enabled ? 180 : 0 }}
                transition={{ duration: 0.22 }}
                className="mt-1 shrink-0 text-sm text-zinc-400"
                aria-hidden
              >
                ▾
              </motion.span>
            </button>

            <label className="mt-1 flex shrink-0 flex-col items-center gap-1">
              <span className="text-[9px] font-semibold text-zinc-400">{block.enabled ? "On" : "Off"}</span>
              <input
                type="checkbox"
                checked={block.enabled}
                onChange={onToggleEnabled}
                disabled={!meta.canDisable}
                className="h-5 w-5 rounded-md border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                aria-label={block.enabled ? "Hide from page" : "Show on page"}
              />
            </label>
          </div>

          {expanded && block.enabled && !isDraggingOverlay ? (
            <div className="mt-3 flex items-center justify-end gap-1 border-t border-zinc-100 pt-2">
              {position != null ? (
                <span className="mr-auto rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-zinc-500">
                  #{position}
                </span>
              ) : null}
              <button
                type="button"
                disabled={!canMoveUp}
                onClick={onMoveUp}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={!canMoveDown}
                onClick={onMoveDown}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
                aria-label="Move down"
              >
                ↓
              </button>
            </div>
          ) : null}
        </motion.div>

        <AnimatePresence initial={false}>
          {expanded && block.enabled && !isDraggingOverlay ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20 overflow-hidden border-t border-zinc-100 bg-white"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <BlockSettingsEditor
                block={block}
                team={team}
                onPatchBlock={onPatchBlock}
                onPatchTeam={onPatchTeam}
                onPreviewBlock={onPreviewBlock}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.article>
    </motion.li>
  );
}
