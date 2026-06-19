import { startCheckoutFormAction } from "@/lib/admin/checkout-actions";
import { isBillingConfigured } from "@/lib/billing/config";
import type { MarketingPlanId } from "@/lib/marketing/pricing";
import Link from "next/link";

type PricingCheckoutButtonProps = {
  plan: MarketingPlanId;
  label: string;
  featured?: boolean;
  isAuthenticated: boolean;
};

export function PricingCheckoutButton({
  plan,
  label,
  featured = false,
  isAuthenticated,
}: PricingCheckoutButtonProps) {
  const className = featured
    ? "mt-6 flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#5b4bd6] disabled:cursor-not-allowed disabled:opacity-60"
    : "mt-6 flex min-h-12 w-full items-center justify-center rounded-2xl border border-neutral-200 bg-[#F2F4F7] text-sm font-semibold text-[#1A1C23] transition hover:border-[#6C5CE7]/30 disabled:cursor-not-allowed disabled:opacity-60";

  if (!isBillingConfigured()) {
    return (
      <Link href="/admin/signup" className={className}>
        {label}
      </Link>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link href={`/admin/signup?startPlan=${plan}`} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <form action={startCheckoutFormAction} className="mt-6 w-full">
      <input type="hidden" name="plan" value={plan} />
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
