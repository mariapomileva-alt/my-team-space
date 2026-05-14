import { MtsBadge, MtsCard } from "@/components/mts/card";
import type { TeamSpace } from "@/lib/types";
import { motion } from "framer-motion";

export function BlockHero({ team }: { team: TeamSpace }) {
  const quote =
    (team.blocks.find((b) => b.type === "hero")?.settings?.quote as string) ||
    "Show up. Cheer loud. Grow together.";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <div
        className="rounded-[var(--mts-radius)] border border-[color:var(--mts-card-border)] p-6 sm:p-8"
        style={{
          background: `radial-gradient(120% 80% at 20% 0%, var(--mts-accent-soft), transparent 55%), var(--mts-card)`,
          boxShadow: "var(--mts-shadow)",
        }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <MtsBadge>Team webpage</MtsBadge>
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--mts-text)" }}
            >
              {team.name}
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-[color:var(--mts-muted)]">
              {team.tagline}
            </p>
            <p className="text-lg font-medium italic text-[color:var(--mts-primary-bright)]">
              “{quote}”
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://wa.me/"
              className="inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-2xl bg-[var(--mts-accent)] px-4 font-semibold text-white shadow-md transition active:scale-[0.98]"
            >
              WhatsApp
            </a>
            <a
              href="https://t.me/"
              className="inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-2xl border-2 border-[color:var(--mts-primary)] bg-white/10 px-4 font-semibold text-[color:var(--mts-text)] backdrop-blur transition active:scale-[0.98]"
            >
              Telegram
            </a>
            <a
              href="tel:"
              className="inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-2xl bg-[var(--mts-primary)] px-4 font-semibold text-white transition active:scale-[0.98]"
            >
              Call coach
            </a>
          </div>
        </div>
        <div
          className="mt-6 h-32 rounded-2xl border border-dashed border-[color:var(--mts-card-border)] sm:h-40"
          style={{
            background:
              "linear-gradient(120deg, rgba(14,165,233,0.15) 0%, rgba(255,107,45,0.1) 100%)",
          }}
        >
          <p className="flex h-full items-center justify-center px-4 text-center text-sm text-[color:var(--mts-muted)]">
            Cover image (Storage) or embed video from YouTube/Vimeo — not uploaded to Supabase
          </p>
        </div>
      </div>
    </motion.section>
  );
}

export function BlockAnnouncementBar() {
  return (
    <div
      className="sticky top-0 z-40 border-b border-[color:var(--mts-card-border)] px-4 py-3 backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--mts-primary) 12%, transparent)" }}
    >
      <p className="text-center text-sm font-medium text-[color:var(--mts-text)]">
        <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--mts-accent)]" />
        Training at 18:00 · bus Saturday 07:30
      </p>
    </div>
  );
}

export function BlockCalendar() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[color:var(--mts-text)]">Calendar</h2>
        <MtsBadge>Google</MtsBadge>
      </div>
      <p className="mb-4 text-sm text-[color:var(--mts-muted)]">
        Trainings, meets, camps — connect Google Calendar in the editor.
      </p>
      <div className="h-48 rounded-2xl border border-dashed border-[color:var(--mts-card-border)] bg-[var(--mts-accent-soft)]" />
    </MtsCard>
  );
}

export function BlockSchedule() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Weekly schedule</h2>
      <ul className="space-y-2 text-sm">
        {["Mon — pool", "Wed — run + bike", "Fri — team meet"].map((l) => (
          <li
            key={l}
            className="flex min-h-12 items-center justify-between rounded-xl bg-[var(--mts-accent-soft)] px-3 py-2"
          >
            <span>{l}</span>
            <span className="text-[color:var(--mts-muted)]">18:00</span>
          </li>
        ))}
      </ul>
    </MtsCard>
  );
}

export function BlockResults() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Results & highlights</h2>
        <MtsBadge>Live</MtsBadge>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { t: "Gold", n: "Danik", e: "🥇" },
          { t: "Silver", n: "Mark", e: "🥈" },
          { t: "Team", n: "3rd", e: "🏅" },
        ].map((x) => (
          <div
            key={x.n}
            className="rounded-2xl border border-[color:var(--mts-card-border)] p-4 text-center"
          >
            <div className="text-2xl">{x.e}</div>
            <div className="font-semibold">{x.n}</div>
            <div className="text-xs text-[color:var(--mts-muted)]">{x.t}</div>
          </div>
        ))}
      </div>
    </MtsCard>
  );
}

export function BlockAchievements() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Trophies & streaks</h2>
      <div className="flex flex-wrap gap-2">
        {["Athlete of the week", "7-day streak", "Fair play"].map((b) => (
          <span
            key={b}
            className="rounded-full border border-[color:var(--mts-ring)] bg-[var(--mts-accent-soft)] px-3 py-1.5 text-xs font-semibold"
          >
            {b}
          </span>
        ))}
      </div>
    </MtsCard>
  );
}

export function BlockTeamFeed() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Team feed</h2>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-[var(--mts-accent-soft)] p-4">
            <p className="text-sm font-medium">Photos from the weekend race ✨</p>
            <p className="mt-1 text-xs text-[color:var(--mts-muted)]">Coach · 2h ago</p>
          </div>
        ))}
      </div>
    </MtsCard>
  );
}

export function BlockAttendance() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Attendance</h2>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-black text-[color:var(--mts-primary-bright)]">92%</span>
        <span className="pb-1 text-sm text-[color:var(--mts-muted)]">this month</span>
      </div>
    </MtsCard>
  );
}

export function BlockCampTrip() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-2 text-lg font-bold">Camp & trip</h2>
      <p className="mb-4 text-sm text-[color:var(--mts-muted)]">
        Bus seats, lists, documents, and parent confirmations — configure in the editor.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-[color:var(--mts-card-border)] p-3 text-sm">
          Bus 12 / 15 seats
        </div>
        <div className="rounded-xl border border-[color:var(--mts-card-border)] p-3 text-sm">
          Checklist 8 / 12
        </div>
      </div>
    </MtsCard>
  );
}

export function BlockContacts() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Contacts</h2>
      <ul className="space-y-3 text-sm">
        <li className="flex justify-between">
          <span>Head coach</span>
          <a className="font-semibold text-[color:var(--mts-primary-bright)]" href="tel:">
            Call
          </a>
        </li>
        <li className="flex justify-between">
          <span>Emergency</span>
          <span className="text-[color:var(--mts-muted)]">On file with coach</span>
        </li>
      </ul>
    </MtsCard>
  );
}

export function BlockDocuments() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Documents</h2>
      <div className="flex flex-col gap-2">
        {["Rules PDF", "Nutrition tips", "Race info"].map((d) => (
          <button
            key={d}
            type="button"
            className="flex min-h-12 items-center justify-between rounded-xl border border-[color:var(--mts-card-border)] px-4 text-left text-sm font-medium transition hover:bg-[var(--mts-accent-soft)]"
          >
            {d}
            <span>↓</span>
          </button>
        ))}
      </div>
    </MtsCard>
  );
}

export function BlockPolls() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Quick poll</h2>
      <p className="mb-3 text-sm text-[color:var(--mts-muted)]">Who is coming Saturday?</p>
      <div className="flex gap-2">
        <button
          type="button"
          className="min-h-11 flex-1 rounded-2xl bg-[var(--mts-primary)] font-semibold text-white"
        >
          I&apos;m in
        </button>
        <button type="button" className="min-h-11 flex-1 rounded-2xl border-2 font-semibold">
          Can&apos;t make it
        </button>
      </div>
    </MtsCard>
  );
}

export function BlockGallery() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Gallery</h2>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-gradient-to-br from-[var(--mts-primary-bright)]/30 to-[var(--mts-accent)]/30"
          />
        ))}
      </div>
    </MtsCard>
  );
}

export function BlockSponsors() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[color:var(--mts-muted)]">
        Partners & sponsors
      </h2>
      <div className="flex flex-wrap justify-center gap-6 opacity-80">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-24 rounded-lg bg-[var(--mts-accent-soft)]" />
        ))}
      </div>
    </MtsCard>
  );
}

export function BlockWeather() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Outdoor / hall</h2>
          <p className="text-sm text-[color:var(--mts-muted)]">Riga · today</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">18°</div>
          <div className="text-xs">Light wind</div>
        </div>
      </div>
    </MtsCard>
  );
}

export function BlockCountdown() {
  return (
    <MtsCard className="p-5 sm:p-6 text-center">
      <p className="text-sm font-medium text-[color:var(--mts-muted)]">Next race</p>
      <p className="mt-2 text-3xl font-black tabular-nums text-[color:var(--mts-primary-bright)]">
        12 : 04 : 33
      </p>
      <p className="mt-1 text-xs text-[color:var(--mts-muted)]">days · hrs · min</p>
    </MtsCard>
  );
}

export function BlockBirthdays() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Birthdays</h2>
      <ul className="space-y-2 text-sm">
        <li className="flex justify-between rounded-xl bg-[var(--mts-accent-soft)] px-3 py-2">
          <span>Anna</span>
          <span className="text-[color:var(--mts-muted)]">Jun 22</span>
        </li>
      </ul>
    </MtsCard>
  );
}

export function BlockQuickLinks() {
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Quick links</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {["Registration", "Payment", "Map", "Livestream"].map((l) => (
          <a
            key={l}
            href="#"
            className="flex min-h-12 items-center justify-center rounded-2xl border border-[color:var(--mts-card-border)] font-medium transition hover:bg-[var(--mts-accent-soft)]"
          >
            {l}
          </a>
        ))}
      </div>
    </MtsCard>
  );
}
