import { TeamExamplesGallery } from "@/components/marketing/team-examples-gallery";
import Link from "next/link";

const accentBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full px-7 text-[15px] font-medium transition bg-[#6C5CE7] text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-6px_rgba(108,92,231,0.45)] hover:bg-[#5b4bd6] active:scale-[0.99]";
const secondaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-neutral-200/90 bg-white px-7 text-[15px] font-medium text-neutral-800 shadow-sm transition hover:border-[#6C5CE7]/30 hover:text-[#6C5CE7] active:scale-[0.99]";

export function TeamExamplesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/[0.04] bg-white px-6 py-20 sm:px-8 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-20%,rgba(108,92,231,0.07),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">
            Portfolio examples
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-brand)] text-4xl font-bold tracking-tight text-[#1A1C23] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            I want my team page to look like this.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-neutral-500">
            Three real team pages — built only with what you already get in MyTeamSpace. Scroll inside
            each preview. Imagine your parents opening this instead of another chat thread.
          </p>
        </div>
      </section>

      <TeamExamplesGallery />

      <section className="border-t border-black/[0.04] bg-[#fafafa] px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-brand)] text-2xl font-bold tracking-tight text-[#1A1C23] sm:text-3xl">
            Your team. This level of polish.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
            Pick a personality, add your photography, turn on the blocks you need — and publish a page
            you&apos;re proud to share.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/admin/signup" className={accentBtn}>
              Create Your Team Space
            </Link>
            <Link href="/city-juniors" className={secondaryBtn}>
              View live demo
            </Link>
          </div>
          <p className="mt-4 text-sm text-neutral-400">No coding required · €29/month per team</p>
        </div>
      </section>
    </>
  );
}
