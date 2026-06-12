"use client";

import { BuilderPreviewSegment } from "@/components/builder/builder-preview-segment";
import { BuilderPreviewViewport } from "@/components/builder/builder-preview-viewport";
import {
  BUILDER_PHONE_H,
  BUILDER_PHONE_W,
  type BuilderPreviewMode,
} from "@/lib/builder/preview";
import type { TeamSpace } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function BuilderFullPreviewModal({
  open,
  onClose,
  team,
  mode,
  onModeChange,
  focusBlockId,
  onOpenInTab,
}: {
  open: boolean;
  onClose: () => void;
  team: TeamSpace;
  mode: BuilderPreviewMode;
  onModeChange: (mode: BuilderPreviewMode) => void;
  focusBlockId?: string | null;
  onOpenInTab: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-x-0 top-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] z-[100] flex items-stretch justify-center xl:inset-0 xl:bottom-0 xl:items-center xl:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Full page preview"
        >
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm xl:bg-zinc-900/50"
            onClick={onClose}
            aria-label="Close preview"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-zinc-200/90 bg-white shadow-2xl xl:my-auto xl:h-auto xl:max-h-[92vh] xl:rounded-2xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 sm:px-5">
              <div>
                <p className="text-sm font-bold text-zinc-900">Preview</p>
                <p className="text-xs text-zinc-500">{team.name}</p>
              </div>
              <div className="w-full max-w-[220px] sm:w-auto">
                <BuilderPreviewSegment mode={mode} onChange={onModeChange} />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-zinc-500 hover:bg-zinc-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center overflow-auto bg-zinc-50/80 p-4 sm:p-6">
              <div
                className="w-full"
                style={{
                  maxWidth: mode === "mobile" ? BUILDER_PHONE_W + 40 : "100%",
                }}
              >
                <BuilderPreviewViewport
                  team={team}
                  mode={mode}
                  focusBlockId={focusBlockId}
                  phoneClassName="!mx-auto"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 px-4 py-3 sm:px-5">
              <p className="text-[11px] text-zinc-500">
                {mode === "mobile" ? `Phone · ${BUILDER_PHONE_W}×${BUILDER_PHONE_H}` : "Desktop width"}
              </p>
              <button
                type="button"
                onClick={() => {
                  onOpenInTab();
                  onClose();
                }}
                className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
              >
                Open in new tab
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
