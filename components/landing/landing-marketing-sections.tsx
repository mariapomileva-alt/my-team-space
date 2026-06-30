"use client";

import { MarketingTeamPagePreview } from "@/components/landing/marketing-team-preview";
import Link from "next/link";
import { motion } from "framer-motion";

const accentBtn =
  "bg-[#6C5CE7] text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-6px_rgba(108,92,231,0.45)] hover:bg-[#5b4bd6] active:scale-[0.99]";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export function LandingPrideSection() {
  return (
    <section className="border-t border-neutral-100/80 bg-gradient-to-b from-white via-violet-50/20 to-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:py-24">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6C5CE7]">See the result</p>
          <h2 className="mt-3 font-[family-name:var(--font-brand)] text-3xl font-bold tracking-tight text-[#1A1C23] sm:text-4xl">
            Your team already deserves a page like this.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
            Not a spreadsheet. Not five links in a WhatsApp chat. One beautiful home — schedule, photos, wins, and
            contacts parents actually bookmark.
          </p>
        </motion.div>
        <div className="mt-12 sm:mt-14">
          <MarketingTeamPagePreview />
        </div>
      </div>
    </section>
  );
}

const BEFORE_ITEMS = [
  "Instagram bio with a broken link",
  "Schedule buried in WhatsApp",
  "Photos lost in Google Drive",
  "PDF nobody can find",
  "Parents asking again every week",
] as const;

const AFTER_ITEMS = [
  "One beautiful team page",
  "One link — easy to bookmark",
  "Everything updated in one place",
  "Calm for parents, less work for you",
] as const;

export function LandingBeforeAfterSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6C5CE7]">Less chaos</p>
        <h2 className="mt-3 font-[family-name:var(--font-brand)] text-2xl font-bold tracking-tight text-[#1A1C23] sm:text-3xl">
          From scattered links to one calm home
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-12">
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
          className="rounded-3xl border border-neutral-200/80 bg-neutral-50/80 p-6 sm:p-7"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">Before</p>
          <p className="mt-2 text-sm font-semibold text-neutral-700">Five places parents have to check</p>
          <ul className="mt-4 space-y-2.5">
            {BEFORE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-neutral-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-50/90 via-white to-white p-6 shadow-[0_8px_40px_-20px_rgba(108,92,231,0.2)] sm:p-7"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-600">After MyTeamSpace</p>
          <p className="mt-2 text-sm font-semibold text-neutral-800">One page. One link. Always current.</p>
          <ul className="mt-4 space-y-2.5">
            {AFTER_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-neutral-700">
                <span className="mt-0.5 text-emerald-600" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

const BUILD_STEPS = [
  {
    step: "1",
    title: "Build",
    text: "Add your logo, schedule, and the blocks your team needs — most coaches finish in minutes.",
    emoji: "✨",
  },
  {
    step: "2",
    title: "Publish",
    text: "Go live with one click. Parents get a clean page — no app, no login required.",
    emoji: "🚀",
  },
  {
    step: "3",
    title: "Share",
    text: "Send the link or QR code once. Every save updates what families see instantly.",
    emoji: "🔗",
  },
] as const;

export function LandingBuildFlowSection() {
  return (
    <section className="border-y border-neutral-100/80 bg-white/60">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6C5CE7]">Simple flow</p>
          <h2 className="mt-3 font-[family-name:var(--font-brand)] text-2xl font-bold tracking-tight text-[#1A1C23] sm:text-3xl">
            Build → Publish → Share
          </h2>
          <p className="mt-3 text-[15px] text-neutral-500">
            Create in minutes. Update in seconds. Parents always have the latest information.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {BUILD_STEPS.map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="relative rounded-2xl border border-neutral-100 bg-white p-5 shadow-[0_2px_20px_-12px_rgba(15,23,42,0.08)]"
            >
              <span className="text-2xl" aria-hidden>
                {item.emoji}
              </span>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-violet-600">Step {item.step}</p>
              <h3 className="mt-1 text-lg font-semibold text-neutral-900">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const QUOTES = [
  "Parents finally stopped asking where the schedule is.",
  "We replaced five different links with one.",
  "Our team finally looks professional.",
] as const;

export function LandingSocialQuotesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16">
      <motion.div {...fadeUp} className="grid gap-4 sm:grid-cols-3">
        {QUOTES.map((quote) => (
          <blockquote
            key={quote}
            className="rounded-2xl border border-neutral-100 bg-white px-5 py-4 text-[14px] leading-relaxed text-neutral-600 shadow-[0_2px_16px_-10px_rgba(15,23,42,0.06)]"
          >
            <span className="text-violet-400" aria-hidden>
              “
            </span>
            {quote}
            <span className="text-violet-400" aria-hidden>
              ”
            </span>
            <footer className="mt-3 text-[11px] font-medium text-neutral-400">— Team coach</footer>
          </blockquote>
        ))}
      </motion.div>
    </section>
  );
}

export function LandingFinalCtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <motion.div
        {...fadeUp}
        className="overflow-hidden rounded-[1.75rem] border border-violet-200/50 bg-gradient-to-br from-[#6C5CE7]/10 via-white to-[#FF6B9D]/8 px-6 py-12 text-center shadow-[0_24px_60px_-28px_rgba(108,92,231,0.35)] sm:px-10 sm:py-14"
      >
        <h2 className="font-[family-name:var(--font-brand)] text-2xl font-bold tracking-tight text-[#1A1C23] sm:text-3xl lg:text-[2rem]">
          Create a team page you&apos;ll be proud to share.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-neutral-500">
          Give Dance Stars, your academy, or your club a modern home — schedule, updates, photos, and contacts in one
          beautiful link.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/admin/signup"
            className={`inline-flex min-h-12 items-center justify-center rounded-full px-8 text-[15px] font-semibold transition ${accentBtn}`}
          >
            Create Your Team Space
          </Link>
          <Link
            href="/city-juniors"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-neutral-200/90 bg-white/90 px-7 text-[15px] font-medium text-neutral-800 shadow-sm transition hover:border-[#6C5CE7]/30 hover:text-[#6C5CE7]"
          >
            View Demo
          </Link>
        </div>
        <p className="mt-5 text-sm font-medium text-neutral-400">No coding required · Setup in minutes</p>
      </motion.div>
    </section>
  );
}
