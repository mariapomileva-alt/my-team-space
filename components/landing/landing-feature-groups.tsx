"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MARKETING_SIGNUP_CTA } from "@/lib/marketing/pricing";

const accentBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full px-7 text-[15px] font-medium transition bg-[#6C5CE7] text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-6px_rgba(108,92,231,0.45)] hover:bg-[#5b4bd6] active:scale-[0.99]";
const secondaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-200/90 bg-white px-7 text-[15px] font-medium text-neutral-800 shadow-sm transition hover:border-[#6C5CE7]/30 hover:text-[#6C5CE7] active:scale-[0.99]";

const SELLING_PILLARS = [
  {
    title: "Coaches run it",
    text: "Shape your page, turn on what you need, update when things change.",
  },
  {
    title: "Families trust it",
    text: "One bookmark instead of digging through chats, drives, and PDFs.",
  },
  {
    title: "Athletes show it",
    text: "Wins, photos, and team moments they are proud to share.",
  },
] as const;

function FeaturesSectionHeader() {
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6C5CE7]">Your team&apos;s home</p>
      <h2 className="mt-3 font-[family-name:var(--font-brand)] text-3xl font-bold tracking-tight text-[#1A1C23] sm:text-4xl">
        One home for your entire team.
      </h2>
      <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
        Everything important lives here — the page you shape and your team keeps coming back to.
      </p>
    </>
  );
}

function FeaturesSellingCtas({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <Link href="/admin/signup" className={accentBtn}>
        {MARKETING_SIGNUP_CTA}
      </Link>
      <Link href="/examples" className={secondaryBtn}>
        View Demo
      </Link>
    </div>
  );
}

function FeaturesSellingPillars() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
      {SELLING_PILLARS.map((pillar) => (
        <div
          key={pillar.title}
          className="rounded-2xl border border-neutral-100 bg-white px-5 py-4 shadow-[0_2px_20px_-12px_rgba(15,23,42,0.06)]"
        >
          <p className="text-[14px] font-semibold text-neutral-900">{pillar.title}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">{pillar.text}</p>
        </div>
      ))}
    </div>
  );
}

function FeaturesClosingCta() {
  return (
    <div className="mt-12 rounded-[1.5rem] border border-neutral-100 bg-white px-6 py-8 text-center shadow-[0_16px_48px_-24px_rgba(15,23,42,0.1)] sm:px-8">
      <p className="font-[family-name:var(--font-brand)] text-xl font-bold tracking-tight text-[#1A1C23] sm:text-2xl">
        See it live, then make it yours.
      </p>
      <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-neutral-500">
        Walk through a real team page — then build one that feels like your team.
      </p>
      <FeaturesSellingCtas className="mt-6" />
      <p className="mt-4 text-sm text-neutral-400">No coding required · Opens in any browser</p>
    </div>
  );
}

export function FeaturesSellingSection({ variant = "home" }: { variant?: "home" | "page" }) {
  const isHome = variant === "home";

  return (
    <section
      id={isHome ? "features" : undefined}
      className={`mx-auto max-w-6xl px-6 sm:px-8 ${isHome ? "py-14 sm:py-16 lg:py-20" : "pb-16 pt-6 sm:pb-20 sm:pt-8"}`}
    >
      {isHome ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <FeaturesSectionHeader />
          <FeaturesSellingCtas className="mt-8" />
        </motion.div>
      ) : (
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6C5CE7]">What lives here</p>
          <h2 className="mt-3 font-[family-name:var(--font-brand)] text-2xl font-bold tracking-tight text-[#1A1C23] sm:text-3xl">
            Built for how teams actually work.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
            Turn on the blocks you need. Everything else stays out of the way.
          </p>
          <FeaturesSellingCtas className="mt-7" />
        </div>
      )}

      <FeaturesSellingPillars />
      <FeaturesClosingCta />
    </section>
  );
}

export function LandingFeatureGroupsSection() {
  return <FeaturesSellingSection variant="home" />;
}
