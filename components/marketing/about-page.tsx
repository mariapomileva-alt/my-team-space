import { PageHero } from "@/components/marketing/page-hero";
import Link from "next/link";

export function AboutPage() {
  return (
    <>
      <PageHero title="Built for teams that care." />
      <section className="mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="space-y-6 text-[17px] leading-relaxed text-neutral-600">
          <p>
            MyTeamSpace was created to give every team a beautiful digital home — without complicated tools, messy group
            chats, or endless PDFs.
          </p>
          <p>
            We believe coaches should spend less time repeating information and more time with their athletes. Parents
            deserve one calm place to see schedules, results, and updates. Kids deserve to feel proud of their progress.
          </p>
          <p>
            Our mission is simple: help teams stay connected, organized, and motivated — in one space everyone can
            understand.
          </p>
        </div>
        <div className="mt-12 rounded-3xl border border-black/[0.06] bg-white p-8 text-center shadow-sm">
          <p className="font-[family-name:var(--font-brand)] text-xl font-semibold text-[#1A1C23]">Ready to start?</p>
          <p className="mt-2 text-sm text-neutral-500">Create your team space in minutes.</p>
          <Link
            href="/admin/signup"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#6C5CE7] px-8 text-sm font-semibold text-white transition hover:bg-[#5b4bd6]"
          >
            Create Your Team Space
          </Link>
        </div>
      </section>
    </>
  );
}
