"use client";

import { motion } from "framer-motion";

function AvatarStack() {
  const colors = ["bg-rose-300", "bg-amber-300", "bg-sky-300", "bg-violet-300"];
  return (
    <span className="flex -space-x-2">
      {colors.map((c, i) => (
        <span key={i} className={`inline-block h-6 w-6 rounded-full ring-2 ring-white ${c}`} aria-hidden />
      ))}
    </span>
  );
}

/** Compact bento preview — announcements, results, leaderboard. */
export function MarketingBentoPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-3 sm:gap-4 lg:grid-cols-2"
    >
      {/* Announcement — large left */}
      <article className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_4px_28px_-14px_rgba(15,23,42,0.08)] lg:row-span-2">
        <div className="p-4 sm:p-5">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#6C5CE7] via-[#7c6cf0] to-[#FF6B9D] p-4 text-white shadow-[0_8px_32px_-8px_rgba(108,92,231,0.45)] sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                New
              </span>
              <span className="text-[10px] font-medium text-white/75">2h ago</span>
            </div>
            <p className="mt-3 text-lg font-semibold leading-snug sm:text-xl">Photos from last game are up!</p>
            <p className="mt-1 text-xs text-white/80">Coach Anna · shared with the whole team</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ["❤️", "14"],
                ["👏", "9"],
                ["🔥", "6"],
              ].map(([emoji, count]) => (
                <span
                  key={emoji}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm"
                >
                  {emoji} {count}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <AvatarStack />
            <span className="text-[11px] text-neutral-500">12 parents viewed</span>
          </div>
        </div>
        <footer className="border-t border-neutral-100/90 bg-gradient-to-b from-white to-neutral-50/80 px-4 py-3 sm:px-5">
          <p className="text-[13px] font-semibold text-[#1A1C23]">Announcements</p>
          <p className="mt-0.5 text-[11px] text-neutral-400">Live updates parents actually read</p>
        </footer>
      </article>

      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Results */}
        <article className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_4px_28px_-14px_rgba(15,23,42,0.08)]">
          <div className="p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-lime-50/80 p-4 ring-1 ring-emerald-100/80">
              <span className="absolute right-3 top-3 text-lg opacity-40" aria-hidden>
                ✨
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700/80">Last match</p>
              <div className="mt-1 flex items-end gap-3">
                <p className="text-4xl font-bold tracking-tight text-[#1A1C23]">3–1</p>
                <span className="mb-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Win
                </span>
              </div>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-800">
                <span aria-hidden>⚽</span> vs Lions · Home
              </p>
            </div>
          </div>
          <footer className="border-t border-neutral-100/90 bg-gradient-to-b from-white to-neutral-50/80 px-4 py-3 sm:px-5">
            <p className="text-[13px] font-semibold text-[#1A1C23]">Results</p>
            <p className="mt-0.5 text-[11px] text-neutral-400">Celebrate every win together</p>
          </footer>
        </article>

        {/* Leaderboard */}
        <article className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_4px_28px_-14px_rgba(15,23,42,0.08)]">
          <div className="p-4 sm:p-5">
            <div className="rounded-2xl bg-gradient-to-b from-[#6C5CE7]/8 to-transparent p-1">
              {[
                { medal: "🥇", name: "Maya", xp: 420, highlight: true },
                { medal: "🥈", name: "Leo", xp: 380, highlight: false },
                { medal: "🥉", name: "Sofia", xp: 355, highlight: false },
              ].map((row) => (
                <div
                  key={row.name}
                  className={`mb-1.5 flex items-center gap-2.5 rounded-xl px-2.5 py-2 last:mb-0 ${
                    row.highlight ? "bg-white shadow-sm ring-1 ring-[#6C5CE7]/15" : "bg-white/60"
                  }`}
                >
                  <span aria-hidden>{row.medal}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
                    {row.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#1A1C23]">{row.name}</span>
                  <span className="text-sm font-bold text-[#6C5CE7]">{row.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
          <footer className="border-t border-neutral-100/90 bg-gradient-to-b from-white to-neutral-50/80 px-4 py-3 sm:px-5">
            <p className="text-[13px] font-semibold text-[#1A1C23]">Team leaderboard</p>
            <p className="mt-0.5 text-[11px] text-neutral-400">Friendly competition, real motivation</p>
          </footer>
        </article>
      </div>
    </motion.div>
  );
}
