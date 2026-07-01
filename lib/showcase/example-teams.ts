import { EXAMPLE_PHOTO_SETS } from "@/lib/showcase/example-photos";
import { SHOWCASE_LOGOS } from "@/lib/showcase/logo-svg";
import {
  achievements,
  ann,
  attendance,
  contacts,
  countdown,
  feed,
  gallery,
  hero,
  integrations,
  makeTeam,
  payments,
  poll,
  resultsSimple,
  schedule,
  shop,
  sponsors,
} from "@/lib/showcase/team-factories";
import type { TeamSpace } from "@/lib/types";

export type ProductExample = {
  id: string;
  label: string;
  headline: string;
  story: string;
  audience: string;
  personality: "premium" | "playful" | "performance";
  personalityLabel: string;
  paletteLabel: string;
  highlights: string[];
  spotlightPhotos: readonly string[];
  team: TeamSpace;
};

const tennisPhotos = EXAMPLE_PHOTO_SETS.tennis;
const dancePhotos = EXAMPLE_PHOTO_SETS.dance;
const hoopsPhotos = EXAMPLE_PHOTO_SETS.basketball;

const northgateTennis = makeTeam(
  "example_premium",
  "northgate-tennis",
  "Northgate Tennis Academy",
  "minimal_mono",
  "Junior performance · Ages 10–18",
  SHOWCASE_LOGOS.tennis,
  [
    ann("Spring term registration closes Friday — 4 spots left in the 14U squad.", "info"),
    hero("minimal", "Zurich, Switzerland", tennisPhotos.cover, {
      quote: "Precision. Patience. Progress.",
      description:
        "A pre-professional academy for disciplined juniors. Parents get one calm page — schedule, results, fees, and coach contact — without chasing messages.",
      social: {
        instagram: "northgatetennis",
        website: "northgatetennis.ch",
        whatsapp: "+41441234567",
      },
    }),
    schedule(
      [
        { title: "Academy squad — technique", day: "Mon", time: "16:00", place: "Centre Court 1–3" },
        { title: "Match play & video review", day: "Wed", time: "16:00", place: "Centre Court 1–3" },
        { title: "Fitness & footwork", day: "Fri", time: "15:30", place: "Performance gym" },
        { title: "Swiss Junior Open", day: "Sat", time: "09:00", place: "TC Küsnacht", type: "competition" },
      ],
      "featured",
    ),
    gallery(tennisPhotos.gallery, [...tennisPhotos.galleryCaptions], "featured"),
    achievements(
      [
        { icon: "🥇", title: "Swiss Junior Open", player: "Lea M.", description: "U16 singles · April 2026" },
        { icon: "🥈", title: "Zurich team cup", player: "Noah K.", description: "Doubles · March 2026" },
        { icon: "⭐", title: "Player of the term", player: "Sofia R.", description: "Consistency & attitude" },
      ],
      "featured",
    ),
    resultsSimple(
      [
        { athlete: "Lea M.", comp: "Swiss Junior Open U16", place: 1, date: "2026-04-12" },
        { athlete: "Noah K.", comp: "Zurich Doubles Cup", place: 2, date: "2026-03-28" },
        { athlete: "Emil V.", comp: "Basel Spring Open", place: 3, date: "2026-03-05" },
        { athlete: "Sofia R.", comp: "Inter-club league", place: 1, date: "2026-02-19" },
      ],
      "2025–26 Season",
      "featured",
    ),
    contacts(
      [
        { name: "Marcus Keller", role: "Head coach · PTR Elite", url: "tel:+41441234567" },
        { name: "Anna Weiss", role: "Academy director", url: "mailto:anna@northgatetennis.ch" },
        { name: "Front desk", role: "Bookings & trials", url: "mailto:hello@northgatetennis.ch" },
      ],
      "half",
    ),
    integrations(
      [
        { url: "https://www.utrsports.net/", label: "UTR player profiles" },
        { url: "https://www.youtube.com/", label: "Match highlights" },
      ],
      "half",
    ),
    feed([
      {
        title: "New term starts 8 September",
        body: "Training groups confirmed by Friday. Payment link is live in the Payments block below.",
      },
      {
        title: "Swiss Junior Open — travel info",
        body: "Meet at TC Küsnacht 08:15. White kit. Parents sign the travel form by Wednesday.",
      },
    ]),
    payments(
      "Spring term 2026",
      "CHF 1,280 · 12 weeks · includes match supervision",
      "https://pay.example.com/northgate-spring",
      "full",
    ),
  ],
  { designStyle: "premium", coachWhatsapp: "+41441234567" },
);

const sparkleSteps = makeTeam(
  "example_playful",
  "sparkle-steps",
  "Sparkle & Steps",
  "pastel_youth",
  "Dance · Gymnastics · Ages 5–12",
  SHOWCASE_LOGOS.dance,
  [
    ann("🎀 Spring showcase costumes ready for pickup — Studio B until Thursday.", "confirm"),
    hero("overlap_large", "Copenhagen, Denmark", dancePhotos.cover, {
      quote: "Every child deserves a moment on stage.",
      description:
        "A joyful studio where parents see rehearsals, medals, and what's coming next — all in one colourful place.",
      social: {
        instagram: "sparkleandsteps",
        whatsapp: "+4520123456",
      },
    }),
    schedule(
      [
        { title: "Mini movers (5–7)", day: "Tue", time: "15:30", place: "Studio A" },
        { title: "Jazz & acro (8–10)", day: "Wed", time: "16:15", place: "Studio B" },
        { title: "Competition team", day: "Thu", time: "17:00", place: "Main hall" },
        { title: "Spring showcase dress rehearsal", day: "Fri", time: "18:00", place: "Community theatre", type: "competition" },
      ],
      "featured",
    ),
    gallery(dancePhotos.gallery, [...dancePhotos.galleryCaptions], "featured"),
    achievements(
      [
        { icon: "🥇", title: "Nordic youth festival", player: "Group A", description: "Gold · group jazz" },
        { icon: "🌟", title: "Spirit award", player: "Emma L.", description: "Ages 6–8 division" },
        { icon: "🏅", title: "Acro pairs", player: "Mila & Sara", description: "Silver · Copenhagen Open" },
        { icon: "💃", title: "Choreography prize", player: "Teen crew", description: "Judges' favourite" },
      ],
      "featured",
    ),
    poll("Who can volunteer at the Spring Showcase on 14 June?", "Count me in!", "Can't this time"),
    countdown("Spring Showcase night", "2026-06-14T18:00:00"),
    contacts(
      [
        { name: "Coach Freja", role: "Artistic director", url: "tel:+4520123456" },
        { name: "Studio desk", role: "Enrolment & fees", url: "mailto:hello@sparkleandsteps.dk" },
      ],
      "half",
    ),
    feed([
      {
        title: "Showcase tickets on sale",
        body: "Doors 17:30 · Community Theatre. Two tickets per family included in the spring fee.",
      },
      {
        title: "Half-term camp — 3 places left",
        body: "Mon–Wed 09:00–14:00. Gymnastics, jazz, and team games. Sign up via Payments.",
      },
    ]),
    payments("Spring term fee", "DKK 2,400 · includes showcase costume & photos", "https://pay.example.com/sparkle-spring"),
  ],
  { designStyle: "playful", coachWhatsapp: "+4520123456", mobileCardColumns: "double" },
);

const harborHawks = makeTeam(
  "example_club",
  "harbor-hawks",
  "Harbor Hawks BC",
  "energetic_orange",
  "U14 boys · Copenhagen city league",
  SHOWCASE_LOGOS.basketball,
  [
    ann("🏀 City cup semi-final Saturday 10:00 — white kit, arrive 09:15.", "urgent"),
    hero("inline", "Copenhagen, Denmark", hoopsPhotos.cover, {
      quote: "Built week by week. Played as one.",
      description:
        "A competitive neighbourhood club with fixtures every weekend — parents always know where, when, and who to contact.",
      social: {
        instagram: "harborhawksbc",
        whatsapp: "+4520987654",
      },
    }),
    schedule(
      [
        { title: "Team practice", day: "Tue", time: "18:00", place: "Harbor Sports Hall · Court 2" },
        { title: "Shooting & conditioning", day: "Thu", time: "18:00", place: "Harbor Sports Hall · Court 2" },
        { title: "City league — vs Nordvest", day: "Sat", time: "10:00", place: "Bellahøj Arena", type: "competition" },
        { title: "Recovery session", day: "Sun", time: "11:00", place: "Harbor Sports Hall" },
      ],
      "featured",
    ),
    resultsSimple(
      [
        { athlete: "Harbor Hawks", comp: "City league vs Amager", place: 1, date: "2026-05-10" },
        { athlete: "Lucas H.", comp: "Copenhagen U14 MVP", place: 1, date: "2026-04-22" },
        { athlete: "Harbor Hawks", comp: "Zealand invitational", place: 2, date: "2026-03-30" },
        { athlete: "Mikkel A.", comp: "Free throw challenge", place: 1, date: "2026-03-08" },
      ],
      "2025–26 Season",
      "featured",
    ),
    gallery(hoopsPhotos.gallery, [...hoopsPhotos.galleryCaptions], "featured"),
    attendance([
      { name: "Lucas H.", role: "#7 · Captain" },
      { name: "Mikkel A.", role: "#11" },
      { name: "Jonas P.", role: "#4" },
      { name: "Felix R.", role: "#23" },
      { name: "Oliver S.", role: "#9" },
      { name: "Emil K.", role: "#15" },
    ]),
    contacts(
      [
        { name: "Coach Thomas Berg", role: "Head coach · 12 yrs experience", url: "tel:+4520987654" },
        { name: "Laura Nielsen", role: "Parents' representative", url: "mailto:parents@harborhawks.dk" },
      ],
      "half",
    ),
    integrations(
      [
        { url: "https://www.hudl.com/", label: "Game film & stats" },
        { url: "https://www.youtube.com/", label: "Season highlights" },
      ],
      "half",
    ),
    shop(
      [
        {
          name: "Hawks home jersey",
          price: "DKK 349",
          imageUrl: hoopsPhotos.shopJersey,
        },
        {
          name: "Practice shorts",
          price: "DKK 199",
          imageUrl: hoopsPhotos.shopShorts,
        },
      ],
      "half",
    ),
    sponsors(["Harbor Sports Center", "Copenhagen Hoops", "Nordic Energy Drink"]),
    payments("Season membership", "DKK 2,950 · league entry & kit discount included", "https://pay.example.com/harbor-hawks"),
  ],
  { designStyle: "performance", coachWhatsapp: "+4520987654" },
);

export const PRODUCT_EXAMPLES: ProductExample[] = [
  {
    id: "premium",
    label: "Premium minimal",
    headline: "Calm, expensive, and unmistakably professional.",
    story:
      "Built for academies that want parents to feel the same trust on a phone screen as they do walking through the gate.",
    audience: "Professional academy",
    personality: "premium",
    personalityLabel: "Premium personality",
    paletteLabel: "Chrome palette",
    highlights: [
      "Editorial hero with real photography",
      "Full weekly schedule & recent results",
      "Achievements parents can share",
      "Term payments & coach contacts",
    ],
    spotlightPhotos: tennisPhotos.spotlight,
    team: northgateTennis,
  },
  {
    id: "playful",
    label: "Playful team",
    headline: "Colour, energy, and pride parents feel instantly.",
    story:
      "For studios where emotion matters — showcases, medals, and moments kids talk about all week.",
    audience: "Kids dance & gymnastics",
    personality: "playful",
    personalityLabel: "Playful personality",
    paletteLabel: "Pastel youth palette",
    highlights: [
      "Bright gallery that tells a story",
      "Competition achievements & countdown",
      "Parent poll for showcase volunteers",
      "Fees & updates in one friendly page",
    ],
    spotlightPhotos: dancePhotos.spotlight,
    team: sparkleSteps,
  },
  {
    id: "club",
    label: "Sports club",
    headline: "A club that looks alive every single week.",
    story:
      "Fixtures, film, kit shop, sponsors — everything a competitive team runs, presented like a club that takes itself seriously.",
    audience: "Basketball · city league",
    personality: "performance",
    personalityLabel: "Performance personality",
    paletteLabel: "Energetic orange palette",
    highlights: [
      "Match schedule & season results",
      "Squad attendance & coach profile",
      "Game film links & team shop",
      "Club sponsors on display",
    ],
    spotlightPhotos: hoopsPhotos.spotlight,
    team: harborHawks,
  },
];
