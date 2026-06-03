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

  if (!locked && billing.billingActive) {
    return (
      <div className="mt-2 flex w-full flex-wrap items-center gap-1.5 border-t border-zinc-100/90 pt-2">
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-800">
          {billing.planLabel}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">{usage}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            billing.publishStatus === "published"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-900"
          }`}
        >
          {billing.publishStatus === "published" ? "Published" : "Draft"}
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          Editing enabled
        </span>
      </div>
    );
  }

  return (
    <div className="mt-2 w-full border-t border-zinc-100/90 pt-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-800">
          {billing.planLabel}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">{usage}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            billing.publishStatus === "published"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-900"
          }`}
        >
          {billing.publishStatus === "published" ? "Published" : "Draft"}
        </span>
      </div>

      {locked && lockMessage ? (
        <div
          role="status"
          className="mt-1.5 rounded-xl border border-amber-200/80 bg-amber-50/50 px-2.5 py-2"
        >
          <p className="text-[11px] font-medium leading-snug text-amber-950">{lockMessage}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {billing.lockReason === "subscription_inactive" ? (
              <form action={openBillingPortal}>
                <button
                  type="submit"
                  className="rounded-full bg-zinc-900 px-3 py-1.5 text-[10px] font-bold text-white"
                >
                  Manage billing
                </button>
              </form>
            ) : null}
            {billing.showUpgradeCta ? (
              <form action={startCheckoutForPlan.bind(null, "academy")}>
                <button
                  type="submit"
                  className="rounded-full bg-indigo-600 px-3 py-1.5 text-[10px] font-bold text-white"
                >
                  Upgrade to Academy
                </button>
              </form>
            ) : null}
            {billing.lockReason !== "subscription_inactive" ? (
              <Link
                href="/admin"
                className="inline-flex items-center rounded-full border border-amber-200/90 bg-white px-3 py-1.5 text-[10px] font-semibold text-amber-950"
              >
                Open dashboard
              </Link>
            ) : null}
          </div>
        </div>
      ) : !billing.billingActive ? (
        <p className="mt-1.5 text-[11px] leading-snug text-zinc-600">
          <span className="font-semibold text-zinc-800">Preview mode.</span> Subscribe to publish for everyone.{" "}
          <form action={openBillingPortal} className="inline">
            <button type="submit" className="font-semibold text-indigo-600 underline">
              Manage billing
            </button>
          </form>
        </p>
      ) : null}
    </div>
  );
}
