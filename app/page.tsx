import Link from "next/link";

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-orange-50 text-zinc-900">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <span className="text-lg font-extrabold tracking-tight">MyTeamSpace</span>
        <nav className="flex flex-wrap gap-2 text-sm font-semibold">
          <Link href="/sharky" className="rounded-full bg-zinc-900 px-4 py-2 text-white">
            Demo team page
          </Link>
          <Link
            href="/admin/sharky"
            className="rounded-full border border-zinc-200 px-4 py-2 text-zinc-700"
          >
            Page editor (demo)
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
          A website — not an app store download
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
          A micro{" "}
          <span className="bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">
            page builder
          </span>{" "}
          for your team: Tilda-style blocks for sports clubs, schools, and kids communities.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
          Coaches toggle blocks, colors, and copy — parents and athletes open{" "}
          <strong>one link in the browser</strong>. No install: it&apos;s a normal web page with
          schedule, news, trips, results, and contacts.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Your own URL",
              d: "e.g. myteamspace.app/sharky — logo, colors, and blocks unique to your team.",
            },
            {
              t: "Block constructor",
              d: "Enable, disable, reorder — no code, ready in minutes.",
            },
            {
              t: "Parents & kids",
              d: "Large tap targets, clear cards; works great on mobile Safari and Chrome.",
            },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-xl shadow-sky-100/50"
            >
              <h2 className="font-bold text-zinc-900">{x.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{x.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-zinc-500">
          Built with Next.js and Tailwind; Supabase next for saving each team&apos;s page in the cloud.
        </p>
      </main>
    </div>
  );
}
