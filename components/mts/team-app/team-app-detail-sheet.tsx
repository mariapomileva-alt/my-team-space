"use client";

import { BLOCK_APP_META, type BlockAppMeta } from "@/lib/blocks/block-app-meta";
import type { BlockInstance } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, type ReactNode } from "react";

export function TeamAppDetailSheet({
  block,
  open,
  onClose,
  children,
  metaOverride,
}: {
  block: BlockInstance | null;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  metaOverride?: Partial<BlockAppMeta>;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const meta = block ? { ...BLOCK_APP_META[block.type], ...metaOverride } : null;

  return (
    <AnimatePresence>
      {open && block && meta ? (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--mts-text)_35%,transparent)] backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="mts-app-surface fixed inset-x-0 bottom-0 z-[51] flex max-h-[min(92dvh,720px)] flex-col rounded-t-[1.85rem] shadow-[0_-28px_90px_-24px_rgba(0,0,0,0.32)] sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.85rem]"
            initial={{ y: "100%", opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80 || info.velocity.y > 400) onClose();
              }}
              className="flex shrink-0 cursor-grab flex-col items-center px-4 pt-3 active:cursor-grabbing sm:cursor-default"
            >
              <span className="mb-3 h-1 w-10 rounded-full bg-[color:var(--mts-card-border)] sm:hidden" aria-hidden />
              <div className="flex w-full items-start gap-3 pb-3">
                <span
                  className="mts-app-badge flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                  aria-hidden
                >
                  {meta.emoji}
                </span>
                <motion.div className="min-w-0 flex-1 pt-0.5">
                  <h2 id={titleId} className="text-[17px] font-semibold tracking-[-0.02em] text-[color:var(--mts-text)] sm:text-lg">
                    {meta.title}
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--mts-muted)]">{meta.subtitle}</p>
                </motion.div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--mts-accent-soft)] text-[color:var(--mts-muted)] transition hover:opacity-80"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </motion.div>
            <div className="team-app-detail-content min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-[color:var(--mts-card-border)] px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-6 sm:px-7 sm:pb-8">
              {children}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
