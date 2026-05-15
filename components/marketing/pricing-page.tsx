import { PageHero } from "@/components/marketing/page-hero";
import Link from "next/link";

const PLANS = [
  {
    name: "Team Space",
    price: "€29",
    period: "/month",
    description: "Perfect for one team.",
    badge: null as string | null,
    featured: false,
    cta: "Start Team Space",
    href: "/admin/signup",
    features: [
      "1 team space",
      "schedules",
      "announcements",
      "rankings & results",
      "media gallery",
      "attendance",
      "mobile-friendly page",
      "custom team colors",
      "parent access",
      "easy setup",
    ],
    note: null as string | null,
  },
  {
    name: "Founding Teams",
    price: "€19",
    period: "/month for 12 months",
    description: "Limited offer for the first 100 teams.",
    badge: "Early Access",
    featured: true,
    cta: "Claim Early Access",
    href: "/admin/signup",
    features: ["Everything in Team Space."],
    note: "After 12 months, regular pricing applies.",
  },
  {
    name: "Academy Space",
    price: "€199",
    period: "/month",
    description: "For clubs and academies managing multiple teams.",
    badge: "Most Popular",
    featured: false,
    cta: "Start Academy",
    href: "/admin/signup",
    features: [
      "up to 20 teams",
      "academy dashboard",
      "multiple coaches",
      "centralized management",
      "academy-wide announcements",
      "shared branding",
      "premium support",
      "all premium features",
    ],
    note: null,
  },
];

const PRICING_FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription at any time.",
  },
  {
    q: "Do you offer free trials?",
    a: "Free trials may be available during special launch periods.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. You can upgrade or downgrade your plan anytime.",
  },
  {
    q: "Do parents need accounts?",
    a: "No. Team pages can be shared with parents directly.",
  },
  {
    q: "Do you support mobile devices?",
    a: "Yes. MyTeamSpace is designed mobile-first.",
  },
];

export function PricingPage() {
  return (
    <>
      <PageHero
        title="Simple pricing for modern teams."
        subtitle="Start with one team or manage an entire academy — all in one place."
      />
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.08)] ${
                plan.featured
                  ? "border-[#6C5CE7]/40 ring-2 ring-[#6C5CE7]/20"
                  : "border-black/[0.06]"
              }`}
            >
              {plan.badge ? (
                <span
                  className={`absolute right-6 top-6 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                    plan.featured ? "bg-[#6C5CE7] text-white" : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {plan.badge}
                </span>
              ) : null}
              <h2 className="font-[family-name:var(--font-brand)] text-xl font-bold text-[#1A1C23]">{plan.name}</h2>
              <p className="mt-4">
                <span className="text-4xl font-bold tracking-tight text-[#1A1C23]">{plan.price}</span>
                <span className="text-sm text-neutral-500">{plan.period}</span>
              </p>
              <p className="mt-2 text-sm text-neutral-500">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-neutral-600">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[#6C5CE7]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.note ? <p className="mt-4 text-xs text-neutral-400">{plan.note}</p> : null}
              <Link
                href={plan.href}
                className={`mt-6 flex min-h-12 items-center justify-center rounded-2xl text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-[#6C5CE7] text-white hover:bg-[#5b4bd6]"
                    : "border border-neutral-200 bg-[#F2F4F7] text-[#1A1C23] hover:border-[#6C5CE7]/30"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-black/[0.04] bg-white/50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-[family-name:var(--font-brand)] text-2xl font-bold">Pricing FAQ</h2>
          <dl className="mt-10 space-y-6">
            {PRICING_FAQ.map((item) => (
              <div key={item.q} className="rounded-2xl border border-black/[0.06] bg-white p-6">
                <dt className="font-semibold text-[#1A1C23]">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
