import { PricingCheckoutButton } from "@/components/marketing/pricing-checkout-button";
import { MARKETING_PLANS } from "@/lib/marketing/pricing";

type PricingPlansProps = {
  className?: string;
  isAuthenticated?: boolean;
};

export function PricingPlans({ className = "", isAuthenticated = false }: PricingPlansProps) {
  return (
    <div className={`grid gap-6 lg:grid-cols-2 ${className}`}>
      {MARKETING_PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.08)] ${
            plan.featured ? "border-[#6C5CE7]/40 ring-2 ring-[#6C5CE7]/20" : "border-black/[0.06]"
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
            {plan.features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <span className="text-[#6C5CE7]">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <PricingCheckoutButton
            plan={plan.id}
            label={plan.cta}
            featured={plan.featured}
            isAuthenticated={isAuthenticated}
          />
        </div>
      ))}
    </div>
  );
}
