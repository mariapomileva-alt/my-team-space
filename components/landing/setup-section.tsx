"use client";

import { STYLE_PRESETS } from "@/lib/style-presets";
import { THEMES } from "@/lib/themes";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const accentBtn =
  "bg-[#6C5CE7] text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-6px_rgba(108,92,231,0.45)] hover:bg-[#5b4bd6] active:scale-[0.99]";

const SETUP_STEPS = [
  {
    title: "Pick your team look",
    text: "Logo, cover photo and a mood — ocean, club orange, or academy green.",
  },
  {
    title: "Turn on what you need",
    text: "Schedule, results, trips, MVP board — toggle blocks like Lego.",
  },
  {
    title: "Share with families",
    text: "Send your page link or QR. Updates appear as soon as you save.",
  },
] as const;

const BLOCKS = ["Schedule", "Results", "Trips", "MVP"] as const;

const MOOD_PRESETS = STYLE_PRESETS.filter((p) => p.themeId)
  .slice(0, 4)
  .map((preset) => {
    const theme = THEMES.find((t) => t.id === preset.themeId)!;
    const vars = theme.cssVars as Record<string, string>;
    return {
      label: preset.label,
      emoji: preset.emoji,
      primary: vars["--mts-primary"] ?? "#4f46e5",
      accent: vars["--mts-accent"] ?? "#818cf8",
    };
  });

function SetupPhonePreview({
  moodIndex,
  enabledBlocks,
}: {
  moodIndex: number;
  enabledBlocks: boolean[];
}) {
  const mood = MOOD_PRESETS[moodIndex % MOOD_PRESETS.length]!;

  return (
    <div className="w-[148px] shrink-0 rounded-[1.25rem] border border-neutral-200/90 bg-white p-1.5 shadow-[0_20px_50px_-20px_rgba(79,70,229,0.35)] ring-1 ring-black/[0.04]">
      <div className="overflow-hidden rounded-[1rem] bg-neutral-50">
        <div
          className="h-11 w-full"
          style={{ background: `linear-gradient(135deg, ${mood.primary}, ${mood.accent})` }}
        />
        <div className="px-2.5 pb-3 pt-0">
          <div
            className="-mt-3.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[10px] font-bold shadow-md ring-1 ring-neutral-100"
            style={{ color: mood.primary }}
          >
            CJ
          </div>
          <p className="mt-1.5 text-[10px] font-bold text-neutral-900">City Juniors</p>
          <p className="text-[8px] text-neutral-400">myteamspace.cc/…</p>
          <div className="mt-2 space-y-1">
            {enabledBlocks[0] ? (
              <div className="rounded-md px-1.5 py-1 text-[7px] font-semibold text-white" style={{ backgroundColor: mood.primary }}>
                Training · 18:00
              </div>
            ) : null}
            {enabledBlocks[1] ? <div className="h-1.5 w-full rounded-full bg-neutral-200/90" /> : null}
            {enabledBlocks[2] ? <div className="h-1.5 w-[80%] rounded-full bg-neutral-200/70" /> : null}
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[9px] font-medium text-indigo-600/90">Live preview</p>
    </div>
  );
}

export function SetupSection() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 3), 2800);
    return () => clearInterval(id);
  }, []);

  const moodIndex = step;
  const enabledBlocks = useMemo(
    () => BLOCKS.map((_, i) => (step === 1 ? i % 2 === 0 : step === 2 ? true : i < 2)),
    [step],
  );

  return (
    <section className="border-y border-neutral-100/90 bg-gradient-to-b from-white via-indigo-50/15 to-white">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12 xl:gap-16">
          <div className="max-w-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-500/90">
              Setup in minutes
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-brand)] text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Ready before your next training session.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
              Designed for quick setup — no designer, no IT ticket, no new app for parents to install.
            </p>

            <ol className="mt-8 space-y-3">
              {SETUP_STEPS.map((item, i) => {
                const active = step === i;
                return (
                  <motion.li
                    key={item.title}
                    className={`flex gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
                      active
                        ? "border-indigo-200/80 bg-white shadow-[0_8px_30px_-18px_rgba(79,70,229,0.25)]"
                        : "border-transparent bg-white/60"
                    }`}
                    animate={{ opacity: active ? 1 : 0.72 }}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                        active ? "bg-indigo-600 text-white" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[14px] font-semibold text-neutral-900">{item.title}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-neutral-500">{item.text}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-medium text-neutral-500">
              {["Quick start", "No code", "Browser-based"].map((chip) => (
                <span key={chip} className="rounded-full bg-white px-3 py-1 ring-1 ring-neutral-200/80">
                  {chip}
                </span>
              ))}
            </div>

            <Link
              href="/admin/signup"
              className={`mt-7 inline-flex min-h-11 items-center justify-center rounded-full px-7 text-sm font-semibold transition ${accentBtn}`}
            >
              Start your team page
            </Link>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-neutral-100/90 bg-white p-5 shadow-[0_24px_60px_-24px_rgba(79,70,229,0.14)] sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-sm font-semibold text-neutral-800">Page editor</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  Saved
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
                <div className="min-w-0 space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Team mood</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {MOOD_PRESETS.map((mood, i) => {
                        const selected = moodIndex === i;
                        return (
                          <motion.button
                            key={mood.label}
                            type="button"
                            className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition ${
                              selected
                                ? "border-indigo-300 bg-indigo-50/50 ring-2 ring-indigo-100"
                                : "border-neutral-100 bg-neutral-50/80"
                            }`}
                            animate={{ scale: selected ? [1, 1.02, 1] : 1 }}
                            transition={{ duration: 0.35 }}
                          >
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base shadow-sm"
                              style={{
                                background: `linear-gradient(145deg, ${mood.primary}, ${mood.accent})`,
                              }}
                              aria-hidden
                            >
                              {mood.emoji}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[11px] font-bold text-neutral-800">{mood.label}</span>
                              <span className="mt-0.5 flex gap-0.5">
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: mood.primary }} />
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: mood.accent }} />
                              </span>
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Blocks</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {BLOCKS.map((label, i) => {
                        const on = enabledBlocks[i];
                        return (
                          <span
                            key={label}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition ${
                              on
                                ? "bg-indigo-600 text-white ring-indigo-500"
                                : "bg-neutral-100 text-neutral-400 ring-neutral-200/80"
                            }`}
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3 ring-1 ring-neutral-100">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-indigo-100">
                      <span className="text-lg font-bold text-indigo-600">CJ</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-neutral-800">City Juniors crest</p>
                      <p className="text-[10px] text-neutral-500">Uploaded · shows on every page</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end sm:pt-1">
                  <SetupPhonePreview moodIndex={moodIndex} enabledBlocks={enabledBlocks} />
                </div>
              </div>

              <motion.p
                className="mt-4 rounded-xl border border-indigo-100/60 bg-indigo-50/40 px-3 py-2.5 text-center text-[11px] text-neutral-600"
                animate={{ opacity: [0.88, 1, 0.88] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="font-semibold text-indigo-700">Parents see changes instantly</span>
                <span className="text-neutral-400"> · </span>
                no refresh, no app download
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
