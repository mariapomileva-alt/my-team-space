"use client";

import { openBillingPortal } from "@/app/admin/lemon-actions";
import { startCheckoutFormAction } from "@/lib/admin/checkout-actions";
import {
  builderUsageLabel,
  type BuilderBillingContext,
} from "@/lib/billing/builder-context-types";
import Link from "next/link";

function Dot() {
  return (
    <span className="px-1 text-zinc-300" aria-hidden>
      ·
    </span>
  );
}

/** Muted single-line plan status — lives below Share, not in the coach workflow. */
export function BuilderBillingStatus({ billing }: { billing: BuilderBillingContext }) {
  const usage = builderUsageLabel(billing.teamsUsed, billing.teamLimit, billing.planLabel);
  const publishLabel = billing.publishStatus === "published" ? "Published" : "Draft";
  const showUpgrade = billing.showUpgradeCta;
  const showChoosePlan = !billing.billingActive && !billing.hasLemonSubscription;

  return (
    <div
      className="flex min-h-[1.25rem] flex-wrap items-center text-[11px] leading-none text-zinc-400"
      aria-label="Plan and billing status"
    >
      <span className="font-medium text-zinc-500">{billing.planLabel}</span>
      <Dot />
      <span>{usage}</span>
      <Dot />
      <span>{publishLabel}</span>
      {showUpgrade ? (
        <>
          <Dot />
          <form action={startCheckoutFormAction} className="inline">
            <input type="hidden" name="plan" value="academy" />
            <button
              type="submit"
              className="font-semibold text-indigo-600/90 transition hover:text-indigo-700 hover:underline"
            >
              Upgrade to Academy
            </button>
          </form>
        </>
      ) : null}
      {showChoosePlan ? (
        <>
          <Dot />
          <Link
            href="/pricing?startPlan=single_team"
            className="font-semibold text-indigo-600/90 transition hover:text-indigo-700 hover:underline"
          >
            Choose a plan
          </Link>
        </>
      ) : null}
      {!billing.billingActive && billing.hasLemonSubscription ? (
        <>
          <Dot />
          <form action={openBillingPortal} className="inline">
            <button
              type="submit"
              className="font-semibold text-indigo-600/90 transition hover:text-indigo-700 hover:underline"
            >
              Manage billing
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
}
