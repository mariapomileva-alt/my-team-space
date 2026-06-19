import { setPrimaryTeamFormAction } from "@/app/admin/billing-actions";
import { startCheckoutFormAction } from "@/lib/admin/checkout-actions";
import { openBillingPortal } from "@/app/admin/lemon-actions";
import { FirstTeamSetup } from "@/components/admin/first-team-setup";
import { DashboardEditLink } from "@/components/admin/dashboard-edit-link";
import type { CoachTeamListItem } from "@/lib/admin/load-coach-teams";
import { isBillingConfigured } from "@/lib/billing/config";
import { loadCoachEntitlements } from "@/lib/billing/coach-subscription";
import { loadCoachTeams } from "@/lib/admin/load-coach-teams";
import { requireAuth } from "@/lib/auth/require-auth";
import { publicTeamUrl } from "@/lib/teams/public-url";
import { CopyLinkButton } from "@/components/mts/copy-link-button";
import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

function teamEditLocked(team: CoachTeamListItem, billingActive: boolean): boolean {
  if (team.role !== "coach") return false;
  return Boolean(team.plan_edit_locked) || !billingActive;
}

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
  const hasLemonSubscription = Boolean(entitlements?.subscription?.lemonSubscriptionId);
  const checkoutPlanDefault =
    startPlan ?? (entitlements?.subscription?.planType === "academy" ? "academy" : "single_team");

  const ownedTeams = list.filter((t) => t.role === "coach");
  const assistedTeams = list.filter((t) => t.role === "assistant");
  const isAssistantOnly = ownedTeams.length === 0 && assistedTeams.length > 0;
  const isCoach = ownedTeams.length > 0;
  const checkoutSuccess = sp.checkout === "success";
  const checkoutPlan =
    sp.plan === "academy" || sp.plan === "single_team"
      ? (sp.plan as "academy" | "single_team")
      : null;
  const billingNotice = typeof sp.billing === "string" ? sp.billing : undefined;

  const primaryTeam = ownedTeams.find((t) => t.is_plan_primary) ?? ownedTeams[0];
  const billingConfigured = isBillingConfigured();
  const needsFirstTeamSetup = ownedTeams.length === 0 && !isAssistantOnly && !fatalError;
  const hasOwnedTeam = ownedTeams.length > 0;

  function publishLabel(status: string | null | undefined) {
    return status === "published" ? "Live" : "Not live";
  }

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

        {checkoutSuccess ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-950"
          >
            <p className="font-semibold">Payment successful — thank you!</p>
            <p className="mt-1 text-emerald-900/90">
              {checkoutPlan === "academy"
                ? "Your Academy plan is active. You can create and manage multiple team pages."
                : "Your Team Plan is active. Open your team page below to finish setup."}
            </p>
          </div>
        ) : null}

        {billingNotice === "no_portal" ? (
          <div
            role="status"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            <p className="font-semibold">Billing portal isn&apos;t available yet.</p>
            <p className="mt-1">Use checkout below or contact support if you already paid.</p>
          </div>
        ) : null}

        {billingNotice === "not_configured" ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950"
          >
            <p className="font-semibold">Checkout is not configured yet.</p>
            <p className="mt-1">
              Lemon Squeezy environment variables are missing on the server. Please try again later or contact
              support.
            </p>
          </div>
        ) : null}

        {billingNotice === "checkout_failed" ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950"
          >
            <p className="font-semibold">Could not start checkout.</p>
            <p className="mt-1">
              Lemon Squeezy rejected the checkout request. Check your plan variant IDs in Vercel, then try again.
            </p>
            <form action={startCheckoutFormAction} className="mt-3">
              <input type="hidden" name="plan" value={checkoutPlanDefault} />
              <button type="submit" className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white">
                Try checkout again
              </button>
            </form>
          </div>
        ) : null}

        {upgrade === "academy" ? (
          <div
            role="status"
            className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-sm text-indigo-950"
          >
            <p className="font-semibold">You&apos;ve reached your team limit.</p>
            <p className="mt-1 text-indigo-900/90">Your Team Plan includes one active team page.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <form action={startCheckoutFormAction}>
                <input type="hidden" name="plan" value="academy" />
                <button
                  type="submit"
                  className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Upgrade to Academy
                </button>
              </form>
              <Link
                href="/admin"
                className="inline-flex items-center rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-800"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : null}

        {isCoach && !billingActive && hasOwnedTeam ? (
          <div
            role="status"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            <p className="font-semibold">Your subscription is not active.</p>
            <p className="mt-1 text-amber-900/90">
              {hasLemonSubscription
                ? "Please update your billing to continue editing your team page."
                : "Subscribe to Team Plan to unlock editing and publishing."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {hasLemonSubscription ? (
                <form action={openBillingPortal}>
                  <button type="submit" className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white">
                    Manage billing
                  </button>
                </form>
              ) : billingConfigured ? (
                <form action={startCheckoutFormAction}>
                  <input type="hidden" name="plan" value={checkoutPlanDefault} />
                  <button type="submit" className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white">
                    Subscribe — Team Plan €29/mo
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        ) : null}

        {needsFirstTeamSetup ? (
          <>
            <header>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Coach</p>
              <h1 className="mt-1 text-2xl font-bold">Create your team page</h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Add your team name, sport, and page link — then we&apos;ll open the builder so you can add your logo,
                schedule, and photos.
              </p>
              {userEmail ? <p className="mt-2 text-sm text-zinc-500">Signed in as {userEmail}</p> : null}
            </header>
            <FirstTeamSetup siteOrigin={siteUrl} />
            <p className="text-center text-xs text-zinc-500">
              <Link href="/" className="underline">
                Marketing home
              </Link>
            </p>
          </>
        ) : (
          <>
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {isAssistantOnly ? "Page admin" : "Coach"}
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">
                {isAssistantOnly
                  ? "Teams you help manage"
                  : isAcademy
                    ? "My Teams"
                    : "Your team"}
              </h1>
              {isAssistantOnly ? (
                <p className="mt-1 text-sm text-zinc-600">
                  You can edit these team pages. Billing and publishing stay with the team owner.
                </p>
              ) : isAcademy ? (
                <p className="mt-1 text-sm text-zinc-600">Create and manage all your team pages from one place.</p>
              ) : null}
            </div>
            {isCoach ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                  {entitlements?.planLabel ?? (isAcademy ? "Academy Plan" : "Team Plan")}
                </span>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
                  {showLimit}
                </span>
                {hasLemonSubscription ? (
                  <form action={openBillingPortal}>
                    <button
                      type="submit"
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold"
                    >
                      Manage billing
                    </button>
                  </form>
                ) : billingConfigured ? (
                  <form action={startCheckoutFormAction}>
                    <input type="hidden" name="plan" value={checkoutPlanDefault} />
                    <button
                      type="submit"
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-900"
                    >
                      Subscribe
                    </button>
                  </form>
                ) : null}
              </div>
            ) : null}
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

        {isCoach && entitlements?.needsPrimaryTeamSelection ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
            <p className="font-semibold">
              Your current plan includes 1 team page. Choose which team should stay active.
            </p>
            <p className="mt-1 text-amber-900/90">
              We keep all your team pages safe, but only one can be editable on the Team Plan.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {list
                .filter((t) => t.role === "coach")
                .map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-zinc-900">{t.name}</p>
                      <p className="truncate text-xs text-zinc-500">{publicTeamUrl(siteUrl, t.slug)}</p>
                    </div>
                    <form action={setPrimaryTeamFormAction}>
                      <input type="hidden" name="teamId" value={t.id} />
                      <button type="submit" className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white">
                        Keep active
                      </button>
                    </form>
                  </div>
                ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={startCheckoutFormAction}>
                <input type="hidden" name="plan" value="academy" />
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

        {isCoach && billingConfigured && (startPlan || (!billingActive && !hasLemonSubscription && hasOwnedTeam)) ? (
          <section className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-sm text-indigo-950">
            <p className="font-semibold">
              {checkoutPlanDefault === "academy" ? "Upgrade to Academy Plan" : "Start Team Plan"}
            </p>
            <p className="mt-1 text-indigo-900/90">You will be redirected to Lemon Squeezy secure checkout.</p>
            <form action={startCheckoutFormAction} className="mt-3">
              <input type="hidden" name="plan" value={checkoutPlanDefault} />
              <button type="submit" className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white">
                Continue to checkout
              </button>
            </form>
          </section>
        ) : null}

        {isCoach && isAcademy ? (
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
              {ownedTeams.map((t) => {
                const url = publicTeamUrl(siteUrl, t.slug);
                const locked = teamEditLocked(t, billingActive);
                return (
                  <div
                    key={t.id}
                    className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold">{t.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {publishLabel(t.publish_status)} · {t.subscription_status}
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
                      <DashboardEditLink teamId={t.id} disabled={locked} label="Edit" />
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
        ) : isCoach && primaryTeam ? (
          <section className="space-y-3">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Your team page</p>
                  <p className="mt-1 truncate text-lg font-bold">{primaryTeam.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {publishLabel(primaryTeam.publish_status)} · {primaryTeam.subscription_status}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <DashboardEditLink
                    teamId={primaryTeam.id}
                    disabled={teamEditLocked(primaryTeam, billingActive)}
                    label="Edit team"
                    size="md"
                  />
                  <CopyLinkButton url={publicTeamUrl(siteUrl, primaryTeam.slug)} />
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={publicTeamUrl(siteUrl, primaryTeam.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate rounded-xl bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-700 ring-1 ring-zinc-100"
                >
                  {publicTeamUrl(siteUrl, primaryTeam.slug)}
                </a>
              </div>
              {!billingActive ? (
                <p className="mt-3 text-xs text-amber-700">
                  Editing and publishing are locked while subscription is inactive.
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {assistedTeams.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-900">
              {isAssistantOnly ? "Your teams" : "Teams you admin"}
            </h2>
            <div className={`grid gap-3 ${isAssistantOnly ? "" : "sm:grid-cols-2"}`}>
              {assistedTeams.map((t) => {
                const url = publicTeamUrl(siteUrl, t.slug);
                return (
                  <div key={t.id} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="truncate text-base font-bold">{t.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Page admin · {publishLabel(t.publish_status)}
                    </p>
                    <div className="mt-3">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate rounded-xl bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-700 ring-1 ring-zinc-100"
                      >
                        {url}
                      </a>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <DashboardEditLink teamId={t.id} disabled={false} label="Edit page" />
                      <CopyLinkButton url={url} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {!fatalError && isCoach && isAcademy && hasOwnedTeam ? (
          <section id="create-team">
            <FirstTeamSetup
              siteOrigin={siteUrl}
              variant="additional"
              disabled={!entitlements?.canCreateTeam}
            />
          </section>
        ) : null}

        <p className="text-center text-xs text-zinc-500">
          <Link href="/" className="underline">
            Marketing home
          </Link>
        </p>
          </>
        )}
      </div>
    </div>
  );
}
