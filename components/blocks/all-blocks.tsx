import { BlockEmpty } from "@/components/blocks/block-empty";
import { BlockHeading, BlockSurface } from "@/components/blocks/block-surface";
import { CampTripConfirm } from "@/components/blocks/camp-trip-confirm";
import { PollVote } from "@/components/blocks/poll-vote";
import { ResultsBoardView } from "@/components/results/results-board-view";
import { galleryEmbedSrc, isGooglePhotosAlbumUrl } from "@/lib/gallery-embed";
import { MtsBadge } from "@/components/mts/card";
import { IntegrationsHub } from "@/components/integrations/integrations-hub";
import { ResourcesHub } from "@/components/integrations/resource-card";
import { SmartIntegrationCard } from "@/components/integrations/smart-integration-card";
import { enrichIntegrationLink } from "@/lib/integrations/build-preview";
import { cn } from "@/lib/utils/cn";
import type { IntegrationLink } from "@/lib/integrations/types";
import {
  getBlockSettings,
  type ContentItem,
  type CountdownSettings,
  type ListBlockSettings,
  type PaymentLinkSettings,
  type PollSettings,
  type QuickActionsSettings,
  type TeamShopSettings,
  type ResourceItem,
  type SocialKey,
  type WeatherSettings,
} from "@/lib/blocks/settings";
import { PaymentLinkCard } from "@/components/blocks/payment-link-card";
import { QuickActionsGrid, validQuickActions } from "@/components/blocks/quick-actions-grid";
import { TeamShopGrid, validTeamShopProducts } from "@/components/blocks/team-shop-grid";
import { TeamHeroCard } from "@/components/blocks/team-hero-card";
import { MtsGalleryPhoto } from "@/components/mts/media/mts-media";
import {
  SocialLinkButtons,
  heroSocialLinks,
  type SocialLinkItem,
} from "@/components/social/social-link-buttons";
import { normalizeSocialUrl } from "@/lib/social/links";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { motion } from "framer-motion";

type HeroSettings = {
  quote: string;
  description?: string;
  city: string;
  coverImageUrl: string;
  teamPhotoUrl?: string;
  social: Partial<Record<SocialKey, string>>;
};

type BlockProps = { team: TeamSpace; block: BlockInstance; embedded?: boolean };

export function BlockHero({ team, block, embedded }: BlockProps) {
  if (embedded) return null;
  const s = getBlockSettings<HeroSettings>(block);
  const logoSrc = team.logoUrl?.trim() || s.teamPhotoUrl?.trim();
  const motto = s.quote?.trim();
  const description = s.description?.trim();
  const socialLinks = heroSocialLinks(s.social ?? {});

  return (
    <TeamHeroCard
      teamName={team.name}
      logoSrc={logoSrc}
      tagline={team.tagline}
      city={s.city}
      coverSrc={s.coverImageUrl}
      description={description}
      motto={motto}
      socialLinks={socialLinks}
    />
  );
}

export function BlockAnnouncementBar({ team: _team, block, embedded }: BlockProps) {
  const s = getBlockSettings<{ message: string; urgent?: boolean; tone?: "info" | "urgent" | "confirm" }>(block);
  const tone = s.tone ?? (s.urgent ? "urgent" : "info");
  const text = s.message?.trim() || "Welcome to our team page!";
  if (embedded) return null;
  const shell =
    tone === "urgent"
      ? "border-rose-200/90 bg-gradient-to-r from-rose-50 to-orange-50 text-rose-950"
      : tone === "confirm"
        ? "border-emerald-200/90 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-950"
        : "border-indigo-200/80 bg-gradient-to-r from-indigo-600 to-violet-600 text-white";
  return (
    <div className={`rounded-[1.25rem] border px-4 py-3.5 shadow-sm ${shell}`}>
      <p className={`text-center text-[13px] leading-snug ${tone === "urgent" ? "font-bold" : "font-semibold"}`}>
        <span className="mr-1.5" aria-hidden>
          {tone === "urgent" ? "⚠️" : "📣"}
        </span>
        {text}
        {tone === "confirm" ? (
          <span className={`mt-1 block text-xs ${tone === "confirm" ? "opacity-80" : ""}`}>
            Please confirm with your coach
          </span>
        ) : null}
      </p>
    </div>
  );
}


export function BlockCalendar({ block, embedded }: BlockProps) {
  const s = getBlockSettings<{ externalUrl: string }>(block);
  const url = s.externalUrl?.trim();
  return (
    <BlockSurface embedded={embedded}>
      <div className="mb-4 flex items-center justify-between">
        <BlockHeading embedded={embedded} className="mb-0">
          Calendar
        </BlockHeading>
        {url ? <MtsBadge>Linked</MtsBadge> : null}
      </div>
      {url ? (
        <a href={url} className="text-sm font-semibold text-[color:var(--mts-primary-bright)] underline">
          Open team calendar
        </a>
      ) : (
        <BlockEmpty message="Calendar link coming soon." />
      )}
    </BlockSurface>
  );
}

export function BlockSchedule({ team, block, embedded }: BlockProps) {
  const s = getBlockSettings<{ mode: string; events: { title: string; dayOfWeek: number; time: string; location: string; eventType: string }[]; externalUrl: string }>(block);
  const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const events = s.events ?? [];
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>Weekly schedule</BlockHeading>
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
    </BlockSurface>
  );
}


export function BlockResults({ team, block, embedded }: BlockProps) {
  return (
    <BlockSurface embedded={embedded}>
      <ResultsBoardView block={block} team={team} />
    </BlockSurface>
  );
}

export function BlockAchievements({ team, block, embedded }: BlockProps) {
  const s = getBlockSettings<{ cards: { id: string; icon: string; title: string; player: string; description: string }[] }>(block);
  const cards = s.cards ?? [];
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>Trophies & highlights</BlockHeading>
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
    </BlockSurface>
  );
}

export function BlockTeamFeed({ block, embedded }: BlockProps) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const posts = (s.items ?? []).filter((row) => row.title?.trim());
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>Team feed</BlockHeading>
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
    </BlockSurface>
  );
}

export function BlockAttendance({ team, block, embedded }: BlockProps) {
  const att = team.blocks.find((b) => b.type === "attendance") ?? block;
  const roster = getBlockSettings<{ roster: { name: string }[] }>(att).roster ?? [];
  const names = roster.filter((p) => p.name?.trim());
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>Attendance</BlockHeading>
      {names.length === 0 ? (
        <BlockEmpty message="Attendance tracking starts once the coach adds a roster." />
      ) : (
        <p className="text-sm text-[color:var(--mts-muted)]">Tracking for {names.length} athletes — full stats coming soon.</p>
      )}
    </BlockSurface>
  );
}

export function BlockCampTrip({ block, embedded }: BlockProps) {
  const s = getBlockSettings<ListBlockSettings & { confirmationsEnabled?: boolean }>(block);
  const items = (s.items ?? []).filter((row) => row.title?.trim());
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded} className="mb-2">
        Camp & logistics
      </BlockHeading>
      {items.length === 0 ? (
        <BlockEmpty message="Trip details will be shared here before travel." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((row) => (
            <div key={row.id} className="rounded-xl border border-[color:var(--mts-card-border)] p-3 text-sm">
              <p className="font-semibold">{row.title}</p>
              {row.body ? <p className="mt-1 text-[color:var(--mts-muted)]">{row.body}</p> : null}
              {s.confirmationsEnabled !== false ? (
                <CampTripConfirm eventId={row.id} title={row.title ?? ""} />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </BlockSurface>
  );
}

export function BlockContacts({ block, embedded }: BlockProps) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const items = (s.items ?? []).filter((row) => row.name?.trim());
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>Contacts</BlockHeading>
      {items.length === 0 ? (
        <BlockEmpty message="Coach contacts will be listed here." />
      ) : (
        <ul className="space-y-3 text-sm">
          {items.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3">
                {c.photoUrl?.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.photoUrl} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm" />
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--mts-accent-soft)] text-lg">
                    👤
                  </span>
                )}
                <span className="min-w-0">
                  {c.name}
                  {c.role ? <span className="block text-xs text-[color:var(--mts-muted)]">{c.role}</span> : null}
                </span>
              </span>
              {c.url?.trim() ? (
                <a className="shrink-0 font-semibold text-[color:var(--mts-primary-bright)]" href={c.url}>
                  Contact
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </BlockSurface>
  );
}

export function BlockDocuments({ block, embedded }: BlockProps) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const docs = (s.items ?? []).filter((row) => row.title?.trim());
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>Documents</BlockHeading>
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
    </BlockSurface>
  );
}

export function BlockPolls({ team, block, embedded }: BlockProps) {
  const s = getBlockSettings<PollSettings>(block);
  const q = s.question?.trim();
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>Quick poll</BlockHeading>
      {!q ? (
        <BlockEmpty message="Add a poll question in the page builder." />
      ) : (
        <PollVote teamSlug={team.slug} blockId={block.id} settings={s} />
      )}
    </BlockSurface>
  );
}

export function BlockGallery({ block, embedded }: BlockProps) {
  const s = getBlockSettings<{ mode: string; images: { url: string }[]; externalUrl: string }>(block);
  const images = (s.images ?? []).filter((i) => i.url?.trim());
  const external = s.externalUrl?.trim() ?? "";
  const embed = galleryEmbedSrc(external);
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>Gallery</BlockHeading>
      {s.mode === "external" && external ? (
        embed ? (
          <iframe
            title="Team photo album"
            src={embed}
            className="h-72 w-full rounded-2xl border border-[color:var(--mts-card-border)] bg-white"
          />
        ) : isGooglePhotosAlbumUrl(external) ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-[var(--mts-accent-soft)]" />
              ))}
            </div>
            <a href={external} className="text-sm font-semibold underline text-[color:var(--mts-primary-bright)]">
              Open Google Photos album
            </a>
          </div>
        ) : (
          <a href={external} className="text-sm font-semibold underline text-[color:var(--mts-primary-bright)]">
            View album
          </a>
        )
      ) : images.length === 0 ? (
        <BlockEmpty message="Photos from trainings and events will appear here." />
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((img, i) => (
            <MtsGalleryPhoto key={i} src={img.url} alt="" />
          ))}
        </div>
      )}
    </BlockSurface>
  );
}

export function BlockSponsors({ block, embedded }: BlockProps) {
  const s = getBlockSettings<ListBlockSettings>(block);
  const sponsors = (s.items ?? []).filter((row) => row.name?.trim());
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded} className="text-center text-sm font-semibold uppercase tracking-widest text-[color:var(--mts-muted)]">
        Partners & sponsors
      </BlockHeading>
      {sponsors.length === 0 ? (
        <BlockEmpty message="Partner logos will appear here." />
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {sponsors.map((sp) => {
            const logo = sp.logoUrl?.trim();
            const inner = logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={sp.name} className="h-12 max-w-[120px] object-contain" />
            ) : (
              <span className="text-sm font-semibold">{sp.name}</span>
            );
            return sp.url?.trim() ? (
              <a key={sp.id} href={sp.url} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white/80 p-3 shadow-sm">
                {inner}
              </a>
            ) : (
              <span key={sp.id} className="rounded-xl bg-white/80 p-3 shadow-sm">
                {inner}
              </span>
            );
          })}
        </div>
      )}
    </BlockSurface>
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

export function BlockWeather({ block, embedded }: BlockProps) {
  const s = getBlockSettings<WeatherSettings>(block);
  const hasData = Boolean(s.temp?.trim() || s.note?.trim() || s.location?.trim());
  return (
    <BlockSurface embedded={embedded}>
      {hasData ? (
        <div className="flex items-center justify-between">
          <div>
            <BlockHeading embedded={embedded} className="mb-0">
              Outdoor / hall
            </BlockHeading>
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
    </BlockSurface>
  );
}

export function BlockCountdown({ block, embedded }: BlockProps) {
  const s = getBlockSettings<CountdownSettings>(block);
  const parts = s.targetDate?.trim() ? countdownParts(s.targetDate) : null;
  return (
    <BlockSurface embedded={embedded} className="text-center">
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
    </BlockSurface>
  );
}

function rosterFromTeam(team: TeamSpace) {
  const att = team.blocks.find((b) => b.type === "attendance");
  if (!att) return [];
  return getBlockSettings<{ roster: { id: string; name: string; birthday?: string }[] }>(att).roster ?? [];
}

export function BlockBirthdays({ team, block, embedded }: BlockProps) {
  const upcoming = rosterFromTeam(team).filter((p) => p.name?.trim() && p.birthday?.trim());
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>Birthdays</BlockHeading>
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
    </BlockSurface>
  );
}

export function BlockQuickLinks({ block, embedded }: BlockProps) {
  const s = getBlockSettings<{
    whatsapp: string;
    telegram: string;
    instagram: string;
    tiktok: string;
    website: string;
    phone: string;
    customLabel: string;
    customUrl: string;
  }>(block);
  const links = [
    s.whatsapp?.trim() ? { network: "whatsapp" as const, label: "WhatsApp", href: normalizeSocialUrl("whatsapp", s.whatsapp) } : null,
    s.telegram?.trim() ? { network: "telegram" as const, label: "Telegram", href: normalizeSocialUrl("telegram", s.telegram) } : null,
    s.instagram?.trim() ? { network: "instagram" as const, label: "Instagram", href: normalizeSocialUrl("instagram", s.instagram) } : null,
    s.tiktok?.trim() ? { network: "tiktok" as const, label: "TikTok", href: normalizeSocialUrl("tiktok", s.tiktok) } : null,
    s.website?.trim() ? { network: "website" as const, label: "Website", href: normalizeSocialUrl("website", s.website) } : null,
    s.phone?.trim() ? { network: "phone" as const, label: "Call coach", href: normalizeSocialUrl("phone", s.phone) } : null,
    s.customUrl?.trim()
      ? { network: "link" as const, label: s.customLabel || "Link", href: normalizeSocialUrl("website", s.customUrl) }
      : null,
  ].filter(Boolean) as SocialLinkItem[];
  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>Quick links</BlockHeading>
      {links.length === 0 ? (
        <BlockEmpty message="Add WhatsApp, Telegram, or phone links in the builder." />
      ) : (
        <SocialLinkButtons links={links} size="sm" />
      )}
    </BlockSurface>
  );
}

export function BlockIntegrations({ block, embedded }: BlockProps) {
  const s = getBlockSettings<{ sectionTitle?: string; links: IntegrationLink[] }>(block);
  const links = s.links ?? [];
  const title = s.sectionTitle?.trim() || "Smart integrations";
  const valid = links.filter((l) => l.url?.trim());

  return (
    <BlockSurface embedded={embedded}>
      {valid.length === 0 ? (
        <>
          <BlockHeading embedded={embedded}>{title}</BlockHeading>
          <BlockEmpty message="Connect Strava, Garmin, YouTube, calendars, and more." />
        </>
      ) : embedded ? (
        <>
          <BlockHeading embedded={embedded}>{title}</BlockHeading>
          <div className="space-y-2">
            {valid.map((link, i) => {
              const e = enrichIntegrationLink(link, i, valid.length);
              return (
                <SmartIntegrationCard
                  key={link.id}
                  url={e.url}
                  provider={e.provider}
                  title={e.label!}
                  description={e.description!}
                  cta={e.cta}
                  preview={e.preview}
                  variant="compact"
                />
              );
            })}
          </div>
        </>
      ) : (
        <IntegrationsHub links={links} sectionTitle={title} />
      )}
    </BlockSurface>
  );
}

export function BlockResources({ block, embedded }: BlockProps) {
  const s = getBlockSettings<{ sectionTitle?: string; items: ResourceItem[] }>(block);
  const items = (s.items ?? []).filter((r) => r.title?.trim() && (r.fileUrl || r.url)?.trim());
  const title = s.sectionTitle?.trim() || "Team resources";

  return (
    <BlockSurface embedded={embedded}>
      {items.length === 0 ? (
        <>
          <BlockHeading embedded={embedded}>{title}</BlockHeading>
          <BlockEmpty message="PDFs, travel plans, nutrition guides, and choreography references." />
        </>
      ) : (
        <ResourcesHub items={items} sectionTitle={title} compact={embedded} />
      )}
    </BlockSurface>
  );
}

export function BlockPayments({ block, embedded }: BlockProps) {
  const s = getBlockSettings<PaymentLinkSettings>(block);
  const hasContent = Boolean(s.title?.trim() || s.paymentUrl?.trim());

  if (embedded) {
    return (
      <BlockSurface embedded>
        <BlockHeading embedded>Payments</BlockHeading>
        {hasContent ? (
          <PaymentLinkCard
            title={s.title}
            description={s.description}
            buttonLabel={s.buttonLabel}
            paymentUrl={s.paymentUrl}
            variant="compact"
          />
        ) : (
          <BlockEmpty message="Add a payment title and link in the builder." />
        )}
      </BlockSurface>
    );
  }

  if (!hasContent) {
    return (
      <BlockSurface>
        <BlockHeading>Payments</BlockHeading>
        <BlockEmpty message="Add a payment title and link in the builder." />
      </BlockSurface>
    );
  }

  return (
    <PaymentLinkCard
      title={s.title}
      description={s.description}
      buttonLabel={s.buttonLabel}
      paymentUrl={s.paymentUrl}
      variant="featured"
    />
  );
}

export function BlockQuickActions({ block, embedded }: BlockProps) {
  const s = getBlockSettings<QuickActionsSettings>(block);
  const title = s.sectionTitle?.trim() || "Quick actions";
  const actions = s.actions ?? [];
  const valid = validQuickActions(actions);

  if (!embedded && valid.length === 0) {
    return null;
  }

  return (
    <BlockSurface embedded={embedded}>
      <BlockHeading embedded={embedded}>{title}</BlockHeading>
      {valid.length > 0 ? (
        <QuickActionsGrid actions={actions} compact={embedded} />
      ) : (
        <BlockEmpty message="Add link buttons — WhatsApp, registration, maps, and more." />
      )}
    </BlockSurface>
  );
}

export function BlockTeamShop({ block, embedded }: BlockProps) {
  const s = getBlockSettings<TeamShopSettings>(block);
  const title = s.sectionTitle?.trim() || "Team Shop";
  const subtitle = s.subtitle?.trim();
  const products = s.products ?? [];
  const valid = validTeamShopProducts(products);

  if (!embedded && valid.length === 0) {
    return null;
  }

  return (
    <BlockSurface embedded={embedded}>
      <div className="mb-4">
        <BlockHeading embedded={embedded}>{title}</BlockHeading>
        {subtitle ? <p className="mt-1 text-sm text-neutral-500">{subtitle}</p> : null}
      </div>
      {valid.length > 0 ? (
        <TeamShopGrid products={products} compact={embedded} />
      ) : (
        <BlockEmpty message="Add your first product — photo, price, and order link." />
      )}
    </BlockSurface>
  );
}
