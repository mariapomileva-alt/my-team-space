import type { HeroLayoutVariant } from "@/lib/blocks/hero-layout";
import { getTheme } from "@/lib/themes";
import { SHOWCASE_COVERS, SHOWCASE_LOGOS } from "@/lib/showcase/logo-svg";
import type { BlockInstance, BlockLayout, TeamSpace, ThemeId } from "@/lib/types";

export type ShowcaseTeamCard = {
  team: TeamSpace;
  sportRu: string;
  presetLabel: string;
  heroLayout: HeroLayoutVariant;
  heroLayoutLabel: string;
  builderSteps: string[];
};

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

function hero(
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

function ann(message: string, tone: "info" | "urgent" | "confirm" = "info") {
  return blk("blk_ann", "announcement_bar", 0, { message, tone, pinned: true }, "full");
}

function schedule(events: { title: string; when: string; place?: string }[]) {
  return blk("blk_sched", "schedule", 10, {
    mode: "manual",
    events: events.map((e, i) => ({
      id: `ev_${i}`,
      title: e.title,
      when: e.when,
      place: e.place ?? "",
    })),
  });
}

function gallery(urls: string[]) {
  return blk(
    "blk_gal",
    "gallery",
    12,
    {
      mode: "manual",
      images: urls.map((url, i) => ({ id: `img_${i}`, url, caption: "" })),
    },
    "featured",
  );
}

function contacts(rows: { name: string; role: string; url?: string }[]) {
  return blk("blk_contacts", "contacts", 14, {
    items: rows.map((r, i) => ({
      id: `c_${i}`,
      name: r.name,
      role: r.role,
      url: r.url ?? "",
      photoUrl: "",
    })),
  });
}

function quickLinks(links: Partial<Record<string, string>>) {
  return blk("blk_links", "quick_links", 16, links, "half");
}

function poll(question: string, yes = "I'm in", no = "Can't make it") {
  return blk("blk_poll", "polls", 18, { question, optionYes: yes, optionNo: no });
}

function feed(posts: { title: string; body: string }[]) {
  return blk("blk_feed", "team_feed", 20, {
    items: posts.map((p, i) => ({
      id: `post_${i}`,
      title: p.title,
      subtitle: p.body,
      emoji: "📣",
    })),
  });
}

function achievements(cards: { title: string; body: string; emoji: string }[]) {
  return blk(
    "blk_ach",
    "achievements",
    22,
    {
      cards: cards.map((c, i) => ({ id: `ach_${i}`, ...c })),
    },
    "featured",
  );
}

function resultsSimple(rows: { athlete: string; comp: string; place: number; date: string }[]) {
  return blk(
    "blk_results",
    "results",
    24,
    {
      enabled: true,
      mode: "simple",
      blockTitle: "Competition results",
      seasonName: "2026 Season",
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
    "featured",
  );
}

function integrations(links: { url: string; label?: string }[]) {
  return blk(
    "blk_int",
    "integrations",
    26,
    {
      sectionTitle: "Training & media",
      links: links.map((l, i) => ({
        id: `int_${i}`,
        url: l.url,
        label: l.label ?? "",
        variant: i === 0 ? "featured" : "tile",
      })),
    },
    "full",
  );
}

function payments(title: string, desc: string, url: string) {
  return blk(
    "blk_pay",
    "payments",
    28,
    {
      title,
      description: desc,
      buttonLabel: "Pay online",
      paymentUrl: url,
    },
    "card",
  );
}

function countdown(label: string, targetDate: string) {
  return blk("blk_cd", "countdown", 30, { label, targetDate }, "half");
}

function shop(products: { name: string; price: string }[]) {
  return blk("blk_shop", "team_shop", 32, {
    sectionTitle: "Team shop",
    subtitle: "Order kit & merch",
    products: products.map((p, i) => ({
      id: `prod_${i}`,
      name: p.name,
      price: p.price,
      imageUrl: "",
      buttonLabel: "Order",
      productUrl: "https://example.com/shop",
    })),
  }, "half");
}

function weather(temp: string, note: string, location: string) {
  return blk("blk_weather", "weather", 34, { temp, note, location }, "half");
}

function sponsors(names: string[]) {
  return blk("blk_spon", "sponsors", 36, {
    items: names.map((name, i) => ({
      id: `sp_${i}`,
      name,
      subtitle: "Partner",
      url: "",
      emoji: "🤝",
    })),
  }, "half");
}

function makeTeam(
  id: string,
  slug: string,
  name: string,
  themeId: ThemeId,
  tagline: string,
  logoUrl: string,
  blocks: BlockInstance[],
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
    pageSettings: { coachWhatsapp: "+37120000000" },
    updatedAt: new Date().toISOString(),
  };
}

const GALLERY_DANCE = [
  "https://images.unsplash.com/photo-1518834107812-67b0bb7c2d2e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1547159414-26d2a83f8a42?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&h=400&fit=crop",
];

export const SHOWCASE_TEAMS: ShowcaseTeamCard[] = [
  {
    sportRu: "Танцевальная секция",
    presetLabel: "Pastel youth",
    heroLayout: "center",
    heroLayoutLabel: "Center — logo on cover edge",
    builderSteps: [
      "Header → Logo + Center layout",
      "Design → Pastel youth",
      "Gallery + Polls + Countdown",
    ],
    team: makeTeam(
      "demo_dance",
      "rhythm-motion",
      "Rhythm & Motion",
      "pastel_youth",
      "Hip-hop · Contemporary · Kids 7–14",
      SHOWCASE_LOGOS.dance,
      [
        ann("💃 Spring recital — Friday 18:30. Purple costumes.", "info"),
        hero("center", "Riga, Latvia", SHOWCASE_COVERS.dance, {
          quote: "Move with joy",
          description: "Every child finds their rhythm here.",
          social: { instagram: "rhythmmotion", whatsapp: "+37129111111" },
        }),
        schedule([
          { title: "Hip-hop juniors", when: "Tue 16:30", place: "Studio A" },
          { title: "Recital run-through", when: "Fri 18:30", place: "Main hall" },
        ]),
        gallery(GALLERY_DANCE),
        poll("Who is coming to the recital?"),
        contacts([
          { name: "Coach Anna", role: "Artistic director", url: "tel:+37129111111" },
        ]),
        quickLinks({ whatsapp: "+37129111111", instagram: "rhythmmotion" }),
        feed([{ title: "Costume fitting done!", body: "Thanks for staying late Tuesday." }]),
        achievements([{ title: "National showcase", body: "Gold group 2025", emoji: "🌟" }]),
        countdown("Recital night", "2026-06-28T18:30:00"),
        payments("March fee", "€45 / month", "https://pay.example.com/dance"),
      ],
    ),
  },
  {
    sportRu: "Баскетбольный кружок",
    presetLabel: "Energetic orange",
    heroLayout: "inline",
    heroLayoutLabel: "Inline — name beside logo",
    builderSteps: ["Header → Logo + Inline", "Design → Energetic orange", "Results + Shop"],
    team: makeTeam(
      "demo_hoops",
      "thunder-hoops",
      "Thunder Hoops U14",
      "energetic_orange",
      "Boys U14 · City league",
      SHOWCASE_LOGOS.basketball,
      [
        ann("🏀 Playoff Saturday 10:00 — white kit.", "urgent"),
        hero("inline", "Barcelona, Spain", SHOWCASE_COVERS.basketball, {
          social: { instagram: "thunderhoopsbc", whatsapp: "+34600000001" },
        }),
        schedule([{ title: "Practice", when: "Mon/Wed 18:00", place: "Court A" }]),
        resultsSimple([{ athlete: "Lucas M.", comp: "City Cup", place: 1, date: "2026-03-15" }]),
        blk("blk_att", "attendance", 11, {
          enabledFeatures: { streaks: true, history: true },
          roster: [{ id: "p1", name: "Lucas M.", role: "#7" }],
        }),
        contacts([{ name: "Coach Miguel", role: "Head coach", url: "tel:+34600000001" }]),
        integrations([{ url: "https://www.hudl.com/", label: "Game film" }]),
        payments("March fee", "€55", "https://pay.example.com/hoops"),
        shop([{ name: "Thunder jersey", price: "€38" }]),
      ],
    ),
  },
  {
    sportRu: "Хоккейная команда",
    presetLabel: "Dark athletic",
    heroLayout: "overlay",
    heroLayoutLabel: "Overlay — text on photo",
    builderSteps: ["Header → Logo + Overlay", "Design → Dark athletic", "Trips + Gallery"],
    team: makeTeam(
      "demo_hockey",
      "nordic-ice",
      "Nordic Ice Wolves",
      "dark_athletic",
      "U12–U16 elite",
      SHOWCASE_LOGOS.hockey,
      [
        ann("❄️ Rink B closed Monday — session at 16:00.", "info"),
        hero("overlay", "Tampere, Finland", SHOWCASE_COVERS.hockey, {
          quote: "Skate hard. Stick together.",
          social: { instagram: "nordicicewolves" },
        }),
        schedule([{ title: "Ice practice", when: "Wed 16:00", place: "Rink B" }]),
        resultsSimple([{ athlete: "Elias V.", comp: "Regional Cup", place: 1, date: "2026-02-20" }]),
        blk("blk_trip", "camp_trip", 13, {
          items: [{ id: "trip1", title: "Tallinn tournament", subtitle: "Mar 14–16", emoji: "🚌" }],
        }),
        gallery(["https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop"]),
        weather("-4°C", "Light snow", "Tampere"),
        contacts([{ name: "Coach Jari", role: "Head coach", url: "tel:+35840123456" }]),
        payments("Season fee", "€420", "https://pay.example.com/hockey"),
      ],
    ),
  },
  {
    sportRu: "Плавательная команда",
    presetLabel: "Ocean aqua",
    heroLayout: "stack",
    heroLayoutLabel: "Stack — classic Facebook-style",
    builderSteps: ["Header → Logo + Stack", "Design → Ocean aqua", "Results + Poll"],
    team: makeTeam(
      "demo_swim",
      "aqua-wave",
      "Aqua Wave Swim Club",
      "ocean_aqua",
      "Competitive swimming · 8–16",
      SHOWCASE_LOGOS.swim,
      [
        ann("🏊 County meet Sunday — warm-up 08:00.", "confirm"),
        hero("stack", "Tallinn, Estonia", SHOWCASE_COVERS.swim, {
          social: { instagram: "aquawaveswim", whatsapp: "+3725123456" },
        }),
        schedule([{ title: "Morning squad", when: "Mon/Wed/Fri 06:30", place: "50 m pool" }]),
        resultsSimple([{ athlete: "Krista L.", comp: "100 m free", place: 1, date: "2026-04-02" }]),
        poll("Who can help at the meet?", "I can", "Not this time"),
        achievements([{ title: "Relay gold", body: "County champs", emoji: "🥇" }]),
        contacts([{ name: "Coach Liis", role: "Head coach", url: "tel:+3725123456" }]),
        integrations([{ url: "https://www.strava.com/clubs/", label: "Dryland" }]),
        payments("April fee", "€60", "https://pay.example.com/swim"),
      ],
    ),
  },
  {
    sportRu: "Балетная студия",
    presetLabel: "Minimal mono",
    heroLayout: "overlay",
    heroLayoutLabel: "Overlay — white text on photo",
    builderSteps: ["Header → Logo + Overlay + motto", "Design → Minimal mono", "Countdown + Resources"],
    team: makeTeam(
      "demo_ballet",
      "etoile-ballet",
      "Étoile Ballet Studio",
      "minimal_mono",
      "Classical · Pre-professional",
      SHOWCASE_LOGOS.ballet,
      [
        ann("🩰 Nutcracker audition — sign up by Wednesday.", "info"),
        hero("overlay", "Paris, France", SHOWCASE_COVERS.ballet, {
          quote: "Grace in every line",
          social: { instagram: "etoileballet", website: "etoileballet.fr" },
        }),
        gallery(["https://images.unsplash.com/photo-1508807526345-15e9b5f4b89b?w=400&h=400&fit=crop"]),
        schedule([{ title: "Technique III", when: "Mon/Wed 17:00", place: "Studio 1" }]),
        countdown("Summer gala", "2026-07-12T19:00:00"),
        achievements([{ title: "Paris prize", body: "Silver solo 2025", emoji: "🩰" }]),
        contacts([{ name: "Madame Claire", role: "Director", url: "mailto:claire@etoileballet.fr" }]),
        payments("Term fee", "€280", "https://pay.example.com/ballet"),
        sponsors(["Opéra Friends"]),
      ],
    ),
  },
  {
    sportRu: "Теннисная академия",
    presetLabel: "Premium forest",
    heroLayout: "inline",
    heroLayoutLabel: "Inline — sports club card",
    builderSteps: ["Header → Logo + Inline", "Design → Premium forest", "UTR integration + Shop"],
    team: makeTeam(
      "demo_tennis",
      "ace-tennis",
      "Ace Tennis Academy",
      "premium_forest",
      "Red clay · UTR juniors",
      SHOWCASE_LOGOS.tennis,
      [
        ann("🎾 Club tournament Sunday — register by Friday.", "confirm"),
        hero("inline", "Lisbon, Portugal", SHOWCASE_COVERS.tennis, {
          social: { instagram: "acetennisacademy", whatsapp: "+351912345678" },
        }),
        schedule([{ title: "Red squad", when: "Tue/Thu 16:00", place: "Courts 1–3" }]),
        resultsSimple([{ athlete: "Inês R.", comp: "Lisbon Open U14", place: 1, date: "2026-05-03" }]),
        integrations([
          { url: "https://www.utrsports.net/", label: "UTR ratings" },
          { url: "https://www.youtube.com/", label: "Highlights" },
        ]),
        poll("Court maintenance — can you help?"),
        contacts([{ name: "Coach Pedro", role: "Head pro", url: "tel:+351912345678" }]),
        shop([{ name: "Academy polo", price: "€42" }]),
        payments("Monthly pass", "€120", "https://pay.example.com/tennis"),
        sponsors(["Lisbon Sports Club"]),
      ],
    ),
  },
];
