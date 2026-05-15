import { PageHero } from "@/components/marketing/page-hero";
import Link from "next/link";

const TOPICS = [
  {
    title: "Getting started",
    text: "Create your account, set up your first team, and publish your page in about five minutes.",
  },
  {
    title: "Billing & subscriptions",
    text: "Manage plans, invoices, and cancellations from your admin dashboard.",
  },
  {
    title: "Team pages & blocks",
    text: "Learn how to toggle blocks, customize colors, and share your team link with parents.",
  },
  {
    title: "Privacy & safety",
    text: "Questions about photos, youth teams, or data — see our Privacy Policy or email us.",
  },
];

export function SupportPage() {
  return (
    <>
      <PageHero title="We're here to help." subtitle="Reach out anytime — we typically reply within one business day." />
      <section className="mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="rounded-3xl border border-[#6C5CE7]/20 bg-gradient-to-br from-[#6C5CE7]/5 to-white p-8 text-center">
          <p className="text-sm font-medium text-neutral-500">Email support</p>
          <a
            href="mailto:support@myteamspace.app"
            className="mt-2 block font-[family-name:var(--font-brand)] text-2xl font-bold text-[#6C5CE7] hover:underline"
          >
            support@myteamspace.app
          </a>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {TOPICS.map((topic) => (
            <div key={topic.title} className="rounded-2xl border border-black/[0.06] bg-white p-6">
              <h2 className="font-semibold text-[#1A1C23]">{topic.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{topic.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-neutral-500">
          <Link href="/faq" className="font-medium text-[#6C5CE7] hover:underline">
            Browse FAQ
          </Link>
          {" · "}
          <Link href="/pricing" className="font-medium text-[#6C5CE7] hover:underline">
            View pricing
          </Link>
        </p>
      </section>
    </>
  );
}
