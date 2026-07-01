import { TeamExamplesGallery } from "@/components/marketing/team-examples-gallery";
import { SHOWCASE_TEAMS } from "@/lib/showcase/demo-teams";
import Link from "next/link";

const accentBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full px-7 text-[15px] font-medium transition bg-[#6C5CE7] text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-6px_rgba(108,92,231,0.45)] hover:bg-[#5b4bd6] active:scale-[0.99]";
const secondaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-200/90 bg-white px-7 text-[15px] font-medium text-neutral-800 shadow-sm transition hover:border-[#6C5CE7]/30 hover:text-[#6C5CE7] active:scale-[0.99]";

const DAY_LANES = [
  {
    icon: "🌅",
    title: "Early morning",
    text: "06:30 lane sessions and 09:00 tournament draws — squads that start before breakfast.",
  },
  {
    icon: "☀️",
    title: "Midday & weekend",
    text: "City league games and travel-team ice — structures built around fixtures, not flex time.",
  },
  {
    icon: "🌇",
    title: "After school",
    text: "Studios and conservatories — rehearsal blocks parents actually need on one page.",
  },
] as const;

export function TeamExamplesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/[0.04] bg-gradient-to-b from-amber-50/40 via-white to-white px-6 py-16 sm:px-8 sm:py-20">
        <div
          className="pointer-events-none absolute -right-16 top-8 h-48 w-48 rounded-full bg-violet-200/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-white/90 px-4 py-1.5 shadow-sm">
            <span className="text-sm" aria-hidden>
              🕐
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-900/80">
              A day in team life
            </span>
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-brand)] text-3xl font-bold tracking-tight text-[#1A1C23] sm:text-4xl lg:text-[2.6rem]">
            Six structures. Six rhythms.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-500">
            Swim squads at dawn, clubs at noon, studios at dusk — scroll inside every phone. Real pages, real
            blocks, no signup to look.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {DAY_LANES.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-100 bg-white px-5 py-4 shadow-[0_2px_20px_-12px_rgba(15,23,42,0.06)]"
            >
              <p className="flex items-center gap-2 text-[14px] font-semibold text-[#1A1C23]">
                <span aria-hidden>{item.icon}</span>
                {item.title}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <TeamExamplesGallery teams={SHOWCASE_TEAMS} />

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center sm:px-8">
        <h2 className="font-[family-name:var(--font-brand)] text-2xl font-bold tracking-tight text-[#1A1C23] sm:text-3xl">
          Pick a rhythm. Make it yours.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
          Start with a structure you recognise — then shape the page around how your team actually runs its day.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/admin/signup" className={accentBtn}>
            Create Your Team Space
          </Link>
          <Link href="/city-juniors" className={secondaryBtn}>
            View Demo
          </Link>
        </div>
        <p className="mt-4 text-sm text-neutral-400">No coding required · €29/month per team</p>
      </section>
    </>
  );
}
