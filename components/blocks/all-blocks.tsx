import { MtsBadge, MtsCard } from "@/components/mts/card";
import { getBlockSettings, type SocialKey } from "@/lib/blocks/settings";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { motion } from "framer-motion";

const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: "Instagram",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
  facebook: "Facebook",
  youtube: "YouTube",
};

type HeroSettings = {
  quote: string;
  city: string;
  coverImageUrl: string;
  social: Partial<Record<SocialKey, string>>;
};

export function BlockHero({ team, block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<HeroSettings>(block);
  const quote = s.quote || "Show up. Cheer loud. Grow together.";
  const socialEntries = (Object.keys(SOCIAL_LABELS) as SocialKey[]).filter((k) => s.social?.[k]?.trim());

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
              {s.city ? <span className="mt-1 block text-sm">📍 {s.city}</span> : null}
            </p>
            <p className="text-lg font-medium italic text-[color:var(--mts-primary-bright)]">
              “{quote}”
            </p>
          </div>
          {socialEntries.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {socialEntries.map((key) => (
                <a
                  key={key}
                  href={s.social![key]!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--mts-primary)] px-4 text-sm font-semibold text-white"
                >
                  {SOCIAL_LABELS[key]}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        {s.coverImageUrl ? (
          <img src={s.coverImageUrl} alt="" className="mt-6 h-40 w-full rounded-2xl object-cover sm:h-48" />
        ) : (
          <div
            className="mt-6 h-32 rounded-2xl border border-dashed border-[color:var(--mts-card-border)] sm:h-40"
            style={{
              background:
                "linear-gradient(120deg, rgba(14,165,233,0.15) 0%, rgba(255,107,45,0.1) 100%)",
            }}
          />
        )}

      </div>
    </motion.section>
  );
}

export function BlockAnnouncementBar({ team, block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<{ message: string; urgent: boolean }>(block);
  const text = s.message?.trim() || "Welcome to our team page!";
  return (
    <div
      className="sticky top-0 z-40 border-b border-[color:var(--mts-card-border)] px-4 py-3 backdrop-blur-md"
      style={{
        background: s.urgent
          ? "color-mix(in srgb, var(--mts-accent) 22%, transparent)"
          : "color-mix(in srgb, var(--mts-primary) 12%, transparent)",
      }}
    >
      <p className={`text-center text-sm font-medium ${s.urgent ? "font-bold text-[color:var(--mts-text)]" : "text-[color:var(--mts-text)]"}`}>
        <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--mts-accent)]" />
        {text}
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

export function BlockSchedule({ team, block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<{ mode: string; events: { title: string; dayOfWeek: number; time: string; location: string; eventType: string }[]; externalUrl: string }>(block);
  const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const events = s.events ?? [];
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Weekly schedule</h2>
      {s.mode === "external" && s.externalUrl ? (
        <p className="text-sm text-[color:var(--mts-muted)]"><a href={s.externalUrl} className="font-semibold text-[color:var(--mts-primary-bright)] underline">Open full calendar</a></p>
      ) : events.length === 0 ? (
        <p className="text-sm text-[color:var(--mts-muted)]">Add trainings in the page builder.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {events.map((ev) => (
            <li key={`${ev.title}-${ev.dayOfWeek}-${ev.time}`} className="flex min-h-12 items-center justify-between rounded-xl bg-[var(--mts-accent-soft)] px-3 py-2">
              <span>{DAY[ev.dayOfWeek] ?? "?"} · {ev.title}</span>
              <span className="text-[color:var(--mts-muted)]">{ev.time}{ev.location ? ` · ${ev.location}` : ""}</span>
            </li>
          ))}
        </ul>
      )}
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

export function BlockAchievements({ team, block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<{ cards: { id: string; icon: string; title: string; player: string; description: string }[] }>(block);
  const cards = s.cards ?? [];
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Trophies & highlights</h2>
      {cards.length === 0 ? (
        <p className="text-sm text-[color:var(--mts-muted)]">Achievement cards appear here.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((c) => (
            <div key={c.id} className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
              <span className="text-2xl">{c.icon}</span>
              <p className="mt-2 font-bold text-[color:var(--mts-text)]">{c.title}</p>
              {c.player ? <p className="text-sm font-semibold text-indigo-700">{c.player}</p> : null}
              {c.description ? <p className="mt-1 text-sm text-[color:var(--mts-muted)]">{c.description}</p> : null}
            </div>
          ))}
        </div>
      )}
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

export function BlockGallery({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<{ mode: string; images: { url: string }[]; externalUrl: string }>(block);
  const images = (s.images ?? []).filter((i) => i.url?.trim());
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Gallery</h2>
      {s.mode === "external" && s.externalUrl ? (
        <a href={s.externalUrl} className="text-sm font-semibold underline text-[color:var(--mts-primary-bright)]">View album</a>
      ) : images.length === 0 ? (
        <p className="text-sm text-[color:var(--mts-muted)]">Photos from trainings & events.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((img, i) => (
            <img key={i} src={img.url} alt="" className="aspect-square rounded-xl object-cover" />
          ))}
        </div>
      )}
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

export function BlockQuickLinks({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<{ whatsapp: string; telegram: string; phone: string; customLabel: string; customUrl: string }>(block);
  const links = [
    s.whatsapp?.trim() ? { label: "WhatsApp", href: s.whatsapp } : null,
    s.telegram?.trim() ? { label: "Telegram", href: s.telegram } : null,
    s.phone?.trim() ? { label: "Call coach", href: `tel:${s.phone}` } : null,
    s.customUrl?.trim() ? { label: s.customLabel || "Link", href: s.customUrl } : null,
  ].filter(Boolean) as { label: string; href: string }[];
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Quick links</h2>
      {links.length === 0 ? (
        <p className="text-sm text-[color:var(--mts-muted)]">Add links in the builder.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-2xl border border-[color:var(--mts-card-border)] font-medium transition hover:bg-[var(--mts-accent-soft)]">{l.label}</a>
          ))}
        </div>
      )}
    </MtsCard>
  );
}
