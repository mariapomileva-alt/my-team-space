import { PageHero } from "@/components/marketing/page-hero";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { PRICING_FAQ } from "@/lib/marketing/pricing";
import { isPromoBannerEnabled } from "@/lib/marketing/promo-banner";

export function PricingPage() {
  const showPromoNote = isPromoBannerEnabled();

  return (
    <>
      <PageHero
        title="Simple pricing for modern teams."
        subtitle="Team Plan for one team. Academy Plan when you're ready to grow."
      />
      <section className="mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-16">
        {showPromoNote ? (
          <p className="mb-8 text-center text-sm text-neutral-500">
            Standard prices below. Apply the active promo code at checkout when a campaign is running.
          </p>
        ) : null}
        <PricingPlans />
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
