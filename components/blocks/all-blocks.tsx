import { BlockEmpty } from "@/components/blocks/block-empty";
import { MtsBadge, MtsCard } from "@/components/mts/card";
import {
  getBlockSettings,
  type ContentItem,
  type CountdownSettings,
  type ListBlockSettings,
  type PollSettings,
  type SocialKey,
  type WeatherSettings,
} from "@/lib/blocks/settings";
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


export function BlockCalendar({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<{ externalUrl: string }>(block);
  const url = s.externalUrl?.trim();
  return (
    <MtsCard className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[color:var(--mts-text)]">Calendar</h2>
        {url ? <MtsBadge>Linked</MtsBadge> : null}
      </div>
      {url ? (
        <a href={url} className="text-sm font-semibold text-[color:var(--mts-primary-bright)] underline">
          Open team calendar
        </a>
      ) : (
        <BlockEmpty message="Calendar link coming soon." />
      )}
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
        <BlockEmpty message="Weekly schedule will be posted here soon." />
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


export function BlockResults({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const items = (s.items ?? []).filter((row) => row.name?.trim());
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Results & highlights</h2>
      {items.length === 0 ? (
        <BlockEmpty message="Results and highlights will appear here." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((x) => (
            <div key={x.id} className="rounded-2xl border border-[color:var(--mts-card-border)] p-4 text-center">
              {x.emoji ? <div className="text-2xl">{x.emoji}</div> : null}
              <div className="font-semibold">{x.name}</div>
              {x.subtitle ? <div className="text-xs text-[color:var(--mts-muted)]">{x.subtitle}</div> : null}
            </div>
          ))}
        </div>
      )}
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
        <BlockEmpty message="Team achievements will be celebrated here." />
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

export function BlockTeamFeed({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const posts = (s.items ?? []).filter((row) => row.title?.trim());
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Team feed</h2>
      {posts.length === 0 ? (
        <BlockEmpty message="News and photos from the team will show up here." />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-2xl bg-[var(--mts-accent-soft)] p-4">
              <p className="text-sm font-medium">{post.title}</p>
              {post.body ? <p className="mt-1 text-xs text-[color:var(--mts-muted)]">{post.body}</p> : null}
            </div>
          ))}
        </div>
      )}
    </MtsCard>
  );
}

export function BlockAttendance({ team, block }: { team: TeamSpace; block: BlockInstance }) {
  const att = team.blocks.find((b) => b.type === "attendance") ?? block;
  const roster = getBlockSettings<{ roster: { name: string }[] }>(att).roster ?? [];
  const names = roster.filter((p) => p.name?.trim());
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Attendance</h2>
      {names.length === 0 ? (
        <BlockEmpty message="Attendance tracking starts once the coach adds a roster." />
      ) : (
        <p className="text-sm text-[color:var(--mts-muted)]">Tracking for {names.length} athletes — full stats coming soon.</p>
      )}
    </MtsCard>
  );
}

export function BlockCampTrip({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const items = (s.items ?? []).filter((row) => row.title?.trim());
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-2 text-lg font-bold">Camp & trip</h2>
      {items.length === 0 ? (
        <BlockEmpty message="Trip details will be shared here before travel." />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((row) => (
            <div key={row.id} className="rounded-xl border border-[color:var(--mts-card-border)] p-3 text-sm">
              <p className="font-semibold">{row.title}</p>
              {row.body ? <p className="mt-1 text-[color:var(--mts-muted)]">{row.body}</p> : null}
            </div>
          ))}
        </div>
      )}
    </MtsCard>
  );
}

export function BlockContacts({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const items = (s.items ?? []).filter((row) => row.name?.trim());
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Contacts</h2>
      {items.length === 0 ? (
        <BlockEmpty message="Coach contacts will be listed here." />
      ) : (
        <ul className="space-y-3 text-sm">
          {items.map((c) => (
            <li key={c.id} className="flex justify-between gap-3">
              <span>
                {c.name}
                {c.role ? <span className="block text-xs text-[color:var(--mts-muted)]">{c.role}</span> : null}
              </span>
              {c.url?.trim() ? (
                <a className="font-semibold text-[color:var(--mts-primary-bright)]" href={c.url}>
                  Contact
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </MtsCard>
  );
}

export function BlockDocuments({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const docs = (s.items ?? []).filter((row) => row.title?.trim());
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Documents</h2>
      {docs.length === 0 ? (
        <BlockEmpty message="Team documents and PDFs will appear here." />
      ) : (
        <div className="flex flex-col gap-2">
          {docs.map((d) => (
            <a
              key={d.id}
              href={d.url?.trim() || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-between rounded-xl border border-[color:var(--mts-card-border)] px-4 text-sm font-medium transition hover:bg-[var(--mts-accent-soft)]"
            >
              {d.title}
              <span>↓</span>
            </a>
          ))}
        </div>
      )}
    </MtsCard>
  );
}

export function BlockPolls({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<PollSettings>(block);
  const q = s.question?.trim();
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Quick poll</h2>
      {!q ? (
        <BlockEmpty message="Quick polls for parents coming soon." />
      ) : (
        <>
          <p className="mb-3 text-sm text-[color:var(--mts-muted)]">{q}</p>
          <div className="flex gap-2">
            <button type="button" className="min-h-11 flex-1 rounded-2xl bg-[var(--mts-primary)] font-semibold text-white">
              {s.optionYes || "Yes"}
            </button>
            <button type="button" className="min-h-11 flex-1 rounded-2xl border-2 font-semibold">
              {s.optionNo || "No"}
            </button>
          </div>
        </>
      )}
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
        <BlockEmpty message="Photos from trainings and events will appear here." />
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

export function BlockSponsors({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const sponsors = (s.items ?? []).filter((row) => row.name?.trim());
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[color:var(--mts-muted)]">
        Partners & sponsors
      </h2>
      {sponsors.length === 0 ? (
        <BlockEmpty message="Partner logos will appear here." />
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {sponsors.map((sp) =>
            sp.url?.trim() ? (
              <a key={sp.id} href={sp.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold underline">
                {sp.name}
              </a>
            ) : (
              <span key={sp.id} className="text-sm font-semibold">
                {sp.name}
              </span>
            ),
          )}
        </div>
      )}
    </MtsCard>
  );
}

function countdownParts(targetIso: string) {
  const target = new Date(targetIso);
  if (Number.isNaN(target.getTime())) return null;
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor((diff % 86400000) / 3600000);
  const min = Math.floor((diff % 3600000) / 60000);
  return { days, hrs, min };
}

export function BlockWeather({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<WeatherSettings>(block);
  const hasData = Boolean(s.temp?.trim() || s.note?.trim() || s.location?.trim());
  return (
    <MtsCard className="p-5 sm:p-6">
      {hasData ? (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Outdoor / hall</h2>
            {s.location?.trim() ? (
              <p className="text-sm text-[color:var(--mts-muted)]">{s.location}</p>
            ) : null}
          </div>
          <div className="text-right">
            {s.temp?.trim() ? <div className="text-3xl font-bold">{s.temp}</div> : null}
            {s.note?.trim() ? <div className="text-xs text-[color:var(--mts-muted)]">{s.note}</div> : null}
          </div>
        </div>
      ) : (
        <BlockEmpty message="Weather and venue notes will show here." />
      )}
    </MtsCard>
  );
}

export function BlockCountdown({ block }: { team: TeamSpace; block: BlockInstance }) {
  const s = getBlockSettings<CountdownSettings>(block);
  const parts = s.targetDate?.trim() ? countdownParts(s.targetDate) : null;
  return (
    <MtsCard className="p-5 sm:p-6 text-center">
      <p className="text-sm font-medium text-[color:var(--mts-muted)]">{s.label?.trim() || "Countdown"}</p>
      {parts ? (
        <>
          <p className="mt-2 text-3xl font-black tabular-nums text-[color:var(--mts-primary-bright)]">
            {parts.days} : {String(parts.hrs).padStart(2, "0")} : {String(parts.min).padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-[color:var(--mts-muted)]">days · hrs · min</p>
        </>
      ) : (
        <BlockEmpty message="Set a target date in the page builder." />
      )}
    </MtsCard>
  );
}

function rosterFromTeam(team: TeamSpace) {
  const att = team.blocks.find((b) => b.type === "attendance");
  if (!att) return [];
  return getBlockSettings<{ roster: { id: string; name: string; birthday?: string }[] }>(att).roster ?? [];
}

export function BlockBirthdays({ team }: { team: TeamSpace; block: BlockInstance }) {
  const upcoming = rosterFromTeam(team).filter((p) => p.name?.trim() && p.birthday?.trim());
  return (
    <MtsCard className="p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-bold">Birthdays</h2>
      {upcoming.length === 0 ? (
        <BlockEmpty message="Add birthdays in the roster editor." />
      ) : (
        <ul className="space-y-2 text-sm">
          {upcoming.map((p) => (
            <li key={p.id} className="flex justify-between rounded-xl bg-[var(--mts-accent-soft)] px-3 py-2">
              <span>{p.name}</span>
              <span className="text-[color:var(--mts-muted)]">{p.birthday}</span>
            </li>
          ))}
        </ul>
      )}
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
        <BlockEmpty message="Add WhatsApp, Telegram, or phone links in the builder." />
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
