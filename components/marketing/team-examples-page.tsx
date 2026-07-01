import { TeamExamplesGallery } from "@/components/marketing/team-examples-gallery";
import { PageHero } from "@/components/marketing/page-hero";
import { SHOWCASE_TEAMS } from "@/lib/showcase/demo-teams";
import Link from "next/link";

const accentBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full px-7 text-[15px] font-medium transition bg-[#6C5CE7] text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-6px_rgba(108,92,231,0.45)] hover:bg-[#5b4bd6] active:scale-[0.99]";
const secondaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-200/90 bg-white px-7 text-[15px] font-medium text-neutral-800 shadow-sm transition hover:border-[#6C5CE7]/30 hover:text-[#6C5CE7] active:scale-[0.99]";

const DIFFERENTIATORS = [
  {
    title: "Not a link-in-bio",
    text: "Schedule, gallery, results, and payments — not just one Instagram link in a bio.",
  },
  {
    title: "Not a generic website builder",
    text: "Blocks made for sports teams. Turn on what you need, skip what you don't.",
  },
  {
    title: "No app for parents",
    text: "Opens in any browser. Families bookmark once — you update from the builder.",
  },
] as const;

export function TeamExamplesPage() {
  return (
    <>
      <PageHero
        title="Six teams. Six real pages."
        subtitle="Scroll inside every preview — the same live components parents see. No signup required to look."
      />

      <section className="mx-auto max-w-6xl px-6 pb-6 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {DIFFERENTIATORS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-100 bg-white px-5 py-4 shadow-[0_2px_20px_-12px_rgba(15,23,42,0.06)]"
            >
              <p className="text-[14px] font-semibold text-[#1A1C23]">{item.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <TeamExamplesGallery teams={SHOWCASE_TEAMS} />

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center sm:px-8">
        <h2 className="font-[family-name:var(--font-brand)] text-2xl font-bold tracking-tight text-[#1A1C23] sm:text-3xl">
          Like what you see? Make it yours.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
          Start with a look you love — then shape the page around how your team actually works.
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
