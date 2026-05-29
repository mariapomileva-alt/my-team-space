import { createTeamAction } from "@/app/admin/actions";
import { openBillingPortal, startCheckoutSession } from "@/app/admin/lemon-actions";
import { loadCoachTeams } from "@/lib/admin/load-coach-teams";
import { requireAuth } from "@/lib/auth/require-auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const { supabase, user } = await requireAuth();
  const userEmail = user.email ?? "";

  let list: Awaited<ReturnType<typeof loadCoachTeams>>["list"] = [];
  let teamsError: string | null = null;
  let fatalError: string | null = null;

  try {
    const loaded = await loadCoachTeams(supabase, user.id);
    list = loaded.list;
    teamsError = loaded.error;
  } catch (e) {
    fatalError = e instanceof Error ? e.message : "Could not load admin page";
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 sm:px-8">
      <div className="mx-auto max-w-lg space-y-8">
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

        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Coach</p>
          <h1 className="text-2xl font-bold">Your teams</h1>
          {userEmail ? <p className="mt-2 text-sm text-zinc-600">Signed in as {userEmail}</p> : null}
          <p className="mt-3 text-xs text-zinc-500">
            New here?{" "}
            <Link href="/admin/signup" className="font-medium text-indigo-600 underline">
              Create a coach account
            </Link>
            .
          </p>
        </header>

        <ul className="space-y-3">
          {list.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm"
            >
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-zinc-500">
                  {t.slug} · {t.subscription_status}
                  {t.role === "assistant" ? " · admin" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/team/${t.id}/step-1`}
                  className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Edit
                </Link>
                {t.role === "coach" ? (
                  t.subscription_status !== "active" && t.subscription_status !== "trialing" ? (
                    <form action={startCheckoutSession.bind(null, t.id)}>
                      <button
                        type="submit"
                        className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Subscribe
                      </button>
                    </form>
                  ) : (
                    <form action={openBillingPortal.bind(null, t.id)}>
                      <button
                        type="submit"
                        className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold"
                      >
                        Manage billing
                      </button>
                    </form>
                  )
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        {!fatalError ? (
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold">Create a team</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Choose a URL slug (letters, numbers, hyphens). You can subscribe after creation.
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
