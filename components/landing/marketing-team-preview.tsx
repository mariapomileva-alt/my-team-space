"use client";

import { SHOWCASE_COVERS, SHOWCASE_LOGOS } from "@/lib/showcase/logo-svg";
import { motion } from "framer-motion";
import Image from "next/image";

function ModuleCard({
  icon,
  title,
  subtitle,
  footer = "View all",
  children,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  footer?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-neutral-100/90 bg-white shadow-[0_2px_16px_-10px_rgba(15,23,42,0.1)]">
      <header className="flex items-start gap-2.5 px-4 pb-2 pt-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-lg ring-1 ring-neutral-100/80">
          {icon}
        </span>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-[13px] font-bold leading-tight text-neutral-900">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-[11px] text-neutral-400">{subtitle}</p> : null}
        </div>
      </header>
      <div className="flex-1 px-4 pb-2">{children}</div>
      <footer className="border-t border-neutral-50 px-4 py-2.5">
        <span className="text-[11px] font-semibold text-orange-500">
          {footer} <span aria-hidden>→</span>
        </span>
      </footer>
    </article>
  );
}

function ScheduleList() {
  const rows = [
    { day: "Mon", title: "Morning squad", time: "06:30", place: "50 m pool", tint: "bg-rose-50/50" },
    { day: "Wed", title: "Technique session", time: "06:30", place: "50 m pool", tint: "bg-white" },
    { day: "Fri", title: "Endurance set", time: "06:30", place: "50 m pool", tint: "bg-rose-50/50" },
    { day: "Sun", title: "County meet", time: "08:00", place: "Olympic Centre", tint: "bg-white" },
  ];
  return (
    <div className="space-y-1">
      {rows.map((row) => (
        <div key={row.day} className={`rounded-lg px-2.5 py-2 ${row.tint}`}>
          <p className="text-[11px] font-semibold text-neutral-800">
            {row.day} · {row.title}
          </p>
          <p className="mt-0.5 text-[10px] text-neutral-400">
            {row.time} · {row.place}
          </p>
        </div>
      ))}
    </div>
  );
}

function AchievementTiles() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-xl bg-amber-50/90 p-2.5 ring-1 ring-amber-100/70">
        <div className="mb-2 flex h-10 items-end justify-center rounded-lg bg-gradient-to-t from-amber-100 to-amber-50 text-lg">
          🩰
        </div>
        <p className="text-[10px] font-bold text-amber-950">Paris prize</p>
        <p className="mt-0.5 text-[10px] font-medium text-neutral-700">Camille R.</p>
        <p className="text-[9px] text-neutral-400">Silver solo · 2025</p>
      </div>
      <div className="rounded-xl bg-violet-50/80 p-2.5 ring-1 ring-violet-100/60">
        <div className="mb-2 flex h-10 items-center justify-center rounded-lg bg-gradient-to-t from-violet-100 to-violet-50 text-lg">
          ✨
        </div>
        <p className="text-[10px] font-bold text-violet-950">Excellence award</p>
        <p className="mt-0.5 text-[10px] font-medium text-neutral-700">Étoile pre-pro</p>
        <p className="text-[9px] text-neutral-400">Technique & artistry</p>
      </div>
    </div>
  );
}

function ResultsList() {
  const rows = [
    { rank: 1, name: "Krista L.", pts: 10, initial: "K", medals: "1🥇 0🥈 0🥉", bar: "w-full" },
    { rank: 2, name: "Relay A", pts: 10, initial: "R", medals: "1🥇 0🥈 0🥉", bar: "w-full" },
    { rank: 3, name: "Markus T.", pts: 8, initial: "M", medals: "0🥇 1🥈 0🥉", bar: "w-[80%]" },
  ];
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold text-neutral-400">2026 Season</p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.rank} className="flex items-start gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-800">
              {row.initial}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-neutral-800">
                  {row.rank}. {row.name}
                </p>
                <span className="shrink-0 text-[9px] text-neutral-400">{row.medals}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div className={`h-full rounded-full bg-violet-400/75 ${row.bar}`} />
                </div>
                <span className="text-[10px] font-semibold tabular-nums text-violet-700">{row.pts}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsList() {
  const people = [
    { name: "Coach Anna", role: "Artistic director" },
    { name: "Ms. Liga", role: "Studio manager" },
  ];
  return (
    <div className="space-y-2.5">
      {people.map((p) => (
        <div key={p.name} className="flex items-center gap-2.5">
          <span className="h-8 w-8 shrink-0 rounded-full bg-neutral-200 ring-2 ring-white" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-neutral-800">{p.name}</p>
            <p className="text-[10px] text-neutral-400">{p.role}</p>
          </div>
          <span className="text-[11px] font-semibold text-violet-600">Contact</span>
        </div>
      ))}
    </div>
  );
}

function TripsList() {
  const trips = [
    { title: "Tallinn tournament", meta: "Mar 14–16 · bus · hotel included" },
    { title: "Gear check", meta: "Full kit · parents sign waiver" },
  ];
  return (
    <div className="space-y-2.5">
      {trips.map((trip) => (
        <div key={trip.title} className="rounded-xl bg-neutral-50/80 px-2.5 py-2">
          <p className="text-[11px] font-semibold text-neutral-800">{trip.title}</p>
          <p className="mt-0.5 text-[10px] text-neutral-400">{trip.meta}</p>
          <div className="mt-2 flex gap-1.5">
            <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[9px] font-semibold text-white">Confirm</span>
            <span className="rounded-md bg-white px-2 py-0.5 text-[9px] font-medium text-neutral-500 ring-1 ring-neutral-100">
              Can&apos;t go
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryStrip() {
  const thumbs = [
    "from-sky-200 to-cyan-300",
    "from-blue-200 to-indigo-300",
    "from-teal-200 to-emerald-300",
  ];
  return (
    <div>
      <p className="mb-2 text-[10px] text-neutral-400">3 photos</p>
      <div className="flex gap-2">
        {thumbs.map((tone, i) => (
          <div key={i} className={`h-16 w-12 shrink-0 rounded-lg bg-gradient-to-b ${tone} shadow-sm`} />
        ))}
      </div>
    </div>
  );
}

function IntegrationsList() {
  const links = [
    { label: "Game film", host: "hudl.com" },
    { label: "Highlights", host: "Watch video" },
  ];
  return (
    <div className="space-y-2">
      {links.map((link) => (
        <div key={link.label} className="flex items-center justify-between rounded-lg bg-neutral-50 px-2.5 py-2">
          <div>
            <p className="text-[11px] font-semibold text-neutral-800">{link.label}</p>
            <p className="text-[10px] text-neutral-400">{link.host}</p>
          </div>
          <span className="text-[10px] text-neutral-300">↗</span>
        </div>
      ))}
    </div>
  );
}

/** Aqua Wave Swim Club mockup — faithful to the reference design. */
export function MarketingTeamPagePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-5xl"
    >
      <div className="overflow-hidden rounded-[1.5rem] border border-neutral-200/70 bg-[#eef4f9] shadow-[0_32px_80px_-32px_rgba(15,23,42,0.18)] ring-1 ring-neutral-100/80">
        {/* Announcement bar */}
        <div className="flex items-center justify-between gap-3 border-b border-sky-100 bg-sky-50 px-4 py-2.5 sm:px-5">
          <p className="text-[11px] font-medium leading-snug text-sky-900/90 sm:text-[12px]">
            <span aria-hidden>📣 🏊 </span>
            County meet Sunday — warm-up 08:00. Please confirm with your coach.
          </p>
          <span className="shrink-0 text-sky-400" aria-hidden>
            ›
          </span>
        </div>

        {/* Hero */}
        <div className="border-b border-neutral-100/80 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">
            <div className="relative min-h-[130px] flex-1 overflow-hidden rounded-2xl sm:min-h-[148px] sm:max-w-[48%]">
              <img
                src={SHOWCASE_COVERS.swim}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute bottom-3 left-3 h-14 w-14 overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-white sm:h-16 sm:w-16">
                <Image
                  src={SHOWCASE_LOGOS.swim}
                  alt=""
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-[family-name:var(--font-brand)] text-xl font-bold tracking-tight text-neutral-900 sm:text-[1.35rem]">
                    Aqua Wave Swim Club
                  </h4>
                  <p className="mt-1 text-[12px] font-medium text-sky-600">Competitive swimming · 8–16</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400">
                    <span aria-hidden>📍</span> Tallinn, Estonia
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                  Live
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 text-sm ring-1 ring-neutral-100">
                  📷
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 text-sm ring-1 ring-neutral-100">
                  💬
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module grid */}
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-3.5 sm:p-5 lg:grid-cols-3">
          <ModuleCard icon="📅" title="Schedule" subtitle="Next 7 days">
            <ScheduleList />
          </ModuleCard>

          <ModuleCard icon="🏆" title="Cups & achievements" subtitle="This season">
            <AchievementTiles />
          </ModuleCard>

          <ModuleCard icon="📊" title="Competition results" subtitle="Season standings" footer="View results">
            <ResultsList />
          </ModuleCard>

          <ModuleCard icon="👋" title="Contacts" subtitle="Coaches & staff">
            <ContactsList />
          </ModuleCard>

          <ModuleCard icon="💳" title="Payments" subtitle="Membership">
            <div className="rounded-xl bg-neutral-50 px-3 py-3 ring-1 ring-neutral-100">
              <p className="text-[11px] font-semibold text-neutral-800">March membership</p>
              <p className="mt-0.5 text-[10px] text-neutral-400">€55 · includes league registration</p>
              <div className="mt-3 rounded-xl bg-neutral-900 px-3 py-2.5 text-center text-[11px] font-semibold text-white">
                Pay online
              </div>
            </div>
          </ModuleCard>

          <ModuleCard icon="🚌" title="Trips" subtitle="Upcoming travel">
            <TripsList />
          </ModuleCard>

          <ModuleCard icon="📋" title="Quick poll" subtitle="June recital" footer="View results">
            <p className="text-[11px] font-medium leading-snug text-neutral-700">
              Who is coming to the recital on June 28?
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <span className="rounded-xl bg-violet-600 px-3 py-2 text-center text-[11px] font-semibold text-white">
                We&apos;re in!
              </span>
              <span className="rounded-xl bg-neutral-100 px-3 py-2 text-center text-[11px] font-semibold text-neutral-600">
                Can&apos;t make it
              </span>
            </div>
          </ModuleCard>

          <ModuleCard icon="📸" title="Gallery" subtitle="Latest photos">
            <GalleryStrip />
          </ModuleCard>

          <ModuleCard icon="🧩" title="Smart integrations" subtitle="External links">
            <IntegrationsList />
          </ModuleCard>
        </div>
      </div>
    </motion.div>
  );
}
