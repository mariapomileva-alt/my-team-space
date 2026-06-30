"use client";

import { SetupSection } from "@/components/landing/setup-section";
import { LandingFeatureGroupsSection } from "@/components/landing/landing-feature-groups";
import {
  LandingBeforeAfterSection,
  LandingBuildFlowSection,
  LandingFinalCtaSection,
  LandingPrideSection,
  LandingSocialQuotesSection,
} from "@/components/landing/landing-marketing-sections";
import { SocialProofAvatars } from "@/components/landing/social-proof-avatars";
import type { SocialProofVariant } from "@/components/landing/social-proof-avatars";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { ACADEMY_PLAN_PRICE, TEAM_PLAN_PRICE } from "@/lib/marketing/pricing";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const accentBtn =
  "bg-[#6C5CE7] text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-6px_rgba(108,92,231,0.45)] hover:bg-[#5b4bd6] active:scale-[0.99]";
const accentBorder = "border-[#6C5CE7]/20";
const accentSoft = "from-[#6C5CE7]/8 via-white to-[#FF6B9D]/6";
const accentGlow = "shadow-[0_0_80px_-20px_rgba(108,92,231,0.28)]";

const FLOATING: { text: string; className: string }[] = [
  { text: "Training today · 18:00", className: "left-0 top-[10%] sm:left-[-2%]" },
  { text: "New tournament results", className: "right-0 top-[16%] sm:right-[-4%]" },
  { text: "Coach updated the schedule", className: "right-[-4%] top-[44%] sm:right-[-6%]" },
  { text: "Trip details updated", className: "left-0 bottom-[26%] sm:left-[-2%]" },
];

function FloatingLiveCard({ text, className }: { text: string; className: string }) {
  return (
    <div
      className={`pointer-events-none absolute z-10 hidden max-w-[200px] rounded-2xl border ${accentBorder} bg-white px-3.5 py-2.5 text-[12px] font-medium leading-snug text-neutral-800 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] md:block ${className}`}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" aria-hidden />
      {text}
    </div>
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
            <span className="truncate text-[10px] font-medium text-neutral-500">myteamspace.cc/city-juniors</span>
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
                <SocialProofAvatars variant="mixed" hideLabel size="sm" />
                <span className="text-neutral-300">·</span>
                <span className="text-indigo-600/90">Live</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 rounded-full bg-neutral-50 px-2 py-1 text-xs ring-1 ring-neutral-100">
            <span aria-hidden>🔥</span>
            <span className="text-[11px] font-semibold text-neutral-600">8</span>
          </div>
        </div>
      </div>

      <div className="min-h-[200px] max-h-[220px] space-y-2.5 overflow-hidden p-3.5 sm:min-h-[240px] sm:max-h-[260px]">
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
          <SocialProofAvatars variant="mixed" hideLabel size="sm" className="scale-95 origin-right" />
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

function HeroProductVisual({ phase }: { phase: "simple" | "rich" }) {
  return (
    <motion.div
      className={`relative mx-auto w-full max-w-[480px] min-h-[320px] pt-4 sm:min-h-[380px] sm:max-w-[520px] sm:pt-6 ${accentGlow}`}
      initial={false}
    >
      {FLOATING.map((f) => (
        <FloatingLiveCard key={f.text} text={f.text} className={f.className} />
      ))}

      <motion.div className="relative z-10 mt-3 sm:mt-5">
        <div className="rounded-[1.75rem] border border-neutral-200/80 bg-gradient-to-b from-neutral-100/60 to-neutral-50/80 p-2.5 shadow-[0_40px_80px_-32px_rgba(15,23,42,0.35)]">
          <DesktopTeamPreview phase={phase} />
        </div>

        <motion.div
          className="absolute -right-1 bottom-2 z-20 w-[34%] max-w-[158px] sm:-right-2 sm:bottom-4 sm:max-w-[172px]"
          initial={false}
          style={{ rotate: -2 }}
        >
          <div className="rounded-[2.15rem] border-[7px] border-neutral-900 bg-neutral-900 p-[5px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.45)]">
            <div className="overflow-hidden rounded-[1.55rem] bg-neutral-900">
              <div className="aspect-[9/18.2]">
                <PhoneTeamPreview phase={phase} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}


const COMMUNITY_PILLS = [
  "Football academies",
  "Dance schools",
  "Swimming clubs",
  "Cheer teams",
  "School clubs",
] as const;

const COMMUNITY_PLUS_LABEL = "+ Your community";

export function HomeLanding() {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<"simple" | "rich">("rich");

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
    <div className={`bg-gradient-to-b ${accentSoft} to-[#f8fafc] text-neutral-900`}>
        <section className="mx-auto max-w-6xl px-6 pb-14 pt-4 sm:px-8 sm:pb-20 lg:pb-20">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-12 xl:gap-14">
            <div className="max-w-xl lg:max-w-none">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6C5CE7]">
                Team page builder
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-brand)] text-[2rem] font-bold leading-[1.1] tracking-tight text-[#1A1C23] sm:text-4xl lg:text-[2.75rem]">
                The modern home page
                <span className="mt-1 block bg-[linear-gradient(135deg,#6C5CE7,#FF6B9D,#FFA94D)] bg-clip-text text-transparent">
                  for your sports team.
                </span>
              </h1>
              <p className="mt-5 text-[17px] leading-relaxed text-neutral-600 sm:text-lg">
                One professional page for schedule, photos, contacts, and updates — the link parents bookmark instead
                of asking again.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/admin/signup"
                  className={`inline-flex min-h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium transition ${accentBtn}`}
                >
                  Create Your Team Space
                </Link>
                <Link
                  href="/city-juniors"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-200/90 bg-white/90 px-7 text-[15px] font-medium text-neutral-800 shadow-sm backdrop-blur-sm transition hover:border-[#6C5CE7]/30 hover:text-[#6C5CE7] active:scale-[0.99]"
                >
                  View Demo
                </Link>
              </div>
              <p className="mt-7 text-sm font-medium text-neutral-400">
                No coding required · Opens in any browser · No app for parents
              </p>
            </div>

            <div className="relative isolate mx-auto w-full max-w-md pt-2 sm:max-w-lg sm:pt-3 lg:mx-0 lg:max-w-none lg:pt-4">
              <HeroProductVisual phase={phase} />
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-100/80 bg-white/50 backdrop-blur-[2px]">
          <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16">
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
              {(
                [
                  {
                    title: "Less admin for you",
                    text: "Post once. Parents stop asking where, when, and how much.",
                    emoji: "🧢",
                    social: "coaches" as SocialProofVariant,
                  },
                  {
                    title: "Calm for parents",
                    text: "Schedule, fees, and contacts — always current, always in one place.",
                    emoji: "👨‍👩‍👧",
                    social: "parents" as SocialProofVariant,
                  },
                  {
                    title: "Pride for athletes",
                    text: "Wins, photos, and team moments they actually want to show.",
                    emoji: "⭐",
                    social: "kids" as SocialProofVariant,
                  },
                ] as const
              ).map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-neutral-100/90 bg-white p-6 shadow-[0_2px_28px_-10px_rgba(79,70,229,0.08)] sm:p-8"
                >
                  <span className="text-2xl" aria-hidden>
                    {card.emoji}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold tracking-tight text-neutral-900">{card.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">{card.text}</p>
                  <SocialProofAvatars variant={card.social} className="mt-5" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <LandingBeforeAfterSection />

        <LandingPrideSection />

        <LandingFeatureGroupsSection />

        <LandingBuildFlowSection />

        <SetupSection />

        <LandingSocialQuotesSection />

        <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-brand)] text-2xl font-bold tracking-tight text-[#1A1C23] sm:text-3xl lg:text-[2rem]">
              For every kind of team
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-500 sm:text-base">
              Academies, clubs, studios, and school teams — same calm home page.
            </p>
          </div>
          <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3 sm:mt-14 sm:gap-4">
            {COMMUNITY_PILLS.map((name) => (
              <li key={name}>
                <span className="inline-flex min-h-11 items-center rounded-full border border-black/[0.06] bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.08)]">
                  {name}
                </span>
              </li>
            ))}
            <li>
              <span className="inline-flex min-h-11 items-center rounded-full border border-[#6C5CE7]/25 bg-violet-50/50 px-6 py-2.5 text-sm font-semibold text-[#6C5CE7] ring-1 ring-[#6C5CE7]/10">
                {COMMUNITY_PLUS_LABEL}
              </span>
            </li>
          </ul>
        </section>

        <LandingFinalCtaSection />

        <section className="border-t border-neutral-100/80 bg-white/60">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6C5CE7]">Pricing</p>
              <h2 className="mt-3 font-[family-name:var(--font-brand)] text-3xl font-bold tracking-tight text-[#1A1C23] sm:text-4xl">
                Professional pricing. No surprises.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
                Team Plan {TEAM_PLAN_PRICE}/month for one team. Academy Plan {ACADEMY_PLAN_PRICE}/month when you&apos;re
                ready to grow.
              </p>
            </div>
            <div className="mt-12">
              <PricingPlans />
            </div>
            <p className="mt-8 text-center text-sm text-neutral-500">
              <Link href="/pricing" className="font-medium text-[#6C5CE7] hover:underline">
                View full pricing & FAQ
              </Link>
            </p>
          </div>
        </section>
    </div>
  );
}
