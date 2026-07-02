import type { HeroLayoutVariant } from "@/lib/blocks/hero-layout";
import { getTheme } from "@/lib/themes";
import type { BlockInstance, BlockLayout, TeamPageSettings, TeamSpace, ThemeId } from "@/lib/types";

function themeColors(themeId: ThemeId) {
  const vars = getTheme(themeId).cssVars as Record<string, string>;
  return {
    primary: vars["--mts-primary"] ?? "#0c4a6e",
    secondary: vars["--mts-accent"] ?? "#ff6b2d",
  };
}

function blk(
  id: string,
  type: BlockInstance["type"],
  order: number,
  settings: Record<string, unknown>,
  layout: BlockLayout = "half",
  enabled = true,
): BlockInstance {
  return { id, type, enabled, order, layout, settings };
}

export function hero(
  layout: HeroLayoutVariant,
  city: string,
  cover: string,
  extra: Record<string, unknown> = {},
): BlockInstance {
  return blk(
    "blk_hero",
    "hero",
    1,
    {
      heroLayout: layout,
      city,
      coverImageUrl: cover,
      quote: "",
      description: "",
      social: {},
      ...extra,
    },
    "full",
  );
}

export function ann(message: string, tone: "info" | "urgent" | "confirm" = "info") {
  return blk("blk_ann", "announcement_bar", 0, { message, tone, pinned: true }, "full");
}

const DAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function schedule(
  events: {
    title: string;
    day: string;
    time: string;
    place?: string;
    type?: "training" | "competition" | "camp" | "meeting";
  }[],
  layout: BlockLayout = "half",
) {
  return blk(
    "blk_sched",
    "schedule",
    10,
    {
      mode: "manual",
      events: events.map((e, i) => ({
        id: `ev_${i}`,
        title: e.title,
        eventType: e.type ?? "training",
        dayOfWeek: DAY_INDEX[e.day] ?? 2,
        time: e.time,
        location: e.place ?? "",
        repeat: "weekly",
        ends: "never",
      })),
    },
    layout,
  );
}

export function gallery(urls: readonly string[], captions?: readonly string[], layout: BlockLayout = "featured") {
  return blk(
    "blk_gal",
    "gallery",
    12,
    {
      mode: "manual",
      images: urls.map((url, i) => ({
        id: `img_${i}`,
        url,
        caption: captions?.[i] ?? "",
      })),
    },
    layout,
  );
}

export function contacts(rows: { name: string; role: string; url?: string }[], layout: BlockLayout = "half") {
  return blk(
    "blk_contacts",
    "contacts",
    13,
    {
      items: rows.map((r, i) => ({
        id: `c_${i}`,
        name: r.name,
        role: r.role,
        url: r.url ?? "",
        photoUrl: "",
      })),
    },
    layout,
  );
}

export function poll(question: string, yes = "I'm in", no = "Can't make it", layout: BlockLayout = "half") {
  return blk("blk_poll", "polls", 11, { question, optionYes: yes, optionNo: no }, layout);
}

export function feed(posts: { title: string; body: string }[]) {
  return blk(
    "blk_feed",
    "team_feed",
    20,
    {
      items: posts.map((p, i) => ({
        id: `post_${i}`,
        title: p.title,
        body: p.body,
      })),
    },
    "half",
  );
}

export function achievements(
  cards: { title: string; player: string; icon: string; description?: string }[],
  layout: BlockLayout = "featured",
) {
  return blk(
    "blk_ach",
    "achievements",
    14,
    {
      cards: cards.map((c, i) => ({
        id: `ach_${i}`,
        icon: c.icon,
        title: c.title,
        player: c.player,
        description: c.description ?? "",
      })),
    },
    layout,
  );
}

export function resultsSimple(
  rows: { athlete: string; comp: string; place: number; date: string }[],
  season = "2026 Season",
  layout: BlockLayout = "featured",
) {
  return blk(
    "blk_results",
    "results",
    11,
    {
      enabled: true,
      mode: "simple",
      blockTitle: "Competition results",
      seasonName: season,
      simpleResults: rows.map((r, i) => ({
        id: `sr_${i}`,
        competitionName: r.comp,
        date: r.date,
        athleteName: r.athlete,
        place: r.place,
        medal: r.place === 1 ? "🥇" : r.place === 2 ? "🥈" : r.place === 3 ? "🥉" : "🏅",
      })),
      competitions: [],
      categories: [],
    },
    layout,
  );
}

export function integrations(links: { url: string; label?: string }[], layout: BlockLayout = "half") {
  return blk(
    "blk_int",
    "integrations",
    14,
    {
      sectionTitle: "Training & media",
      links: links.map((l, i) => ({
        id: `int_${i}`,
        url: l.url,
        label: l.label ?? "",
        variant: i === 0 ? "featured" : "tile",
      })),
    },
    layout,
  );
}

export function payments(title: string, desc: string, url: string, layout: BlockLayout = "full") {
  return blk(
    "blk_pay",
    "payments",
    16,
    {
      title,
      description: desc,
      buttonLabel: "Pay online",
      paymentUrl: url,
    },
    layout,
  );
}

export function countdown(label: string, targetDate: string, layout: BlockLayout = "full") {
  return blk("blk_cd", "countdown", 15, { label, targetDate }, layout);
}

export function shop(
  products: { name: string; price: string; imageUrl?: string }[],
  layout: BlockLayout = "half",
) {
  return blk(
    "blk_shop",
    "team_shop",
    15,
    {
      sectionTitle: "Team shop",
      subtitle: "Order kit & merch",
      products: products.map((p, i) => ({
        id: `prod_${i}`,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl ?? "",
        buttonLabel: "Order",
        productUrl: "https://pay.example.com/shop",
      })),
    },
    layout,
  );
}

export function trip(items: { title: string; body: string }[], layout: BlockLayout = "half") {
  return blk(
    "blk_trip",
    "camp_trip",
    12,
    {
      items: items.map((item, i) => ({
        id: `trip_${i}`,
        title: item.title,
        body: item.body,
      })),
    },
    layout,
  );
}

export function attendance(roster: { name: string; role?: string }[], layout: BlockLayout = "half") {
  return blk(
    "blk_att",
    "attendance",
    12,
    {
      enabledFeatures: { streaks: true, history: true },
      roster: roster.map((p, i) => ({
        id: `p_${i}`,
        name: p.name,
        role: p.role ?? "",
      })),
    },
    layout,
  );
}

export function weather(temp: string, note: string, location: string, layout: BlockLayout = "half") {
  return blk("blk_weather", "weather", 13, { temp, note, location }, layout);
}

export function sponsors(names: string[]) {
  return blk(
    "blk_spon",
    "sponsors",
    36,
    {
      items: names.map((name, i) => ({
        id: `sp_${i}`,
        name,
        subtitle: "Partner",
        url: "",
        emoji: "🤝",
      })),
    },
    "half",
  );
}

export function makeTeam(
  id: string,
  slug: string,
  name: string,
  themeId: ThemeId,
  tagline: string,
  logoUrl: string,
  blocks: BlockInstance[],
  pageSettings: TeamPageSettings = {},
): TeamSpace {
  const colors = themeColors(themeId);
  const patchedBlocks = blocks.map((block) => {
    if (block.type !== "hero") return block;
    return {
      ...block,
      settings: {
        ...(block.settings as Record<string, unknown>),
        teamPhotoUrl: logoUrl,
      },
    };
  });
  return {
    id,
    slug,
    name,
    tagline,
    logoUrl,
    themeId,
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    plan: "pro",
    publishStatus: "published",
    pageVisibility: "public",
    blocks: patchedBlocks,
    pageSettings: {
      coachWhatsapp: "+37120000000",
      ...pageSettings,
    },
    updatedAt: new Date().toISOString(),
  };
}
