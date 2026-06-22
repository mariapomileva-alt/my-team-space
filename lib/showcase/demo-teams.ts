import { HERO_VARIANT_META, type HeroLayoutVariant } from "@/lib/blocks/hero-layout";
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

const DAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function schedule(
  events: { title: string; day: string; time: string; place?: string; type?: "training" | "competition" | "camp" | "meeting" }[],
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

function gallery(urls: string[], captions?: string[], layout: BlockLayout = "featured") {
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

function contacts(rows: { name: string; role: string; url?: string }[], layout: BlockLayout = "half") {
  return blk("blk_contacts", "contacts", 13, {
    items: rows.map((r, i) => ({
      id: `c_${i}`,
      name: r.name,
      role: r.role,
      url: r.url ?? "",
      photoUrl: "",
    })),
  }, layout);
}

function quickLinks(links: Partial<Record<string, string>>, layout: BlockLayout = "half") {
  return blk("blk_links", "quick_links", 16, links, layout);
}

function poll(question: string, yes = "I'm in", no = "Can't make it", layout: BlockLayout = "half") {
  return blk("blk_poll", "polls", 11, { question, optionYes: yes, optionNo: no }, layout);
}

function feed(posts: { title: string; body: string }[]) {
  return blk("blk_feed", "team_feed", 20, {
    items: posts.map((p, i) => ({
      id: `post_${i}`,
      title: p.title,
      body: p.body,
    })),
  });
}

function achievements(
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

function resultsSimple(
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

function integrations(links: { url: string; label?: string }[], layout: BlockLayout = "half") {
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

function payments(title: string, desc: string, url: string, layout: BlockLayout = "full") {
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

function countdown(label: string, targetDate: string, layout: BlockLayout = "full") {
  return blk("blk_cd", "countdown", 15, { label, targetDate }, layout);
}

function shop(
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

function trip(items: { title: string; body: string }[], layout: BlockLayout = "half") {
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

function attendance(roster: { name: string; role?: string }[], layout: BlockLayout = "half") {
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

function weather(temp: string, note: string, location: string, layout: BlockLayout = "half") {
  return blk("blk_weather", "weather", 13, { temp, note, location }, layout);
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
  "https://images.unsplash.com/photo-1518834107812-67b0bb7c2d2e?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1547159414-26d2a83f8a42?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=480&h=480&fit=crop",
];

const GALLERY_HOOPS = [
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1519861531473-920026218ac7?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1574623452334-1e0ac2bddd96?w=480&h=480&fit=crop",
];

const GALLERY_HOCKEY = [
  "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1515705576963-95ad545555df?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1577225245490-5cca4573a14f?w=480&h=480&fit=crop",
];

const GALLERY_SWIM = [
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=480&h=480&fit=crop",
];

const GALLERY_BALLET = [
  "https://images.unsplash.com/photo-1508807526345-15e9b5f4b89b?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1518834107812-67b0bb7c2d2e?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=480&h=480&fit=crop",
];

const GALLERY_TENNIS = [
  "https://images.unsplash.com/photo-1622163649001-09445f787b59?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1595435934249-26df3d350cea?w=480&h=480&fit=crop",
  "https://images.unsplash.com/photo-1554068865-24cecd4e9b26?w=480&h=480&fit=crop",
];

export const SHOWCASE_TEAMS: ShowcaseTeamCard[] = [
  {
    sportRu: "Танцевальная секция",
    presetLabel: "Pastel youth",
    heroLayout: "circle_on_header",
    heroLayoutLabel: HERO_VARIANT_META.circle_on_header.label,
    builderSteps: [
      "Header → Circular logo on header",
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
        hero("circle_on_header", "Riga, Latvia", SHOWCASE_COVERS.dance, {
          social: { instagram: "rhythmmotion", whatsapp: "+37129111111" },
        }),
        schedule([
          { title: "Hip-hop juniors", day: "Tue", time: "16:30", place: "Studio A" },
          { title: "Contemporary teens", day: "Thu", time: "17:15", place: "Studio B" },
          { title: "Recital run-through", day: "Fri", time: "18:30", place: "Main hall", type: "competition" },
        ]),
        poll("Who is coming to the recital on June 28?", "We're in!", "Can't make it"),
        gallery(GALLERY_DANCE, ["Rehearsal week", "Group routine", "Solo practice", "Spring showcase"]),
        contacts([
          { name: "Coach Anna", role: "Artistic director", url: "tel:+37129111111" },
          { name: "Ms. Līga", role: "Studio manager", url: "mailto:liga@rhythmmotion.lv" },
        ]),
        achievements([
          { icon: "🌟", title: "National showcase", player: "Ensemble", description: "Gold · Riga 2025" },
          { icon: "💃", title: "Best choreography", player: "Sofia K.", description: "Solo · ages 10–12" },
          { icon: "🏆", title: "Spring festival", player: "Mini crew", description: "1st place group" },
        ]),
        countdown("Recital night", "2026-06-28T18:30:00"),
        payments("March fee", "€45 / month · includes studio time", "https://pay.example.com/dance"),
      ],
    ),
  },
  {
    sportRu: "Баскетбольный кружок",
    presetLabel: "Energetic orange",
    heroLayout: "inline",
    heroLayoutLabel: HERO_VARIANT_META.inline.label,
    builderSteps: ["Header → Logo left, text right", "Design → Energetic orange", "Results + Shop"],
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
        schedule([
          { title: "Team practice", day: "Mon", time: "18:00", place: "Court A" },
          { title: "Shooting drills", day: "Wed", time: "18:00", place: "Court A" },
          { title: "City Cup playoff", day: "Sat", time: "10:00", place: "Pavelló Nord", type: "competition" },
        ]),
        resultsSimple([
          { athlete: "Lucas M.", comp: "Barcelona City Cup", place: 1, date: "2026-03-15" },
          { athlete: "Marco T.", comp: "Catalunya U14", place: 2, date: "2026-02-08" },
          { athlete: "Diego R.", comp: "Friendly vs L'Hospitalet", place: 3, date: "2026-01-20" },
        ]),
        attendance([
          { name: "Lucas M.", role: "#7" },
          { name: "Marco T.", role: "#11" },
          { name: "Diego R.", role: "#4" },
          { name: "Alex P.", role: "#23" },
          { name: "Noah S.", role: "#9" },
          { name: "Leo H.", role: "#15" },
        ]),
        contacts([
          { name: "Coach Miguel", role: "Head coach", url: "tel:+34600000001" },
          { name: "Parents rep", role: "Laura G.", url: "mailto:parents@thunderhoops.es" },
        ]),
        integrations([
          { url: "https://www.hudl.com/", label: "Game film" },
          { url: "https://www.youtube.com/", label: "Highlights" },
        ]),
        shop(
          [
            {
              name: "Thunder home jersey",
              price: "€38",
              imageUrl: "https://images.unsplash.com/photo-1574623452334-1e0ac2bddd96?w=200&h=200&fit=crop",
            },
            {
              name: "Practice shorts",
              price: "€22",
              imageUrl: "https://images.unsplash.com/photo-1519861531473-920026218ac7?w=200&h=200&fit=crop",
            },
          ],
        ),
        payments("March membership", "€55 · includes league registration", "https://pay.example.com/hoops"),
      ],
    ),
  },
  {
    sportRu: "Хоккейная команда",
    presetLabel: "Dark athletic",
    heroLayout: "inside_header",
    heroLayoutLabel: HERO_VARIANT_META.inside_header.label,
    builderSteps: ["Header → Logo inside header", "Design → Dark athletic", "Trips + Gallery"],
    team: makeTeam(
      "demo_hockey",
      "nordic-ice",
      "Nordic Ice Wolves",
      "dark_athletic",
      "U12–U16 elite",
      SHOWCASE_LOGOS.hockey,
      [
        ann("❄️ Rink B closed Monday — session at 16:00.", "info"),
        hero("inside_header", "Tampere, Finland", SHOWCASE_COVERS.hockey, {
          social: { instagram: "nordicicewolves" },
        }),
        schedule([
          { title: "Ice practice", day: "Mon", time: "16:00", place: "Rink B" },
          { title: "Skills & systems", day: "Wed", time: "16:00", place: "Rink B" },
          { title: "Scrimmage", day: "Fri", time: "17:30", place: "Rink A", type: "competition" },
        ]),
        resultsSimple([
          { athlete: "Elias V.", comp: "Regional Cup U14", place: 1, date: "2026-02-20" },
          { athlete: "Oskar L.", comp: "Nordic Youth League", place: 2, date: "2026-01-12" },
        ], "2025–26 Season"),
        trip([
          { title: "Tallinn tournament", body: "Mar 14–16 · bus leaves 07:00 · hotel included" },
          { title: "Gear check", body: "Full kit + mouthguard · parents sign waiver by Mar 10" },
        ]),
        weather("-4°C", "Light snow · outdoor rink closed", "Tampere"),
        gallery(GALLERY_HOCKEY, ["Away game", "Team bench", "Celebration"]),
        payments("Season fee", "€420 · instalments available", "https://pay.example.com/hockey"),
      ],
    ),
  },
  {
    sportRu: "Плавательная команда",
    presetLabel: "Ocean aqua",
    heroLayout: "overlap_large",
    heroLayoutLabel: HERO_VARIANT_META.overlap_large.label,
    builderSteps: ["Header → Logo overlapping header", "Design → Ocean aqua", "Results + Poll"],
    team: makeTeam(
      "demo_swim",
      "aqua-wave",
      "Aqua Wave Swim Club",
      "ocean_aqua",
      "Competitive swimming · 8–16",
      SHOWCASE_LOGOS.swim,
      [
        ann("🏊 County meet Sunday — warm-up 08:00.", "confirm"),
        hero("overlap_large", "Tallinn, Estonia", SHOWCASE_COVERS.swim, {
          social: { instagram: "aquawaveswim", whatsapp: "+3725123456" },
        }),
        schedule([
          { title: "Morning squad", day: "Mon", time: "06:30", place: "50 m pool" },
          { title: "Technique session", day: "Wed", time: "06:30", place: "50 m pool" },
          { title: "Endurance set", day: "Fri", time: "06:30", place: "50 m pool" },
          { title: "County meet", day: "Sun", time: "08:00", place: "Olympic Centre", type: "competition" },
        ]),
        resultsSimple([
          { athlete: "Krista L.", comp: "100 m freestyle", place: 1, date: "2026-04-02" },
          { athlete: "Markus T.", comp: "200 m IM", place: 2, date: "2026-03-18" },
          { athlete: "Relay A", comp: "4×100 free", place: 1, date: "2026-02-25" },
        ]),
        poll("Who can help at the county meet?", "I can volunteer", "Not this time"),
        achievements([
          { icon: "🥇", title: "County relay gold", player: "Girls 14U", description: "New club record" },
          { icon: "⭐", title: "Swimmer of the month", player: "Krista L.", description: "March 2026" },
          { icon: "🏊", title: "Qualifying times", player: "6 athletes", description: "National juniors" },
        ]),
        contacts([
          { name: "Coach Liis", role: "Head coach", url: "tel:+3725123456" },
          { name: "Meet coordinator", role: "Andres P.", url: "mailto:meets@aquawave.ee" },
        ]),
        integrations([
          { url: "https://www.strava.com/clubs/", label: "Dryland club" },
          { url: "https://www.youtube.com/", label: "Race footage" },
        ], "full"),
        payments("April fee", "€60 · pool + coaching", "https://pay.example.com/swim"),
      ],
    ),
  },
  {
    sportRu: "Балетная студия",
    presetLabel: "Minimal mono",
    heroLayout: "minimal",
    heroLayoutLabel: HERO_VARIANT_META.minimal.label,
    builderSteps: ["Header → Minimal text-focused", "Design → Minimal mono", "Countdown + Resources"],
    team: makeTeam(
      "demo_ballet",
      "etoile-ballet",
      "Étoile Ballet Studio",
      "minimal_mono",
      "Classical · Pre-professional",
      SHOWCASE_LOGOS.ballet,
      [
        ann("🩰 Nutcracker audition — sign up by Wednesday.", "info"),
        hero("minimal", "Paris, France", SHOWCASE_COVERS.ballet, {
          social: { instagram: "etoileballet", website: "etoileballet.fr" },
        }),
        gallery(GALLERY_BALLET, ["Studio barre", "Rehearsal", "On stage"]),
        schedule([
          { title: "Technique III", day: "Mon", time: "17:00", place: "Studio 1" },
          { title: "Pointe class", day: "Wed", time: "17:00", place: "Studio 1" },
          { title: "Repertoire", day: "Sat", time: "10:00", place: "Grand studio" },
        ]),
        countdown("Summer gala", "2026-07-12T19:00:00"),
        achievements([
          { icon: "🩰", title: "Paris prize", player: "Camille R.", description: "Silver solo 2025" },
          { icon: "✨", title: "Excellence award", player: "Étoile pre-pro", description: "Technique & artistry" },
        ]),
        contacts([
          { name: "Madame Claire", role: "Director", url: "mailto:claire@etoileballet.fr" },
          { name: "Monsieur Philippe", role: "Ballet master", url: "tel:+33145678900" },
        ]),
        payments("Summer term", "€280 · 12 weeks", "https://pay.example.com/ballet"),
        sponsors(["Opéra Friends", "DanceWear Paris"]),
      ],
    ),
  },
  {
    sportRu: "Теннисная академия",
    presetLabel: "Premium forest",
    heroLayout: "square",
    heroLayoutLabel: HERO_VARIANT_META.square.label,
    builderSteps: ["Header → Square logo layout", "Design → Premium forest", "UTR integration + Shop"],
    team: makeTeam(
      "demo_tennis",
      "ace-tennis",
      "Ace Tennis Academy",
      "premium_forest",
      "Red clay · UTR juniors",
      SHOWCASE_LOGOS.tennis,
      [
        ann("🎾 Club tournament Sunday — register by Friday.", "confirm"),
        hero("square", "Lisbon, Portugal", SHOWCASE_COVERS.tennis, {
          social: { instagram: "acetennisacademy", whatsapp: "+351912345678" },
        }),
        schedule([
          { title: "Red squad", day: "Tue", time: "16:00", place: "Courts 1–3" },
          { title: "Match play", day: "Thu", time: "16:00", place: "Courts 1–3" },
          { title: "Club tournament", day: "Sun", time: "09:00", place: "Center courts", type: "competition" },
        ]),
        resultsSimple([
          { athlete: "Inês R.", comp: "Lisbon Open U14", place: 1, date: "2026-05-03" },
          { athlete: "Tomás F.", comp: "Estoril Junior", place: 2, date: "2026-04-14" },
        ]),
        poll("Can you help with court maintenance Saturday?", "Count me in", "Sorry, no"),
        contacts([
          { name: "Coach Pedro", role: "Head pro", url: "tel:+351912345678" },
          { name: "Academy office", role: "Bookings", url: "mailto:hello@acetennis.pt" },
        ]),
        gallery(GALLERY_TENNIS, ["Clay court drills", "Match point", "Academy day"]),
        integrations([
          { url: "https://www.utrsports.net/", label: "UTR ratings" },
          { url: "https://www.youtube.com/", label: "Match highlights" },
        ]),
        shop(
          [
            {
              name: "Academy polo",
              price: "€42",
              imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
            },
          ],
          "card",
        ),
        payments("Monthly pass", "€120 · unlimited court time", "https://pay.example.com/tennis"),
        sponsors(["Lisbon Sports Club", "Wilson Portugal"]),
      ],
    ),
  },
];
