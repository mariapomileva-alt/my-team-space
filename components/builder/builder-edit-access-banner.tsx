"use client";

import { setPrimaryTeamAction } from "@/app/admin/billing-actions";
import type { BuilderBillingContext } from "@/lib/billing/builder-context-types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function BuilderEditAccessBanner({
  teamId,
  billing,
}: {
  teamId: string;
  billing: BuilderBillingContext;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (billing.canEdit) return null;
  if (billing.lockReason !== "not_active_team" && billing.lockReason !== "team_plan_locked") {
    return null;
  }

  function activate() {
    startTransition(async () => {
      await setPrimaryTeamAction(teamId);
      router.refresh();
    });
  }

  return (
    <div className="mb-2 rounded-xl border border-violet-200/80 bg-violet-50/50 px-3 py-2.5 text-[11px] text-violet-950">
      <p className="font-medium leading-snug">
        {billing.teamsUsed <= 1
          ? "Your Single Team plan includes one active team page. Confirm this team as your active page to edit."
          : "On the Single Team plan, only one team page can be edited at a time. Make this team your active page to continue."}
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={activate}
        className="mt-2 rounded-full bg-indigo-600 px-3.5 py-1.5 text-[10px] font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Activating…" : "Make this my active team"}
      </button>
      {billing.teamsUsed > 1 ? (
        <p className="mt-1.5 text-[10px] text-violet-800/80">
          Need more than one editable team?{" "}
          <a href="/admin?upgrade=academy" className="font-semibold underline">
            Upgrade to Academy
          </a>
        </p>
      ) : null}
    </div>
  );
}
