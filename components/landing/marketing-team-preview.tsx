"use client";

import { motion } from "framer-motion";

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/90 px-4 py-2.5">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/90" />
      </div>
      <div className="mx-auto flex min-w-0 max-w-[62%] flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1 ring-1 ring-neutral-100">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
        <span className="truncate text-[11px] font-medium text-neutral-500">{url}</span>
      </div>
    </div>
  );
}

function ModuleCard({
  icon,
  title,
  subtitle,
  children,
  className = "",
}: {
  icon: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-neutral-100/90 bg-white shadow-[0_2px_20px_-12px_rgba(15,23,42,0.08)] ${className}`}
    >
      <header className="flex items-start justify-between gap-2 border-b border-neutral-50 px-4 py-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-base ring-1 ring-sky-100/80">
            {icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-[13px] font-bold leading-tight text-neutral-900">{title}</h3>
            {subtitle ? <p className="mt-0.5 text-[11px] text-neutral-400">{subtitle}</p> : null}
          </div>
        </div>
        <span className="mt-0.5 text-sm text-neutral-300" aria-hidden>
          →
        </span>
      </header>
      <div className="flex-1 px-4 py-3">{children}</div>
    </article>
  );
}

function ScheduleRows() {
  const rows = [
    { day: "Mon", title: "Technique & endurance", time: "17:00", place: "Pool A", tint: "bg-orange-50/80" },
    { day: "Wed", title: "Starts & turns", time: "17:30", place: "Pool A", tint: "bg-white" },
    { day: "Sat", title: "County meet", time: "09:00", place: "Away", tint: "bg-sky-50/70" },
  ];
  return (
    <div className="space-y-1.5">
      {rows.map((row) => (
        <div key={row.day} className={`rounded-xl px-3 py-2 ${row.tint}`}>
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[12px] font-semibold text-neutral-800">{row.title}</p>
            <span className="shrink-0 text-[11px] font-bold text-sky-700">{row.time}</span>
          </div>
          <p className="mt-0.5 text-[10px] text-neutral-400">
            {row.day} · {row.place}
          </p>
        </div>
      ))}
    </div>
  );
}

function ResultsRows() {
  const rows = [
    { rank: 1, name: "Mia K.", pts: 142, medals: "🥇🥇", bar: "w-[88%]" },
    { rank: 2, name: "Leo P.", pts: 128, medals: "🥈", bar: "w-[72%]" },
    { rank: 3, name: "Sara N.", pts: 115, medals: "🥉", bar: "w-[60%]" },
  ];
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.rank} className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-800">
            {row.name.slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[12px] font-semibold text-neutral-800">
                {row.rank}. {row.name}
              </p>
              <span className="shrink-0 text-[10px] text-neutral-400">{row.medals}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div className={`h-full rounded-full bg-violet-400/70 ${row.bar}`} />
              </div>
              <span className="text-[10px] font-semibold tabular-nums text-violet-700">{row.pts}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactsRows() {
  const people = [
    { name: "Coach Anna", role: "Head coach", initial: "A", color: "bg-sky-500" },
    { name: "Mark T.", role: "Assistant", initial: "M", color: "bg-teal-500" },
  ];
  return (
    <div className="space-y-2.5">
      {people.map((p) => (
        <div key={p.name} className="flex items-center gap-2.5">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${p.color}`}>
            {p.initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-neutral-800">{p.name}</p>
            <p className="text-[10px] text-neutral-400">{p.role}</p>
          </div>
          <span className="text-[11px] font-semibold text-sky-600">Contact</span>
        </div>
      ))}
    </div>
  );
}

function GalleryThumbs() {
  const tones = [
    "from-cyan-200 to-sky-300",
    "from-blue-200 to-indigo-300",
    "from-teal-200 to-emerald-300",
  ];
  return (
    <div className="flex gap-2">
      {tones.map((tone, i) => (
        <div
          key={i}
          className={`h-14 flex-1 rounded-xl bg-gradient-to-br ${tone} shadow-sm ring-1 ring-white/60`}
        />
      ))}
    </div>
  );
}

/** Full team page mockup for the marketing homepage — premium club website feel. */
export function MarketingTeamPagePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-5xl"
    >
      <div className="overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-[0_40px_100px_-40px_rgba(15,23,42,0.22)] ring-1 ring-neutral-100/80">
        <BrowserChrome url="myteamspace.com/aqua-wave" />

        <div className="bg-[#f4f8fc]">
          {/* Announcement bar */}
          <div className="flex items-center justify-between gap-3 border-b border-sky-100/80 bg-sky-50/90 px-4 py-2.5 sm:px-6">
            <p className="text-[12px] font-medium text-sky-900/90 sm:text-[13px]">
              County meet this Sunday — warm-up 8:30, details in schedule
            </p>
            <span className="hidden shrink-0 text-sky-400 sm:inline" aria-hidden>
              →
            </span>
          </div>

          {/* Hero */}
          <div className="border-b border-neutral-100/80 bg-white px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
              <div className="relative min-h-[120px] flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 sm:min-h-[148px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.22),transparent_55%)]" />
                <div className="absolute bottom-3 left-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-lg ring-4 ring-white sm:h-16 sm:w-16">
                  🌊
                </div>
              </div>
              <div className="min-w-0 flex-1 sm:pb-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-[family-name:var(--font-brand)] text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                      Aqua Wave Swim Club
                    </h4>
                    <p className="mt-1 text-[13px] font-medium text-sky-600">Competitive swimming · 8–16</p>
                    <p className="mt-1 flex items-center gap-1 text-[12px] text-neutral-400">
                      <span aria-hidden>📍</span> Tallinn, Estonia
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                    Live
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  {["📷", "💬"].map((icon) => (
                    <span
                      key={icon}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 text-sm ring-1 ring-neutral-100"
                    >
                      {icon}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Module grid */}
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 lg:grid-cols-3">
            <ModuleCard icon="📅" title="Schedule" subtitle="Next 7 days" className="sm:col-span-1">
              <ScheduleRows />
            </ModuleCard>

            <ModuleCard icon="🏆" title="Cups & achievements" subtitle="This season">
              <div className="space-y-2">
                <div className="rounded-xl bg-amber-50/90 px-3 py-2.5 ring-1 ring-amber-100/60">
                  <p className="text-[12px] font-semibold text-amber-950">Paris Open · 200m free</p>
                  <p className="mt-0.5 text-[10px] text-amber-800/70">Mia K. · Gold</p>
                </div>
                <div className="rounded-xl bg-violet-50/80 px-3 py-2.5 ring-1 ring-violet-100/50">
                  <p className="text-[12px] font-semibold text-violet-950">Club excellence award</p>
                  <p className="mt-0.5 text-[10px] text-violet-700/70">Team spirit · March</p>
                </div>
              </div>
            </ModuleCard>

            <ModuleCard icon="📊" title="Competition results" subtitle="Season standings">
              <ResultsRows />
            </ModuleCard>

            <ModuleCard icon="👥" title="Contacts" subtitle="Coaches & staff">
              <ContactsRows />
            </ModuleCard>

            <ModuleCard icon="💳" title="Payments" subtitle="Membership">
              <div className="rounded-xl bg-neutral-50 px-3 py-3 ring-1 ring-neutral-100">
                <p className="text-[12px] font-semibold text-neutral-800">March membership</p>
                <p className="mt-0.5 text-[11px] text-neutral-400">Due by 5 Mar</p>
                <p className="mt-2 text-lg font-bold text-neutral-900">€45</p>
                <div className="mt-3 rounded-xl bg-neutral-900 px-3 py-2 text-center text-[11px] font-semibold text-white">
                  Pay online
                </div>
              </div>
            </ModuleCard>

            <ModuleCard icon="🚌" title="Trips" subtitle="Upcoming travel">
              <div className="space-y-2">
                <div className="rounded-xl bg-emerald-50/80 px-3 py-2.5">
                  <p className="text-[12px] font-semibold text-emerald-900">County meet · Sunday</p>
                  <p className="mt-0.5 text-[10px] text-emerald-700/80">Bus 07:30 · Pool B</p>
                  <div className="mt-2 flex gap-2">
                    <span className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white">Confirm</span>
                    <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-medium text-neutral-500 ring-1 ring-neutral-100">
                      Can&apos;t go
                    </span>
                  </div>
                </div>
              </div>
            </ModuleCard>

            <ModuleCard icon="📋" title="Quick poll" subtitle="Team dinner">
              <p className="text-[12px] font-medium text-neutral-700">Friday team dinner — who&apos;s in?</p>
              <div className="mt-3 flex flex-col gap-2">
                <span className="rounded-xl bg-violet-600 px-3 py-2 text-center text-[11px] font-semibold text-white">
                  We&apos;re in!
                </span>
                <span className="rounded-xl bg-violet-50 px-3 py-2 text-center text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100">
                  Can&apos;t make it
                </span>
              </div>
            </ModuleCard>

            <ModuleCard icon="📸" title="Gallery" subtitle="Latest photos">
              <GalleryThumbs />
              <p className="mt-2 text-[10px] text-neutral-400">12 new photos from county meet</p>
            </ModuleCard>

            <ModuleCard icon="🔗" title="Smart integrations" subtitle="External links">
              <div className="space-y-2">
                {["Game film", "Live results", "Club shop"].map((label) => (
                  <div key={label} className="flex items-center justify-between rounded-lg bg-neutral-50 px-2.5 py-2">
                    <span className="text-[11px] font-medium text-neutral-700">{label}</span>
                    <span className="text-[10px] text-neutral-300">↗</span>
                  </div>
                ))}
              </div>
            </ModuleCard>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
