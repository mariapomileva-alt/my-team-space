import Link from "next/link";

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-orange-50 text-zinc-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-extrabold tracking-tight">MyTeamSpace</span>
        <nav className="flex gap-4 text-sm font-semibold">
          <Link href="/sharky" className="rounded-full bg-zinc-900 px-4 py-2 text-white">
            Demo team
          </Link>
          <Link
            href="/admin/sharky"
            className="rounded-full border border-zinc-200 px-4 py-2 text-zinc-700"
          >
            Admin demo
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
          Team operating system
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          Your club&apos;s home —{" "}
          <span className="bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">
            motivation, clarity & community
          </span>
          .
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
          White-label spaces for coaches and families: announcements, calendar, results,
          trips with bus seats, feeds, and polls — without enterprise complexity.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Multi-tenant",
              d: "myteamspace.app/your-team — logo, colors, modules.",
            },
            { t: "Block constructor", d: "Drag, reorder, toggle — ship in minutes." },
            { t: "Kids-first UX", d: "Large tap targets, rewards, emotional tone." },
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
          Stack: Next.js · Tailwind · Supabase · themes · drag-and-drop admin (roadmap wired).
        </p>
      </main>
    </div>
  );
}
