"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

const FLOATING = [
  "Today’s training: 18:00",
  "New result added",
  "Player of the week",
  "Trip details updated",
  "+1 trophy unlocked",
] as const;

function FloatingCard({ text, className, delay }: { text: string; className: string; delay: number }) {
  return (
    <motion.div
      className={`pointer-events-none absolute z-20 max-w-[200px] rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 text-[13px] font-medium leading-snug text-neutral-800 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.04)] backdrop-blur-md ${className}`}
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.div>
  );
}

function ProductMockup({ phase }: { phase: "simple" | "rich" }) {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="rounded-[1.75rem] border border-neutral-200/90 bg-neutral-100/40 p-2.5 shadow-[0_32px_64px_-24px_rgba(15,23,42,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset]">
        <div className="overflow-hidden rounded-[1.35rem] bg-white shadow-inner ring-1 ring-neutral-200/60">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
            <div className="flex gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
            </div>
            <div className="mx-auto h-2 flex-1 max-w-[120px] rounded-full bg-neutral-100" />
          </div>
          <div className="space-y-3 p-4">
            <AnimatePresence mode="wait">
              {phase === "simple" ? (
                <motion.div
                  key="simple"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-2.5 pt-1"
                >
                  <div className="h-3 w-[55%] rounded-full bg-neutral-100" />
                  <div className="h-3 w-[78%] rounded-full bg-neutral-100" />
                  <div className="h-24 rounded-xl bg-neutral-50" />
                </motion.div>
              ) : (
                <motion.div
                  key="rich"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-2.5 pt-1"
                >
                  <motion.div
                    layout
                    className="rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 px-3 py-2 ring-1 ring-sky-100/80"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="h-2 w-24 rounded-full bg-sky-200/80" />
                    <div className="mt-1.5 h-2 w-full max-w-[200px] rounded-full bg-neutral-200/80" />
                  </motion.div>
                  <div className="flex gap-2">
                    <div className="h-14 flex-1 rounded-lg bg-neutral-50 ring-1 ring-neutral-100" />
                    <div className="h-14 flex-1 rounded-lg bg-neutral-50 ring-1 ring-neutral-100" />
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50/90 px-3 py-2 ring-1 ring-amber-100/80">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200/60 text-xs">🏆</div>
                    <div className="flex-1 space-y-1">
                      <div className="h-2 w-20 rounded-full bg-amber-200/70" />
                      <div className="h-1.5 w-28 rounded-full bg-amber-100" />
                    </div>
                  </div>
                  <div className="h-10 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 ring-1 ring-emerald-100/60" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockMiniPreview({ kind }: { kind: string }) {
  const previews: Record<string, ReactNode> = {
    announcement: (
      <div className="space-y-1.5 p-1">
        <div className="h-2 w-full rounded-full bg-orange-100" />
        <div className="h-1.5 w-[80%] rounded-full bg-neutral-100" />
      </div>
    ),
    schedule: (
      <div className="space-y-1 p-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between gap-1">
            <div className="h-1.5 flex-1 rounded-full bg-neutral-100" />
            <div className="h-1.5 w-6 rounded-full bg-sky-100" />
          </div>
        ))}
      </div>
    ),
    results: (
      <div className="flex justify-center gap-1 p-1">
        <div className="h-6 w-6 rounded-md bg-amber-100" />
        <div className="h-6 w-6 rounded-md bg-neutral-100" />
        <div className="h-6 w-6 rounded-md bg-orange-100" />
      </div>
    ),
    table: (
      <div className="grid grid-cols-3 gap-0.5 p-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-sm bg-neutral-100" />
        ))}
      </div>
    ),
    contacts: (
      <div className="space-y-1 p-1">
        <div className="mx-auto h-5 w-5 rounded-full bg-sky-100" />
        <div className="h-1.5 w-full rounded-full bg-neutral-100" />
      </div>
    ),
    logo: (
      <div className="flex items-center justify-center p-2">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-200 to-indigo-100 ring-1 ring-white" />
      </div>
    ),
    gallery: (
      <div className="grid grid-cols-3 gap-0.5 p-1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="aspect-square rounded-md bg-gradient-to-br from-neutral-100 to-neutral-50" />
        ))}
      </div>
    ),
    trips: (
      <div className="space-y-1 p-1">
        <div className="h-2 w-full rounded-md bg-emerald-50 ring-1 ring-emerald-100/50" />
        <div className="h-1.5 w-2/3 rounded-full bg-neutral-100" />
      </div>
    ),
    achievements: (
      <div className="flex flex-wrap justify-center gap-0.5 p-1">
        {["⭐", "🎯", "🏅"].map((e) => (
          <span key={e} className="text-[10px]">
            {e}
          </span>
        ))}
      </div>
    ),
    mvp: (
      <div className="flex items-center gap-1.5 p-1">
        <div className="h-7 w-7 rounded-full bg-violet-100" />
        <div className="h-1.5 flex-1 rounded-full bg-neutral-100" />
      </div>
    ),
    rules: (
      <div className="space-y-1 p-1">
        <div className="h-1 w-full rounded-full bg-neutral-100" />
        <div className="h-1 w-full rounded-full bg-neutral-100" />
        <div className="h-1 w-[75%] rounded-full bg-neutral-100" />
      </div>
    ),
    sponsors: (
      <div className="flex items-center justify-center gap-1 p-1 opacity-70">
        <div className="h-3 w-8 rounded bg-neutral-200" />
        <div className="h-3 w-8 rounded bg-neutral-200" />
      </div>
    ),
  };

  return (
    <div className="flex aspect-[4/3] flex-col overflow-hidden rounded-xl bg-gradient-to-b from-white to-neutral-50/80 ring-1 ring-neutral-100">
      <div className="flex-1">{previews[kind] ?? previews.announcement}</div>
    </div>
  );
}

const BLOCK_GALLERY: { title: string; kind: string }[] = [
  { title: "Announcement banner", kind: "announcement" },
  { title: "Schedule", kind: "schedule" },
  { title: "Results", kind: "results" },
  { title: "Tournament table", kind: "table" },
  { title: "Coach contacts", kind: "contacts" },
  { title: "Team logo", kind: "logo" },
  { title: "Gallery", kind: "gallery" },
  { title: "Trips", kind: "trips" },
  { title: "Achievements", kind: "achievements" },
  { title: "MVP / Player of the week", kind: "mvp" },
  { title: "Team rules", kind: "rules" },
  { title: "Sponsors", kind: "sponsors" },
];

export function HomeLanding() {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<"simple" | "rich">("simple");

  useEffect(() => {
    const t = setInterval(() => {
      setCycle((c) => c + 1);
    }, 11000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setPhase("simple");
    const t = setTimeout(() => setPhase("rich"), 2800);
    const t2 = setTimeout(() => setPhase("simple"), 8200);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [cycle]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafbfc] via-white to-[#f4f6f9] text-neutral-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 sm:px-8">
        <span className="text-[15px] font-semibold tracking-tight text-neutral-800">MyTeamSpace</span>
        <div className="h-px w-8 bg-neutral-200/80 sm:w-12" aria-hidden />
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 lg:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-20">
            <div className="max-w-xl lg:max-w-none">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                One link for your whole team
              </p>
              <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                Transparent for parents.
                <br />
                Fun for kids.
                <br />
                Easy for coaches.
              </h1>
              <p className="mt-6 text-lg font-normal leading-relaxed text-neutral-500 sm:text-[1.05rem]">
                Create a beautiful team page in minutes — with schedules, announcements, results,
                trips, achievements, contacts, and gamification. No app download needed. Just one
                link for the whole team.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/sharky"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-neutral-900 px-7 text-[15px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition hover:bg-neutral-800 active:scale-[0.99]"
                >
                  View demo team page
                </Link>
                <Link
                  href="/admin/sharky"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-200/90 bg-white/80 px-7 text-[15px] font-medium text-neutral-800 shadow-sm backdrop-blur-sm transition hover:border-neutral-300 hover:bg-white active:scale-[0.99]"
                >
                  Try page editor
                </Link>
              </div>
              <p className="mt-8 text-sm font-medium text-neutral-400">
                No app. No login for parents. Works in any browser.
              </p>
            </div>

            <div className="relative mx-auto min-h-[440px] w-full max-w-lg lg:mx-0 lg:max-w-none lg:min-h-[500px]">
              <motion.div
                key={cycle}
                className="relative flex h-full min-h-[440px] items-center justify-center lg:min-h-[500px]"
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <FloatingCard
                  text={FLOATING[0]}
                  delay={0.15}
                  className="left-0 top-[6%] sm:left-[2%]"
                />
                <FloatingCard
                  text={FLOATING[1]}
                  delay={0.55}
                  className="right-0 top-[18%] sm:right-[-2%]"
                />
                <FloatingCard
                  text={FLOATING[2]}
                  delay={0.95}
                  className="bottom-[28%] left-[-4%] sm:left-[-6%]"
                />
                <FloatingCard
                  text={FLOATING[3]}
                  delay={1.35}
                  className="bottom-[14%] right-[-2%] sm:right-[-4%]"
                />
                <FloatingCard
                  text={FLOATING[4]}
                  delay={1.75}
                  className="right-[8%] top-[42%] sm:right-[4%]"
                />

                <div className="relative z-10 w-full max-w-[400px] pt-6 sm:pt-0">
                  <ProductMockup phase={phase} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-100/80 bg-white/40">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
            <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
              {[
                {
                  title: "Easy for coaches",
                  text: "Update schedules, announcements, trips, and results in minutes.",
                },
                {
                  title: "Clear for parents",
                  text: "Everything important in one link — always up to date.",
                },
                {
                  title: "Motivating for kids",
                  text: "Badges, trophies, achievements, and team spirit built in.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-neutral-100/90 bg-white/70 p-8 shadow-[0_2px_24px_-8px_rgba(15,23,42,0.06)] backdrop-blur-sm"
                >
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{card.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:py-24">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Ready-made blocks for every team
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[15px] text-neutral-500">
            Pick what your community needs — turn pieces on or off anytime.
          </p>
          <div className="mt-12 -mx-6 flex gap-4 overflow-x-auto px-6 pb-2 pt-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
            {BLOCK_GALLERY.map((b) => (
              <div
                key={b.title}
                className="w-[148px] shrink-0 snap-start sm:w-[140px] sm:shrink"
              >
                <div className="rounded-2xl border border-neutral-100/90 bg-white p-3 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)] ring-1 ring-neutral-50">
                  <BlockMiniPreview kind={b.kind} />
                  <p className="mt-2.5 text-center text-[11px] font-medium leading-tight text-neutral-500">
                    {b.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-neutral-100 py-10 text-center text-xs text-neutral-400">
          MyTeamSpace — for sports clubs, schools, and kids communities.
        </footer>
      </main>
    </div>
  );
}
