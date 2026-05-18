"use client";

import { BLOCK_APP_META, type BlockAppMeta } from "@/lib/blocks/block-app-meta";
import type { BlockPreview } from "@/lib/blocks/block-preview";
import type { BlockInstance } from "@/lib/types";
import { motion } from "framer-motion";

export function TeamAppTile({
  block,
  preview,
  onOpen,
  index,
  metaOverride,
}: {
  block: BlockInstance;
  preview: BlockPreview;
  onOpen: () => void;
  index: number;
  metaOverride?: Partial<BlockAppMeta>;
}) {
  const meta = { ...BLOCK_APP_META[block.type], ...metaOverride };

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.24), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      className="group flex w-full flex-col rounded-[1.35rem] border border-neutral-200/90 bg-white p-4 text-left shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)] ring-1 ring-neutral-100/80 transition hover:border-indigo-200/80 hover:shadow-[0_12px_40px_-16px_rgba(99,102,241,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      <motion.div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${meta.tileClass}`}
          aria-hidden
        >
          {meta.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{meta.subtitle}</p>
            {preview.badge ? (
              <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                {preview.badge}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[15px] font-bold leading-snug tracking-tight text-neutral-900">{meta.title}</p>
          <p
            className={`mt-1 line-clamp-2 text-[13px] leading-snug ${preview.isEmpty ? "text-neutral-400" : "text-neutral-600"}`}
          >
            {preview.headline}
          </p>
          {preview.detail ? (
            <p className="mt-1 line-clamp-1 text-[12px] text-neutral-400">{preview.detail}</p>
          ) : null}
        </div>
        <span
          className="mt-1 shrink-0 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-400"
          aria-hidden
        >
          ›
        </span>
      </motion.div>
    </motion.button>
  );
}
