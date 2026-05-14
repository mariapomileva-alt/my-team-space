"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

const accentBtn =
  "bg-indigo-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-6px_rgba(79,70,229,0.45)] hover:bg-indigo-500 active:scale-[0.99]";
const accentRing = "ring-indigo-500/15";
const accentBorder = "border-indigo-100/80";
const accentSoft = "from-indigo-50/90 via-white to-violet-50/40";
const accentGlow = "shadow-[0_0_80px_-20px_rgba(79,70,229,0.25)]";

const FLOATING: { text: string; className: string; hideOnMobile?: boolean }[] = [
  { text: "Training today · 18:00", className: "left-0 top-[4%] sm:left-[-2%]" },
  { text: "+1 trophy unlocked", className: "right-0 top-[12%] sm:right-[-4%]" },
  { text: "12 parents viewed update", className: "left-[-6%] top-[38%] sm:left-[-8%]", hideOnMobile: true },
  { text: "Coach Anna updated the schedule", className: "right-[-4%] top-[44%] sm:right-[-6%]", hideOnMobile: true },
  { text: "New tournament results added", className: "left-0 bottom-[26%] sm:left-[-2%]" },
  { text: "24 kids completed challenge", className: "right-0 bottom-[18%] sm:right-[-2%]", hideOnMobile: true },
  { text: "Trip details updated", className: "left-[8%] bottom-[8%] sm:left-[4%]" },
  { text: "Player of the week", className: "right-[6%] bottom-[6%] sm:right-[2%]", hideOnMobile: true },
];

function AvatarStack({ className = "" }: { className?: string }) {
  const fills = ["bg-rose-300", "bg-amber-300", "bg-emerald-300", "bg-sky-300"];
  return (
    <span className={`flex -space-x-1.5 ${className}`}>
      {fills.map((c, i) => (
        <span
          key={i}
          className={`inline-block h-5 w-5 rounded-full ring-2 ring-white ${c}`}
          aria-hidden
        />
      ))}
    </span>
  );
}

function FloatingLiveCard({ text, className, delay, hideOnMobile }: { text: string; className: string; delay: number; hideOnMobile?: boolean }) {
  return (
    <motion.div
      className={`pointer-events-none absolute z-20 max-w-[210px] rounded-2xl border ${accentBorder} bg-white/95 px-3.5 py-2.5 text-[12px] font-medium leading-snug text-neutral-800 shadow-[0_12px_40px_-12px_rgba(79,70,229,0.2),0_0_0_1px_rgba(255,255,255,0.9)_inset] backdrop-blur-md ${hideOnMobile ? "hidden md:block" : ""} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: [0, -4, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        y: { delay: delay + 0.35, duration: 6, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" aria-hidden />
      {text}
    </motion.div>
  );
}

function DesktopTeamPreview({ phase }: { phase: "simple" | "rich" }) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] bg-white shadow-inner ring-1 ring-neutral-200/70">
      <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/80 px-3 py-2">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-red-300/90" />
          <span className="h-2 w-2 rounded-full bg-amber-300/90" />
          <span className="h-2 w-2 rounded-full bg-emerald-300/90" />
        </div>
        <div className="mx-auto flex max-w-[55%] flex-1 items-center gap-1.5 rounded-lg bg-white px-2 py-1 ring-1 ring-neutral-100">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            <span className="truncate text-[10px] font-medium text-neutral-500">myteamspace.cc/team/city-juniors</span>
        </div>
      </div>

      <div className="border-b border-neutral-100 bg-gradient-to-r from-white to-indigo-50/30 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
              C
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-neutral-900">City Juniors U12</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-neutral-500">
                <AvatarStack />
                <span className="text-neutral-300">·</span>
                <span className="text-indigo-600/90">Live</span>
              </div>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-0.5 rounded-full bg-neutral-50 px-2 py-1 text-xs ring-1 ring-neutral-100"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span aria-hidden>🔥</span>
            <span className="text-[11px] font-semibold text-neutral-600">8</span>
          </motion.div>
        </div>
      </div>

      <div className="max-h-[220px] space-y-2.5 overflow-hidden p-3.5 sm:max-h-[260px]">
        <AnimatePresence mode="wait">
          {phase === "simple" ? (
            <motion.div
              key="simple"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-2.5"
            >
              <div className="h-2.5 w-[45%] rounded-full bg-neutral-100" />
              <div className="h-2.5 w-[70%] rounded-full bg-neutral-100" />
              <div className="h-20 rounded-xl bg-neutral-50 ring-1 ring-neutral-100/80" />
            </motion.div>
          ) : (
            <motion.div
              key="rich"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-2.5"
            >
              <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-white shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">Announcement</p>
                <p className="mt-0.5 text-[11px] font-medium leading-snug">Regional finals · Sunday 10:00</p>
              </div>
              <div className="rounded-xl bg-neutral-50/90 p-2.5 ring-1 ring-neutral-100">
                <p className="text-[10px] font-semibold text-neutral-500">This week</p>
                <div className="mt-1.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-600">Tue training</span>
                    <span className="font-semibold text-indigo-600">18:00</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-600">Thu match</span>
                    <span className="font-medium text-neutral-500">19:30</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-amber-50/90 px-2.5 py-2 ring-1 ring-amber-100/80">
                <span className="text-lg" aria-hidden>
                  🏆
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-amber-800/90">Player of the week</p>
                  <p className="truncate text-[11px] font-medium text-neutral-700">Maya · 3 goals</p>
                </div>
                <span className="text-[10px] text-amber-700/80">+120 XP</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50/80 px-2 py-1.5 ring-1 ring-emerald-100/60">
                <span className="text-xs">🚌</span>
                <p className="text-[11px] font-medium text-emerald-900/80">Away trip · kit list updated</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PhoneTeamPreview({ phase }: { phase: "simple" | "rich" }) {
  return (
    <div className="flex h-full flex-col bg-neutral-50">
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <span className="text-[10px] font-semibold text-neutral-400">9:41</span>
        <div className="mx-auto h-4 w-16 rounded-full bg-neutral-900/90" />
        <span className="w-6" />
      </div>
      <div className="border-b border-neutral-100 bg-white px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-[10px] font-bold text-white">
              C
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-900">City Juniors U12</p>
              <p className="text-[9px] text-indigo-600">Today · 18:00</p>
            </div>
          </div>
          <AvatarStack className="scale-90" />
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden p-2.5">
        {phase === "rich" ? (
          <>
            <div className="rounded-lg bg-indigo-600 px-2.5 py-2 text-[10px] font-medium leading-tight text-white">
              Bus leaves at 17:15 — don&apos;t forget water bottles
            </div>
            <div className="rounded-lg bg-white p-2 ring-1 ring-neutral-100">
              <p className="text-[9px] font-semibold text-neutral-400">Next</p>
              <p className="mt-0.5 text-[11px] font-semibold text-neutral-800">Training · Field A</p>
              <p className="text-[10px] text-indigo-600">Tap for map</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-white p-2 ring-1 ring-neutral-100">
              {["❤️", "👏", "🔥"].map((e) => (
                <span key={e} className="rounded-md bg-neutral-50 px-1.5 py-0.5 text-[11px]">
                  {e} <span className="text-[9px] text-neutral-400">4</span>
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-2 pt-1">
            <div className="h-2 w-[50%] rounded-full bg-neutral-200" />
            <div className="h-16 rounded-lg bg-white ring-1 ring-neutral-100" />
          </div>
        )}
      </div>
    </div>
  );
}

function HeroProductVisual({ phase, cycle }: { phase: "simple" | "rich"; cycle: number }) {
  return (
    <motion.div
      key={cycle}
      className={`relative mx-auto w-full max-w-[520px] ${accentGlow}`}
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      {FLOATING.map((f, i) => (
        <FloatingLiveCard
          key={`${f.text}-${cycle}`}
          text={f.text}
          className={f.className}
          delay={0.1 * i}
          hideOnMobile={f.hideOnMobile}
        />
      ))}

      <div className="relative z-10 pt-8 sm:pt-4">
        <div className="rounded-[1.75rem] border border-neutral-200/80 bg-gradient-to-b from-neutral-100/60 to-neutral-50/80 p-2.5 shadow-[0_40px_80px_-32px_rgba(15,23,42,0.35)]">
          <DesktopTeamPreview phase={phase} />
        </div>

        <motion.div
          className="absolute -right-1 bottom-2 z-20 w-[34%] max-w-[158px] sm:-right-2 sm:bottom-4 sm:max-w-[172px]"
          initial={{ opacity: 0, y: 16, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ delay: 0.5, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="rounded-[2.15rem] border-[7px] border-neutral-900 bg-neutral-900 p-[5px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.45)]"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="overflow-hidden rounded-[1.55rem] bg-neutral-900">
              <div className="aspect-[9/18.2]">
                <PhoneTeamPreview phase={phase} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute -left-4 top-1/3 z-0 hidden h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl sm:block"
          animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -right-8 top-0 z-0 h-40 w-40 rounded-full bg-violet-400/15 blur-3xl"
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      </div>
    </motion.div>
  );
}

function ModuleCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border border-neutral-100/90 bg-white shadow-[0_4px_24px_-14px_rgba(15,23,42,0.08)] transition hover:border-indigo-200/60 hover:shadow-[0_12px_40px_-18px_rgba(79,70,229,0.12)] ${accentRing}`}
    >
      <div className="min-h-[128px] flex-1 p-3">{children}</div>
      <div className="border-t border-neutral-50 bg-neutral-50/40 px-3 py-2.5">
        <p className="text-[13px] font-semibold tracking-tight text-neutral-900">{title}</p>
        <p className="text-[11px] text-neutral-400">Tap-ready on phones</p>
      </div>
    </div>
  );
}

function EverythingGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ModuleCard title="Schedule">
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-indigo-50/80 px-2 py-1.5 ring-1 ring-indigo-100/60">
            <span className="text-[11px] font-medium text-neutral-700">Tue</span>
            <span className="text-[11px] font-bold text-indigo-600">18:00</span>
          </div>
          <div className="flex justify-between rounded-lg bg-neutral-50 px-2 py-1.5 text-[11px] text-neutral-600">
            <span>Thu match</span>
            <span className="font-medium">19:30</span>
          </div>
          <div className="flex justify-between rounded-lg bg-neutral-50 px-2 py-1.5 text-[11px] text-neutral-600">
            <span>Sun trip</span>
            <span className="font-medium">08:00</span>
          </div>
        </div>
      </ModuleCard>

      <ModuleCard title="Announcements">
        <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 p-2.5 text-white">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-white/70">New</p>
          <p className="mt-0.5 text-[11px] font-medium leading-snug">Photos from last game are up!</p>
        </div>
        <div className="mt-2 flex gap-1">
          <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px]">❤️ 14</span>
          <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px]">👏 9</span>
        </div>
      </ModuleCard>

      <ModuleCard title="Results">
        <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-2 py-2 ring-1 ring-neutral-100">
          <div>
            <p className="text-[10px] text-neutral-500">Last match</p>
            <p className="text-sm font-bold text-neutral-900">3 – 1</p>
            <p className="text-[10px] text-emerald-600">Win vs Lions</p>
          </div>
          <div className="text-2xl" aria-hidden>
            ⚽
          </div>
        </div>
      </ModuleCard>

      <ModuleCard title="Team gallery">
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-md bg-gradient-to-br from-indigo-100/80 to-amber-100/60 ring-1 ring-white"
            />
          ))}
        </div>
      </ModuleCard>

      <ModuleCard title="Trips">
        <div className="flex gap-2 rounded-lg bg-emerald-50/90 p-2 ring-1 ring-emerald-100/70">
          <span className="text-lg">🚌</span>
          <div>
            <p className="text-[11px] font-semibold text-emerald-900">Regional cup</p>
            <p className="text-[10px] text-emerald-700/90">Sat · depart 07:30</p>
          </div>
        </div>
      </ModuleCard>

      <ModuleCard title="Achievements">
        <div className="flex flex-wrap gap-1">
          {["⭐ First goal", "🎯 Streak x5", "🏅 Team player"].map((t) => (
            <span
              key={t}
              className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-medium text-amber-900 ring-1 ring-amber-100"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <div className="h-full w-[72%] rounded-full bg-indigo-500" />
        </div>
        <p className="mt-1 text-[10px] text-neutral-500">Level 4 · 720 XP</p>
      </ModuleCard>

      <ModuleCard title="Team rules">
        <ol className="space-y-1 text-[10px] leading-relaxed text-neutral-600">
          <li>
            <span className="font-semibold text-indigo-600">1.</span> Respect coaches & refs
          </li>
          <li>
            <span className="font-semibold text-indigo-600">2.</span> Arrive 15 min early
          </li>
          <li>
            <span className="font-semibold text-indigo-600">3.</span> Hydrate always
          </li>
        </ol>
      </ModuleCard>

      <ModuleCard title="Attendance">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-neutral-900">18</p>
            <p className="text-[10px] text-neutral-500">of 24 present</p>
          </div>
          <div className="h-14 w-10 rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400" />
        </div>
        <p className="mt-2 text-[10px] font-medium text-emerald-600">+3 vs last week</p>
      </ModuleCard>

      <ModuleCard title="MVP player">
        <div className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-200 to-indigo-200 text-sm font-bold text-indigo-900 ring-2 ring-amber-300/80">
            MK
          </div>
          <div>
            <p className="text-[12px] font-semibold text-neutral-900">Maya K.</p>
            <p className="text-[10px] text-amber-700">Player of the week</p>
          </div>
        </div>
      </ModuleCard>

      <ModuleCard title="Sponsors">
        <div className="flex flex-wrap items-center justify-center gap-2 opacity-80">
          <span className="rounded-md bg-neutral-200 px-2 py-1 text-[9px] font-bold tracking-tight text-neutral-600">
            LOCAL
          </span>
          <span className="rounded-md bg-neutral-800 px-2 py-1 text-[9px] font-bold text-white">SPORT+</span>
        </div>
      </ModuleCard>

      <ModuleCard title="Coach contacts">
        <div className="flex items-center gap-2 rounded-lg bg-neutral-50 p-2 ring-1 ring-neutral-100">
          <div className="h-9 w-9 rounded-full bg-indigo-100" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-neutral-900">Coach Anna</p>
            <p className="text-[10px] text-indigo-600">Message · Call</p>
          </div>
        </div>
      </ModuleCard>

      <ModuleCard title="Team leaderboard">
        <div className="space-y-1.5">
          {[
            { n: "1", name: "Maya", xp: "420", c: "bg-amber-200" },
            { n: "2", name: "Leo", xp: "380", c: "bg-neutral-200" },
            { n: "3", name: "Sofia", xp: "355", c: "bg-orange-200/80" },
          ].map((row) => (
            <div key={row.n} className="flex items-center gap-2 rounded-md bg-neutral-50/90 px-2 py-1 ring-1 ring-neutral-100/80">
              <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${row.c}`}>{row.n}</span>
              <span className="flex-1 text-[11px] font-medium text-neutral-800">{row.name}</span>
              <span className="text-[10px] font-semibold text-indigo-600">{row.xp} XP</span>
            </div>
          ))}
        </div>
      </ModuleCard>
    </div>
  );
}

function SetupSection() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="border-y border-neutral-100/90 bg-gradient-to-b from-white to-indigo-50/20">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-500/90">Setup in minutes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Ready before your next training session.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-500">
              Set up your team page in about five minutes — toggle blocks, pick colors, drop your logo, and share one
              link. Updates show up instantly for everyone.
            </p>
          </div>

          <div className="relative rounded-3xl border border-neutral-100/90 bg-white p-6 shadow-[0_24px_60px_-24px_rgba(79,70,229,0.12)]">
            <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-sm font-semibold text-neutral-800">Page editor</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                Saved
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium text-neutral-500">Blocks</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Schedule", "Results", "Trips", "MVP"].map((label, i) => (
                    <motion.button
                      key={label}
                      type="button"
                      className={`rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition ${
                        (step + i) % 2 === 0
                          ? "bg-indigo-600 text-white ring-indigo-500"
                          : "bg-neutral-100 text-neutral-500 ring-neutral-200/80"
                      }`}
                      animate={{ scale: step === i ? [1, 1.04, 1] : 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-neutral-500">Team colors</p>
                <div className="mt-2 flex gap-2">
                  {["#4f46e5", "#0ea5e9", "#f97316", "#10b981"].map((hex, i) => (
                    <motion.span
                      key={hex}
                      className={`h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-white ${
                        step === i ? "ring-indigo-400" : "ring-black/5"
                      }`}
                      style={{ backgroundColor: hex }}
                      animate={step === i ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                      transition={{ duration: 0.45 }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3 ring-1 ring-neutral-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 text-[10px] font-semibold text-indigo-600">
                  Logo
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-neutral-800">Upload team crest</p>
                  <p className="text-[10px] text-neutral-500">PNG or JPG · shows on every page</p>
                </div>
              </div>
              <motion.div
                className="rounded-xl border border-neutral-100 bg-gradient-to-r from-indigo-50/50 to-white p-3 ring-1 ring-indigo-100/40"
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600/90">Live preview</p>
                <p className="mt-1 text-[11px] text-neutral-600">Parents see changes the moment you hit save.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const COMMUNITIES = [
  "Football academies",
  "Dance schools",
  "Swimming clubs",
  "Cheer teams",
  "School clubs",
  "Camps",
] as const;

type ExploreDemo = {
  href: string;
  name: string;
  category: string;
  headerBg: string;
  iconBg: string;
  icon: string;
  ringColor: string;
  previews: { label: string; value: string }[];
};

const EXPLORE_DEMOS: ExploreDemo[] = [
  {
    href: "/team/city-juniors",
    name: "Tigers Basketball Academy",
    category: "Basketball",
    headerBg: "bg-gradient-to-r from-amber-100/95 via-orange-50/90 to-amber-50/80",
    iconBg: "bg-amber-200/70 text-amber-950",
    icon: "🏀",
    ringColor: "ring-amber-200/60",
    previews: [
      { label: "Next training", value: "Monday, 18:00" },
      { label: "Achievement", value: "12 new badges unlocked" },
      { label: "Team points", value: "2,450" },
    ],
  },
  {
    href: "/team/riga-swim",
    name: "Blue Wave Swim Team",
    category: "Swimming",
    headerBg: "bg-gradient-to-r from-sky-100/95 via-cyan-50/90 to-blue-50/80",
    iconBg: "bg-sky-200/70 text-sky-950",
    icon: "🌊",
    ringColor: "ring-sky-200/60",
    previews: [
      { label: "Next training", value: "Wednesday, 17:30" },
      { label: "Achievement", value: "Mia earned Gold Star" },
      { label: "Parent update", value: "New schedule added" },
    ],
  },
  {
    href: "/team/dance-kids",
    name: "Little Stars Gymnastics",
    category: "Gymnastics",
    headerBg: "bg-gradient-to-r from-fuchsia-100/90 via-pink-50/85 to-violet-50/75",
    iconBg: "bg-fuchsia-200/60 text-fuchsia-950",
    icon: "⭐",
    ringColor: "ring-fuchsia-200/50",
    previews: [
      { label: "Next training", value: "Friday, 16:00" },
      { label: "Achievement", value: "8 kids completed level 2" },
      { label: "Team badges", value: "34" },
    ],
  },
  {
    href: "/team/city-juniors",
    name: "Future FC Academy",
    category: "Football",
    headerBg: "bg-gradient-to-r from-emerald-100/95 via-lime-50/80 to-green-50/75",
    iconBg: "bg-emerald-200/70 text-emerald-950",
    icon: "⚽",
    ringColor: "ring-emerald-200/55",
    previews: [
      { label: "Next match", value: "Saturday, 11:00" },
      { label: "Achievement", value: "Team streak: 5 wins" },
      { label: "Parent update", value: "New photos uploaded" },
    ],
  },
  {
    href: "/team/riga-swim",
    name: "North Tennis Club",
    category: "Tennis",
    headerBg: "bg-gradient-to-r from-slate-200/90 via-teal-50/85 to-cyan-50/70",
    iconBg: "bg-slate-700/90 text-white",
    icon: "🎾",
    ringColor: "ring-slate-200/70",
    previews: [
      { label: "Next session", value: "Tuesday, 15:30" },
      { label: "Achievement", value: "4 new personal records" },
      { label: "Team points", value: "1,980" },
    ],
  },
  {
    href: "/team/dance-kids",
    name: "Riga Dance Kids",
    category: "Dance",
    headerBg: "bg-gradient-to-r from-violet-100/90 via-rose-50/80 to-orange-50/65",
    iconBg: "bg-violet-200/65 text-violet-950",
    icon: "🎵",
    ringColor: "ring-violet-200/55",
    previews: [
      { label: "Next class", value: "Thursday, 18:30" },
      { label: "Achievement", value: "New performance video added" },
      { label: "Team badges", value: "27" },
    ],
  },
];

function ExploreTeamSpacesSection() {
  return (
    <section className="border-t border-neutral-100/80 bg-gradient-to-b from-white/80 to-neutral-50/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">Explore ready-made Team Spaces</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
            See how different teams can use MyTeamSpace to share updates, motivate kids, and keep parents in the loop.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EXPLORE_DEMOS.map((demo, i) => (
            <motion.article
              key={`${demo.name}-${i}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-48px 0px" }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-100/90 bg-white shadow-[0_4px_28px_-14px_rgba(15,23,42,0.08)] ring-1 ring-neutral-50 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_48px_-20px_rgba(15,23,42,0.12)]"
            >
              <div className={`relative px-5 pb-4 pt-5 ${demo.headerBg}`}>
                <div className="absolute inset-x-0 top-0 h-1 bg-white/40" aria-hidden />
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm ring-2 ring-white/80 ${demo.iconBg} ${demo.ringColor}`}
                    aria-hidden
                  >
                    {demo.icon}
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-neutral-900">{demo.name}</h3>
                    <p className="mt-0.5 text-[12px] font-medium text-neutral-500">{demo.category}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-5 pb-5 pt-1">
                <ul className="space-y-2.5 border-t border-neutral-100/80 pt-4">
                  {demo.previews.map((row) => (
                    <li key={row.label} className="flex flex-col gap-0.5 rounded-xl bg-neutral-50/80 px-3 py-2 ring-1 ring-neutral-100/80">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{row.label}</span>
                      <span className="text-[12px] font-medium leading-snug text-neutral-800">{row.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-1 items-end">
                  <Link
                    href={demo.href}
                    className="inline-flex w-full items-center justify-center rounded-full border border-neutral-200/90 bg-white py-2.5 text-[13px] font-semibold text-neutral-800 shadow-sm transition group-hover:border-indigo-200 group-hover:bg-indigo-50/40 group-hover:text-indigo-800"
                  >
                    View demo
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-[13px] leading-relaxed text-neutral-400">
          Every space can be customized with your team colors, logo, schedule, achievements, and updates.
        </p>
      </div>
    </section>
  );
}

export function HomeLanding() {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<"simple" | "rich">("simple");

  useEffect(() => {
    const t = setInterval(() => setCycle((c) => c + 1), 12000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setPhase("simple");
    const t = setTimeout(() => setPhase("rich"), 2600);
    const t2 = setTimeout(() => setPhase("simple"), 8800);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [cycle]);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${accentSoft} to-[#f8fafc] text-neutral-900`}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 sm:px-8">
        <span className="text-[15px] font-semibold tracking-tight text-neutral-900">MyTeamSpace</span>
        <div className="flex items-center gap-2">
          <span className="hidden text-[12px] text-neutral-400 sm:inline">A digital home for your team</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.25)]" title="All systems ready" />
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-8 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-10 xl:gap-14">
            <div className="max-w-xl lg:max-w-none">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                No app download • just one link
              </p>
              <h1 className="mt-4 text-[2.15rem] font-semibold leading-[1.1] tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.85rem]">
                Your team, finally in one space.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-neutral-500 sm:text-[1.06rem]">
                Schedules, announcements, achievements, trips, and gamification — beautifully organized for coaches,
                parents, and kids.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/team/city-juniors"
                  className={`inline-flex min-h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium transition ${accentBtn}`}
                >
                  View demo team
                </Link>
              </div>
              <p className="mt-7 text-sm font-medium text-neutral-400">
                Works in any browser. No login needed for parents.
              </p>
            </div>

            <div className="relative mx-auto min-h-[420px] w-full max-w-lg lg:mx-0 lg:max-w-none lg:min-h-[480px]">
              <HeroProductVisual phase={phase} cycle={cycle} />
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-100/80 bg-white/50 backdrop-blur-[2px]">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  title: "Easy for coaches",
                  text: "Update schedules, announcements, trips, and results in minutes.",
                  emoji: "🧢",
                },
                {
                  title: "Clear for parents",
                  text: "Everything important in one link — always up to date.",
                  emoji: "👨‍👩‍👧",
                },
                {
                  title: "Motivating for kids",
                  text: "Badges, trophies, streaks, and team spirit built in.",
                  emoji: "⭐",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`relative overflow-hidden rounded-3xl border border-neutral-100/90 bg-white p-8 shadow-[0_2px_28px_-10px_rgba(79,70,229,0.08)]`}
                >
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-100/40 blur-2xl" aria-hidden />
                  <span className="text-2xl" aria-hidden>
                    {card.emoji}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold tracking-tight text-neutral-900">{card.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">{card.text}</p>
                  <div className="mt-4 flex items-center gap-1">
                    <AvatarStack />
                    <span className="text-[11px] text-neutral-400">Loved by families</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">Everything your team needs.</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
              Real building blocks — each designed for quick scanning on a phone, calm reading on a tablet.
            </p>
          </div>
          <div className="mt-14">
            <EverythingGrid />
          </div>
        </section>

        <SetupSection />

        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:py-24">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Built for modern youth communities
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-[15px] text-neutral-500">
            One calm home for the chaos of schedules, feelings, and big little wins.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {COMMUNITIES.map((name) => (
              <div
                key={name}
                className="rounded-2xl border border-neutral-100 bg-white/90 px-5 py-2.5 text-sm font-medium text-neutral-800 shadow-sm ring-1 ring-neutral-50 transition hover:border-indigo-200/80 hover:shadow-md"
              >
                {name}
              </div>
            ))}
          </div>
        </section>

        <ExploreTeamSpacesSection />

        <footer className="border-t border-neutral-100 py-12 text-center">
          <p className="text-sm font-medium text-neutral-600">MyTeamSpace</p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-neutral-400">
            A beautiful digital home for your team — so everyone feels a little more connected.
          </p>
        </footer>
      </main>
    </div>
  );
}
