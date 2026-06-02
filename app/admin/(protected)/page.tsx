import { createTeamAction } from "@/app/admin/actions";
import { setPrimaryTeamAction } from "@/app/admin/billing-actions";
import { openBillingPortal, startCheckoutForPlan } from "@/app/admin/lemon-actions";
import { loadCoachEntitlements } from "@/lib/billing/coach-subscription";
import { loadCoachTeams } from "@/lib/admin/load-coach-teams";
import { requireAuth } from "@/lib/auth/require-auth";
import { CopyLinkButton } from "@/components/mts/copy-link-button";
import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { supabase, user } = await requireAuth();
  const userEmail = user.email ?? "";
  const sp = (await searchParams) ?? {};
  const upgrade = typeof sp.upgrade === "string" ? sp.upgrade : undefined;
  const startPlan =
    typeof sp.startPlan === "string" && (sp.startPlan === "single_team" || sp.startPlan === "academy")
      ? (sp.startPlan as "single_team" | "academy")
      : undefined;

  let list: Awaited<ReturnType<typeof loadCoachTeams>>["list"] = [];
  let teamsError: string | null = null;
  let fatalError: string | null = null;
  let entitlements: Awaited<ReturnType<typeof loadCoachEntitlements>> | null = null;

  try {
    const loaded = await loadCoachTeams(supabase, user.id);
    list = loaded.list;
    teamsError = loaded.error;
    entitlements = await loadCoachEntitlements(supabase, user.id);
  } catch (e) {
    fatalError = e instanceof Error ? e.message : "Could not load admin page";
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const siteUrl = `${proto}://${host}`;

  const planType = entitlements?.subscription?.planType ?? "single_team";
  const isAcademy = planType === "academy";
  const teamsUsed = entitlements?.teamsUsed ?? list.filter((t) => t.role === "coach").length;
  const teamLimit = entitlements?.teamLimit ?? 1;
  const showLimit = isAcademy ? `${teamsUsed} / ${teamLimit} teams used` : `${Math.min(teamsUsed, 1)} / 1 team used`;
  const billingActive = entitlements?.billingActive ?? true;

  const primaryTeam = list.find((t) => t.is_plan_primary) ?? list[0];

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 sm:px-8">
      <div className={`mx-auto space-y-8 ${isAcademy ? "max-w-5xl" : "max-w-lg"}`}>
        {fatalError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1">{fatalError}</p>
            <p className="mt-2">
              <Link href="/admin/login" className="font-semibold underline">
                Try signing in again
              </Link>
            </p>
          </div>
        ) : null}

        {teamsError ? (
          <div
            role="alert"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            <p className="font-semibold">Couldn&apos;t load your teams</p>
            <p className="mt-1 text-amber-900/90">
              {teamsError}. If this is new after deploy, run the latest Supabase migration
              <code className="mx-1 rounded bg-amber-100/80 px-1 text-xs">fix_team_members_rls_recursion</code>
              in the SQL editor.
            </p>
          </div>
        ) : null}

        {upgrade === "academy" ? (
          <div
            role="status"
            className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-950"
          >
            <p className="font-semibold">Your current plan includes 1 team page.</p>
            <p className="mt-1 text-indigo-900/90">Upgrade to Academy to create more teams.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <form action={startCheckoutForPlan.bind(null, "academy")}>
                <button
                  type="submit"
                  className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Upgrade to Academy
                </button>
              </form>
              <Link href="/admin" className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-800">
                Back to dashboard
              </Link>
            </div>
          </div>
        ) : null}

        {!billingActive ? (
          <div
            role="status"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            <p className="font-semibold">Your subscription is not active.</p>
            <p className="mt-1 text-amber-900/90">
              Please update your billing to continue editing your team page.
            </p>
            <form action={openBillingPortal} className="mt-3">
              <button type="submit" className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white">
                Manage billing
              </button>
            </form>
          </div>
        ) : null}

        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Coach</p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{isAcademy ? "My Teams" : "Your team"}</h1>
              {isAcademy ? (
                <p className="mt-1 text-sm text-zinc-600">Create and manage all your team pages from one place.</p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                {entitlements?.planLabel ?? (isAcademy ? "Academy Plan" : "Single Team Plan")}
              </span>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
                {showLimit}
              </span>
              <form action={openBillingPortal}>
                <button type="submit" className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold">
                  Manage billing
                </button>
              </form>
            </div>
          </div>
          {userEmail ? <p className="mt-2 text-sm text-zinc-600">Signed in as {userEmail}</p> : null}
          <p className="mt-3 text-xs text-zinc-500">
            New here?{" "}
            <Link href="/admin/signup" className="font-medium text-indigo-600 underline">
              Create a coach account
            </Link>
            .
          </p>
        </header>

        {entitlements?.needsPrimaryTeamSelection ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
            <p className="font-semibold">
              Your current plan includes 1 team page. Choose which team should stay active.
            </p>
            <p className="mt-1 text-amber-900/90">
              We keep all your team pages safe, but only one can be editable on the Single Team plan.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {list
                .filter((t) => t.role === "coach")
                .map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-zinc-900">{t.name}</p>
                      <p className="truncate text-xs text-zinc-500">{siteUrl}/team/{t.slug}</p>
                    </div>
                    <form action={setPrimaryTeamAction.bind(null, t.id)}>
                      <button type="submit" className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white">
                        Keep active
                      </button>
                    </form>
                  </div>
                ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={startCheckoutForPlan.bind(null, "academy")}>
                <button type="submit" className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white">
                  Upgrade to Academy
                </button>
              </form>
              <form action={openBillingPortal}>
                <button type="submit" className="rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-950">
                  Manage billing
                </button>
              </form>
            </div>
          </section>
        ) : null}

        {startPlan ? (
          <section className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-sm text-indigo-950">
            <p className="font-semibold">
              {startPlan === "academy" ? "Upgrade to Academy Plan" : "Start Single Team Plan"}
            </p>
            <p className="mt-1 text-indigo-900/90">You will be redirected to Lemon Squeezy checkout.</p>
            <form action={startCheckoutForPlan.bind(null, startPlan)} className="mt-3">
              <button type="submit" className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white">
                Continue to checkout
              </button>
            </form>
          </section>
        ) : null}

        {isAcademy ? (
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-zinc-900">Teams</h2>
              {entitlements?.canCreateTeam ? (
                <Link
                  href="#create-team"
                  className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Create new team
                </Link>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((t) => {
                const url = `${siteUrl}/team/${t.slug}`;
                const locked = Boolean(t.plan_edit_locked) || !billingActive;
                return (
                  <div
                    key={t.id}
                    className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold">{t.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {t.publish_status === "published" ? "Published" : "Draft"} · {t.subscription_status}
                        </p>
                      </div>
                      {t.is_plan_primary ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-900">
                          Active team
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate rounded-xl bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-700 ring-1 ring-zinc-100"
                        title={url}
                      >
                        {url}
                      </a>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/admin/team/${t.id}/step-2`}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          locked ? "bg-zinc-200 text-zinc-500" : "bg-zinc-900 text-white"
                        }`}
                        aria-disabled={locked}
                      >
                        Edit
                      </Link>
                      <CopyLinkButton url={url} />
                    </div>
                    {locked ? (
                      <p className="mt-3 text-xs text-amber-700">
                        Locked by your current plan. Update billing to edit.
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ) : primaryTeam ? (
          <section className="space-y-3">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Your team page</p>
                  <p className="mt-1 truncate text-lg font-bold">{primaryTeam.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {primaryTeam.publish_status === "published" ? "Published" : "Draft"} · {primaryTeam.subscription_status}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/team/${primaryTeam.id}/step-2`}
                    className={`rounded-full px-4 py-2 text-xs font-bold ${
                      !billingActive || primaryTeam.plan_edit_locked ? "bg-zinc-200 text-zinc-500" : "bg-zinc-900 text-white"
                    }`}
                    aria-disabled={!billingActive || primaryTeam.plan_edit_locked}
                  >
                    Edit team
                  </Link>
                  <CopyLinkButton url={`${siteUrl}/team/${primaryTeam.slug}`} />
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={`${siteUrl}/team/${primaryTeam.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate rounded-xl bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-700 ring-1 ring-zinc-100"
                >
                  {siteUrl}/team/{primaryTeam.slug}
                </a>
              </div>
              {!billingActive ? (
                <p className="mt-3 text-xs text-amber-700">
                  Editing and publishing are locked while subscription is inactive.
                </p>
              ) : null}
              <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-950">
                <p className="font-semibold">
                  Your current plan includes 1 team page. Upgrade to Academy to create more teams.
                </p>
                <form action={startCheckoutForPlan.bind(null, "academy")} className="mt-3">
                  <button type="submit" className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white">
                    Upgrade to Academy
                  </button>
                </form>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Create your team page</h2>
            <p className="mt-1 text-sm text-zinc-600">Start with one team. You can upgrade to Academy anytime.</p>
          </section>
        )}

        {!fatalError ? (
          (isAcademy ? (
            <section id="create-team" className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Create a new team</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Choose a URL slug (letters, numbers, hyphens). You can always edit later.
              </p>
              <form action={createTeamAction} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-500">Slug</label>
                  <input
                    name="slug"
                    required
                    pattern="[a-z0-9][a-z0-9-]{0,61}[a-z0-9]"
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    placeholder="dance-stars-juniors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500">Team name</label>
                  <input
                    name="name"
                    required
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    placeholder="Dance Stars Juniors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!entitlements?.canCreateTeam}
                  className="w-full rounded-full bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Create team
                </button>
              </form>
            </section>
          ) : list.length === 0 ? (
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold">Create your team page</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Choose a URL slug (letters, numbers, hyphens). Your plan includes 1 team page.
              </p>
              <form action={createTeamAction} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-500">Slug</label>
                  <input
                    name="slug"
                    required
                    pattern="[a-z0-9][a-z0-9-]{0,61}[a-z0-9]"
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    placeholder="tigers"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500">Team name</label>
                  <input
                    name="name"
                    required
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    placeholder="Tigers U12"
                  />
                </div>
                <button type="submit" className="w-full rounded-full bg-emerald-600 py-2.5 text-sm font-semibold text-white">
                  Create team
                </button>
              </form>
            </section>
          ) : null)
        ) : null}

        <p className="text-center text-xs text-zinc-500">
          <Link href="/" className="underline">
            Marketing home
          </Link>
        </p>
      </div>
    </div>
  );
}
