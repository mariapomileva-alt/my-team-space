"use client";

import { openBillingPortal, startCheckoutForPlan } from "@/app/admin/lemon-actions";
import {
  builderLockMessage,
  builderUsageLabel,
  type BuilderBillingContext,
} from "@/lib/billing/builder-context";
import Link from "next/link";

export function BuilderBillingStatus({ billing }: { billing: BuilderBillingContext }) {
  const usage = builderUsageLabel(billing.teamsUsed, billing.teamLimit, billing.planLabel);
  const lockMessage = builderLockMessage(billing.lockReason);
  const locked = !billing.canEdit;

  return (
    <div className="mt-3 w-full space-y-2.5 border-t border-zinc-100/90 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-800">
          {billing.planLabel}
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold text-zinc-600">
          {usage}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            billing.publishStatus === "published"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-900"
          }`}
        >
          {billing.publishStatus === "published" ? "Published" : "Draft"}
        </span>
        {billing.billingActive && billing.canEdit ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
            Editing enabled
          </span>
        ) : null}
      </div>

      {locked && lockMessage ? (
        <div
          role="status"
          className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-orange-50/40 px-4 py-3 text-sm text-amber-950"
        >
          <p className="font-semibold leading-snug">{lockMessage}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {billing.lockReason === "subscription_inactive" ? (
              <form action={openBillingPortal}>
                <button
                  type="submit"
                  className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white"
                >
                  Manage billing
                </button>
              </form>
            ) : null}
            {billing.showUpgradeCta ? (
              <form action={startCheckoutForPlan.bind(null, "academy")}>
                <button
                  type="submit"
                  className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Upgrade to Academy
                </button>
              </form>
            ) : null}
            {billing.lockReason !== "subscription_inactive" ? (
              <Link
                href="/admin"
                className="inline-flex items-center rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-950"
              >
                Open dashboard
              </Link>
            ) : null}
          </div>
        </div>
      ) : !billing.billingActive ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs text-zinc-600">
          <span className="font-semibold text-zinc-800">Preview mode.</span> Subscribe to publish for everyone.
          <form action={openBillingPortal} className="mt-2 inline-block">
            <button type="submit" className="font-semibold text-indigo-600 underline">
              Manage billing
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
