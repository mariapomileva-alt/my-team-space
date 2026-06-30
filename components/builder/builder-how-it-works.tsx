"use client";

import { getCoachHelpSections, type CoachHelpSection } from "@/lib/builder/coach-help-content";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

function HelpSectionList({ sections, compact }: { sections: CoachHelpSection[]; compact?: boolean }) {
  return (
    <div className={cn("space-y-3", compact ? "text-[11px]" : "text-[13px]")}>
      {sections.map((section) => (
        <div key={section.id}>
          <p className={cn("font-semibold text-zinc-800", compact ? "text-[11px]" : "text-[13px]")}>
            <span className="mr-1" aria-hidden>
              {section.emoji}
            </span>
            {section.title}
          </p>
          <ul className={cn("mt-1 space-y-1 text-zinc-600", compact ? "leading-snug" : "leading-relaxed")}>
            {section.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-1.5">
                <span className="mt-[0.35em] h-1 w-1 shrink-0 rounded-full bg-violet-400/80" aria-hidden />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Compact guide in the left page-structure nav (desktop). */
export function BuilderHowItWorksSidebar({ isAcademy = false }: { isAcademy?: boolean }) {
  const [open, setOpen] = useState(false);
  const sections = getCoachHelpSections({ isAcademy });

  return (
    <div className="mt-4 border-t border-zinc-200/60 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-violet-700 transition hover:bg-violet-50/80"
        aria-expanded={open}
      >
        <span className="flex items-center gap-1.5">
          <span aria-hidden>💡</span>
          How it works
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-[10px] text-zinc-400" aria-hidden>
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="max-h-[min(52vh,420px)] overflow-y-auto px-1 pb-1 pt-2 [scrollbar-width:thin]">
              <HelpSectionList sections={sections} compact />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function BuilderHowItWorksGuideButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1.5 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100 transition hover:bg-violet-100",
        className,
      )}
    >
      <span aria-hidden>💡</span>
      Guide
    </button>
  );
}

export function BuilderHowItWorksModal({
  open,
  onClose,
  isAcademy = false,
}: {
  open: boolean;
  onClose: () => void;
  isAcademy?: boolean;
}) {
  const sections = getCoachHelpSections({ isAcademy });

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close guide"
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[2px]"
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
              "fixed inset-x-4 bottom-4 top-auto z-[210] mx-auto flex max-h-[min(85vh,640px)] max-w-lg flex-col rounded-3xl border border-zinc-200/80 bg-white shadow-2xl",
              "sm:inset-x-auto sm:left-1/2 sm:top-[6%] sm:w-full sm:-translate-x-1/2",
            )}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <div className="shrink-0 border-b border-zinc-100 px-5 py-4 sm:px-6">
              <h2 id="builder-how-it-works-title" className="text-lg font-bold tracking-tight text-zinc-900">
                How it works
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
                Your team page, WhatsApp, and simple data — in one place.
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              <HelpSectionList sections={sections} />
            </div>
            <div className="shrink-0 border-t border-zinc-100 px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
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
