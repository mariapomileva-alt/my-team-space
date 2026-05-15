"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const hoverLift =
  "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_48px_-16px_rgba(108,92,231,0.18)]";

type WidgetCardProps = {
  title: string;
  caption?: string;
  children: ReactNode;
  className?: string;
  glow?: boolean;
};

function WidgetCard({ title, caption, children, className = "", glow }: WidgetCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex cursor-default flex-col overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_4px_28px_-14px_rgba(15,23,42,0.08)] ${hoverLift} ${glow ? "ring-1 ring-[#6C5CE7]/10" : ""} ${className}`}
    >
      {glow ? (
        <motion.div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#6C5CE7]/15 blur-2xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      ) : null}
      <motion.div
        className="relative flex min-h-0 flex-1 flex-col p-4 sm:p-5"
        whileHover={{ backgroundColor: "rgba(248,250,252,0.6)" }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
      <footer className="relative border-t border-neutral-100/90 bg-gradient-to-b from-white to-neutral-50/80 px-4 py-3 sm:px-5">
        <p className="text-[13px] font-semibold tracking-tight text-[#1A1C23]">{title}</p>
        {caption ? <p className="mt-0.5 text-[11px] text-neutral-400">{caption}</p> : null}
      </footer>
    </motion.article>
  );
}

function AvatarStack({ count = 3 }: { count?: number }) {
  const colors = ["bg-rose-300", "bg-sky-300", "bg-amber-300", "bg-violet-300"];
  return (
    <span className="flex -space-x-2">
      {colors.slice(0, count).map((c, i) => (
        <span
          key={i}
          className={`inline-block h-6 w-6 rounded-full ring-2 ring-white ${c}`}
          aria-hidden
        />
      ))}
    </span>
  );
}

function CircularProgress({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative h-[72px] w-[72px] shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 72 72" aria-hidden>
        <circle cx="36" cy="36" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="#6C5CE7"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#1A1C23]">
        {pct}%
      </span>
    </div>
  );
}

export function FeatureWidgetsGrid() {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6 lg:auto-rows-[minmax(130px,auto)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {/* Hero: Announcements */}
      <WidgetCard
        title="Announcements"
        caption="Live updates parents actually read"
        glow
        className="col-span-2 row-span-2 lg:col-span-3 lg:row-span-2"
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6C5CE7] via-[#7c6cf0] to-[#FF6B9D] p-4 text-white shadow-[0_8px_32px_-8px_rgba(108,92,231,0.45)]"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              New
            </span>
            <span className="text-[10px] font-medium text-white/75">2h ago</span>
          </div>
          <p className="mt-3 text-base font-semibold leading-snug sm:text-lg">
            Photos from last game are up!
          </p>
          <p className="mt-1 text-xs text-white/80">Coach Anna · shared with the whole team</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
              ❤️ 14
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
              👏 9
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
              🔥 6
            </span>
          </div>
        </motion.div>
        <motion.div className="mt-3 flex items-center justify-between" initial={false}>
          <AvatarStack count={4} />
          <span className="text-[11px] text-neutral-500">12 parents viewed</span>
        </motion.div>
      </WidgetCard>

      {/* Hero: Results */}
      <WidgetCard
        title="Results"
        caption="Celebrate every win together"
        glow
        className="col-span-2 lg:col-span-3"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-lime-50/80 p-4 ring-1 ring-emerald-100/80">
          <span className="absolute right-3 top-3 text-lg opacity-40" aria-hidden>
            ✨
          </span>
          <span className="absolute right-8 top-6 text-sm opacity-30" aria-hidden>
            🎉
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700/80">Last match</p>
          <motion.div
            className="mt-1 flex items-end gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-4xl font-bold tracking-tight text-[#1A1C23] sm:text-5xl">3–1</p>
            <span className="mb-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              Win
            </span>
          </motion.div>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-800">
            <span className="text-xl" aria-hidden>
              ⚽
            </span>
            vs Lions · Home
          </p>
        </div>
      </WidgetCard>

      {/* Large: Leaderboard */}
      <WidgetCard
        title="Team leaderboard"
        caption="Friendly competition, real motivation"
        glow
        className="col-span-2 row-span-2 lg:col-span-2 lg:row-span-2"
      >
        <motion.div
          className="rounded-2xl bg-gradient-to-b from-[#6C5CE7]/8 to-transparent p-1"
          whileHover={{ backgroundColor: "rgba(108,92,231,0.06)" }}
        >
          {[
            { rank: 1, name: "Maya", xp: 420, medal: "🥇", bg: "bg-amber-100", up: true },
            { rank: 2, name: "Leo", xp: 380, medal: "🥈", bg: "bg-neutral-100", up: false },
            { rank: 3, name: "Sofia", xp: 355, medal: "🥉", bg: "bg-orange-50", up: true },
          ].map((row) => (
            <div
              key={row.rank}
              className={`mb-1.5 flex items-center gap-2.5 rounded-xl px-2.5 py-2 last:mb-0 ${row.rank === 1 ? "bg-white shadow-sm ring-1 ring-[#6C5CE7]/15" : "bg-white/60"}`}
            >
              <span className="text-base" aria-hidden>
                {row.medal}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#1A1C23] ${row.bg}`}
              >
                {row.name.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#1A1C23]">{row.name}</span>
              <span className="text-sm font-bold text-[#6C5CE7]">{row.xp} XP</span>
              {row.up ? (
                <span className="text-[10px] font-semibold text-emerald-600" title="Moved up">
                  ↑
                </span>
              ) : null}
            </div>
          ))}
        </motion.div>
        <p className="mt-2 text-center text-[10px] text-neutral-400">Updated after Saturday&apos;s match</p>
      </WidgetCard>

      {/* Large: MVP */}
      <WidgetCard
        title="MVP player"
        caption="Proud moments for kids & parents"
        glow
        className="col-span-2 lg:col-span-2"
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-[#FFA94D] to-rose-200 text-xl font-bold text-amber-950 shadow-lg ring-4 ring-white sm:h-20 sm:w-20 sm:text-2xl">
              MK
            </div>
            <span
              className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-sm shadow-md ring-2 ring-white"
              aria-hidden
            >
              👑
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Player of the week</p>
            <p className="text-lg font-bold text-[#1A1C23]">Maya K.</p>
            <p className="mt-1 text-sm leading-snug text-neutral-500">Great team spirit · 2 goals</p>
            <div className="mt-2 flex gap-1">
              {["⭐", "🔥", "💪"].map((e) => (
                <span key={e} className="rounded-lg bg-amber-50 px-1.5 py-0.5 text-xs">
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>
      </WidgetCard>

      {/* Large: Achievements */}
      <WidgetCard
        title="Achievements"
        caption="Badges kids love to earn"
        glow
        className="col-span-2 lg:col-span-2"
      >
        <div className="flex flex-wrap gap-1.5">
          {["⭐ First goal", "🎯 Streak ×5", "🏅 Team player"].map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-gradient-to-r from-amber-50 to-orange-50 px-2.5 py-1 text-[11px] font-semibold text-amber-950 ring-1 ring-amber-100/80"
            >
              {badge}
            </span>
          ))}
        </div>
        <motion.div className="mt-4" whileHover={{ scale: 1.01 }}>
          <motion.div className="flex justify-between text-[11px] font-medium text-neutral-500">
            <span>Level 4</span>
            <span className="font-bold text-[#6C5CE7]">720 XP</span>
          </motion.div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-neutral-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#FF6B9D]"
              initial={{ width: 0 }}
              whileInView={{ width: "72%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-neutral-400">280 XP to Level 5 · keep the streak!</p>
        </motion.div>
      </WidgetCard>

      {/* Medium: Gallery */}
      <WidgetCard
        title="Team gallery"
        caption="Memories parents scroll through"
        className="col-span-2 row-span-2 lg:col-span-2 lg:row-span-2"
      >
        <div className="relative mx-auto h-[140px] max-w-[220px] sm:h-[160px]">
          {[
            { rot: "-6deg", z: 1, grad: "from-rose-200/90 via-orange-100 to-amber-50", label: "🏆" },
            { rot: "4deg", z: 2, grad: "from-sky-200/90 via-indigo-100 to-violet-50", label: "📸" },
            { rot: "-2deg", z: 3, grad: "from-emerald-200/80 via-lime-100 to-teal-50", label: "⚽" },
          ].map((tile, i) => (
            <motion.div
              key={i}
              className={`absolute left-1/2 top-2 h-[100px] w-[72px] -translate-x-1/2 rounded-lg bg-gradient-to-br ${tile.grad} shadow-md ring-2 ring-white sm:h-[110px] sm:w-[80px]`}
              style={{ rotate: tile.rot, zIndex: tile.z, marginLeft: i === 0 ? "-28px" : i === 2 ? "28px" : "0" }}
              whileHover={{ y: -4, rotate: "0deg", zIndex: 10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
                <span className="text-2xl" aria-hidden>
                  {tile.label}
                </span>
                <span className="text-[9px] font-medium text-neutral-600/80">Team moment</span>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-neutral-400">+24 photos this month</p>
      </WidgetCard>

      {/* Medium: Schedule */}
      <WidgetCard title="Schedule" caption="Always know what's next" className="lg:col-span-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl bg-[#6C5CE7]/10 px-3 py-2 ring-1 ring-[#6C5CE7]/15">
            <span className="text-xs font-semibold text-[#6C5CE7]">Today</span>
            <span className="text-sm font-bold text-[#1A1C23]">18:00</span>
          </div>
          {[
            { day: "Thu", event: "Match vs Eagles", time: "19:30" },
            { day: "Sun", event: "Regional cup trip", time: "08:00" },
          ].map((row) => (
            <div
              key={row.day}
              className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2 text-xs"
            >
              <span className="font-medium text-neutral-700">{row.event}</span>
              <span className="font-semibold text-neutral-500">{row.time}</span>
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Medium: Attendance */}
      <WidgetCard title="Attendance" caption="Clear at a glance" className="lg:col-span-2">
        <div className="flex items-center gap-4">
          <CircularProgress value={18} max={24} />
          <div>
            <p className="text-3xl font-bold tracking-tight text-[#1A1C23]">18</p>
            <p className="text-sm text-neutral-500">of 24 present</p>
            <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              +3 vs last week
            </p>
          </div>
        </div>
      </WidgetCard>

      {/* Small cards */}
      <WidgetCard title="Trips" caption="One place for travel info" className="lg:col-span-2">
        <div className="flex gap-3 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50/80 p-3 ring-1 ring-teal-100/60">
          <span className="text-2xl" aria-hidden>
            🚌
          </span>
          <div>
            <p className="text-sm font-semibold text-teal-900">Regional cup</p>
            <p className="text-xs text-teal-700/90">Sat · depart 07:30</p>
            <p className="mt-1 text-[10px] text-teal-600/80">Pack lunch · blue kit</p>
          </div>
        </div>
      </WidgetCard>

      <WidgetCard title="Team rules" caption="Shared expectations" className="lg:col-span-2">
        <ol className="space-y-2 text-xs leading-relaxed text-neutral-600">
          {[
            "Respect coaches & refs",
            "Arrive 15 min early",
            "Hydrate always",
          ].map((rule, i) => (
            <li key={rule} className="flex gap-2 rounded-lg bg-neutral-50/80 px-2 py-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#6C5CE7]/10 text-[10px] font-bold text-[#6C5CE7]">
                {i + 1}
              </span>
              {rule}
            </li>
          ))}
        </ol>
      </WidgetCard>

      <WidgetCard title="Sponsors" caption="Thank your supporters" className="lg:col-span-2">
        <motion.div className="flex flex-wrap items-center justify-center gap-2 py-1" whileHover={{ scale: 1.02 }}>
          <span className="rounded-xl bg-neutral-100 px-3 py-2 text-[10px] font-bold tracking-tight text-neutral-600">
            LOCAL SPORT
          </span>
          <span className="rounded-xl bg-[#1A1C23] px-3 py-2 text-[10px] font-bold text-white">SPORT+</span>
        </motion.div>
        <p className="mt-2 text-center text-[10px] text-neutral-400">Proud partners of our team</p>
      </WidgetCard>

      <WidgetCard title="Coach contacts" caption="Parents reach you fast" className="lg:col-span-2">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#6C5CE7]/5 to-white p-3 ring-1 ring-[#6C5CE7]/10">
          <motion.div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#7c6cf0] text-sm font-bold text-white shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            CA
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#1A1C23]">Coach Anna</p>
            <p className="text-xs text-[#6C5CE7]">Message · Call · WhatsApp</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.25)]" title="Online" />
        </div>
      </WidgetCard>
    </motion.div>
  );
}
