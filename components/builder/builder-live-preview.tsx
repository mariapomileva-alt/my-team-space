"use client";

import { TeamShell } from "@/components/mts/team-shell";
import { TeamPageBlocks } from "@/components/mts/team-page-blocks";
import type { TeamSpace } from "@/lib/types";
import { motion } from "framer-motion";

/** Sticky phone-frame live preview — updates instantly as builder state changes */
export function BuilderLivePreview({ team }: { team: TeamSpace }) {
  return (
    <div className="hidden lg:block">
      <div className="sticky top-6 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3 w-full text-center text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400"
        >
          Live preview
        </motion.p>
        <motion.div
          layout
          className="w-[min(100%,360px)] overflow-hidden rounded-[2.25rem] border-[7px] border-zinc-900/95 bg-zinc-900 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.45),0_0_0_1px_rgba(255,255,255,0.06)_inset]"
        >
          <motion.div className="relative flex h-7 items-center justify-center bg-zinc-900">
            <span className="h-1 w-16 rounded-full bg-zinc-700" aria-hidden />
          </motion.div>
          <div
            className="max-h-[min(72vh,680px)] overflow-y-auto overscroll-contain scroll-smooth bg-[var(--mts-bg,#f8fafc)]"
            style={{ scrollBehavior: "smooth" }}
          >
            <TeamShell themeId={team.themeId}>
              <TeamPageBlocks team={team} hasAccess />
            </TeamShell>
          </div>
          <div className="flex h-6 items-center justify-center bg-zinc-900">
            <span className="h-1 w-24 rounded-full bg-zinc-700" aria-hidden />
          </div>
        </motion.div>
        <p className="mt-3 max-w-[280px] text-center text-[11px] leading-relaxed text-zinc-400">
          What parents see on their phone — edits appear here instantly.
        </p>
      </div>
    </div>
  );
}
