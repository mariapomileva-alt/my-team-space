"use client";

import type { TeamSpace } from "@/lib/types";
import { motion } from "framer-motion";

export function TeamAppHeader({ team }: { team: TeamSpace }) {
  const logoSrc = team.logoUrl?.trim() || team.pageSettings?.logoUrl?.trim();
  const initial = team.name.slice(0, 1).toUpperCase();

  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mts-app-surface rounded-[1.35rem] px-4 py-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt=""
              className="h-12 w-12 shrink-0 rounded-2xl border border-neutral-100 object-cover shadow-sm"
            />
          ) : (
            <motion.div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-sm"
              whileTap={{ scale: 0.96 }}
            >
              {initial}
            </motion.div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-[color:var(--mts-text)]">{team.name}</h1>
            {team.tagline ? (
              <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-[color:var(--mts-muted)]">{team.tagline}</p>
            ) : (
              <p className="mt-0.5 text-[13px] text-[color:var(--mts-primary)]">Your team space</p>
            )}
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          Live
        </span>
      </div>
    </motion.header>
  );
}
