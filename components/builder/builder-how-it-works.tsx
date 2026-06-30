"use client";

import { BuilderGuideContent } from "@/components/builder/builder-guide-content";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export function BuilderHowItWorksGuideButton({
  onClick,
  className,
  label = "How it works",
}: {
  onClick: () => void;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-violet-50 px-2.5 py-1.5 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100 transition hover:bg-violet-100",
        className,
      )}
    >
      <span aria-hidden>💡</span>
      {label}
    </button>
  );
}

export function BuilderHowItWorksModal({
  open,
  onClose,
  teamId,
  isAcademy = false,
}: {
  open: boolean;
  onClose: () => void;
  teamId: string;
  isAcademy?: boolean;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close guide"
            className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="builder-how-it-works-title"
            className={cn(
              "fixed inset-x-3 top-[4%] z-[210] mx-auto flex max-h-[min(92vh,820px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xl",
              "sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2",
            )}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="shrink-0 border-b border-zinc-100 bg-gradient-to-r from-violet-50/80 via-white to-white px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="builder-how-it-works-title" className="text-xl font-bold tracking-tight text-zinc-900">
                    How it works
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
                    Every builder feature — what it does and how families use it.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <BuilderGuideContent isAcademy={isAcademy} />
            </div>

            <div className="shrink-0 flex flex-col gap-2 border-t border-zinc-100 bg-zinc-50/50 px-5 py-3 sm:flex-row sm:px-6">
              <Link
                href={`/admin/team/${teamId}/guide`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-full border border-zinc-200 bg-white py-2.5 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                Open full page
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
