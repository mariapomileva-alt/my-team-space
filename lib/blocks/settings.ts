import { DEFAULT_HERO_VARIANT, type HeroLayoutVariant } from "@/lib/blocks/hero-layout";
import type { QuickActionIconId } from "@/lib/quick-actions/icons";
import type { BlockInstance, BlockType } from "@/lib/types";

export type PaymentLinkSettings = {
  title: string;
  description: string;
  buttonLabel: string;
  paymentUrl: string;
};

export type QuickActionItem = {
  id: string;
  icon: QuickActionIconId;
  title: string;
  url: string;
};

export type QuickActionsSettings = {
  sectionTitle?: string;
  actions: QuickActionItem[];
};

export type TeamShopProduct = {
  id: string;
  imageUrl: string;
  name: string;
  price?: string;
  description?: string;
  buttonLabel: string;
  productUrl: string;
};

export type TeamShopSettings = {
  sectionTitle?: string;
  subtitle?: string;
  products: TeamShopProduct[];
};

export type SocialKey = "instagram" | "telegram" | "whatsapp" | "tiktok" | "facebook" | "youtube";

export type ManualScheduleEvent = {
  id: string;
  title: string;
  eventType: "training" | "competition" | "camp" | "meeting";
  dayOfWeek: number;
  time: string;
  location: string;
  repeat: "none" | "weekly" | "biweekly" | "monthly" | "custom";
  ends: "never" | "date";
  endDate?: string;
};

export type AchievementCard = {
  id: string;
  icon: string;
  title: string;
  player: string;
  description: string;
  date?: string;
  imageUrl?: string;
};

export type RosterPlayer = {
  id: string;
  name: string;
  age?: string;
  role?: string;
  photoUrl?: string;
  birthday?: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  caption?: string;
};

/** Generic row for results, contacts, feed posts, etc. */
export type ContentItem = {
  id: string;
  [key: string]: string;
};

export type ResourceKind =
  | "pdf"
  | "link"
  | "audio"
  | "video"
  | "image"
  | "plan"
  | "nutrition"
  | "choreography"
  | "other";

export type ResourceItem = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  fileUrl?: string;
  kind: ResourceKind;
};

export type ListBlockSettings = { items: ContentItem[] };

export type PollSettings = { question: string; optionYes: string; optionNo: string };

export type CountdownSettings = { label: string; targetDate: string };

export type WeatherSettings = { temp: string; note: string; location: string };

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultSettingsForType(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "announcement_bar":
      return { message: "", tone: "info" as "info" | "urgent" | "confirm", accent: "theme", pinned: true };
    case "hero":
      return {
        heroLayout: DEFAULT_HERO_VARIANT as HeroLayoutVariant,
        quote: "",
        description: "",
        city: "",
        coverImageUrl: "",
        teamPhotoUrl: "",
        social: {} as Partial<Record<SocialKey, string>>,
      };
    case "schedule":
      return { mode: "manual", events: [] as ManualScheduleEvent[], externalUrl: "" };
    case "calendar":
      return { externalUrl: "" };
    case "gallery":
      return { mode: "manual", images: [] as GalleryImage[], externalUrl: "" };
    case "achievements":
      return { cards: [] as AchievementCard[] };
    case "attendance":
      return { enabledFeatures: { streaks: true, history: true }, roster: [] as RosterPlayer[] };
    case "quick_links":
      return {
        whatsapp: "",
        telegram: "",
        phone: "",
        customLabel: "",
        customUrl: "",
      };
    case "payments":
      return {
        title: "Monthly Membership",
        description: "",
        buttonLabel: "Pay now",
        paymentUrl: "",
      } satisfies PaymentLinkSettings;
    case "quick_actions":
      return {
        sectionTitle: "Quick actions",
        actions: [] as QuickActionItem[],
      } satisfies QuickActionsSettings;
    case "team_shop":
      return {
        sectionTitle: "Team Shop",
        subtitle: "Order team merch and equipment here.",
        products: [] as TeamShopProduct[],
      } satisfies TeamShopSettings;
    case "results":
      return {
        enabled: true,
        mode: "season",
        blockTitle: "Results board",
        seasonName: `${new Date().getFullYear()} Season`,
        seasonTimeline: false,
        timelineTitle: "Season memories",
        categories: [],
        usePointsRating: true,
        medalsOnly: false,
        scoring: {
          first: 10,
          second: 8,
          third: 6,
          fourth: 4,
          fifth: 3,
          sixth: 2,
          other: 1,
          skipped: 0,
        },
        competitions: [],
        simpleResults: [],
      };
    case "contacts":
    case "documents":
    case "team_feed":
    case "camp_trip":
      return { items: [] as ContentItem[], confirmationsEnabled: true };
    case "sponsors":
      return { items: [] as ContentItem[] };
    case "polls":
      return { question: "", optionYes: "I'm in", optionNo: "Can't make it" };
    case "countdown":
      return { label: "Next event", targetDate: "" };
    case "weather":
      return { temp: "", note: "", location: "" };
    case "integrations":
      return {
        sectionTitle: "Smart integrations",
        links: [] as {
          id: string;
          url: string;
          label?: string;
          description?: string;
          providerId?: string;
          variant?: "compact" | "featured" | "tile";
          featured?: boolean;
        }[],
      };
    case "resources":
      return { sectionTitle: "Team resources", items: [] as ResourceItem[] };
    default:
      return {};
  }
}

export function newContentItem(partial?: Partial<ContentItem>): ContentItem {
  return { id: uid("row"), emoji: "", name: "", subtitle: "", title: "", body: "", url: "", ...partial };
}

export function getBlockSettings<T extends Record<string, unknown>>(
  block: BlockInstance,
): T {
  const defaults = defaultSettingsForType(block.type) as T;
  const raw = block.settings;
  if (!raw || typeof raw !== "object") return defaults;
  return { ...defaults, ...(raw as T) };
}

export function patchBlockSettings(
  block: BlockInstance,
  patch: Record<string, unknown>,
): BlockInstance {
  return {
    ...block,
    settings: { ...getBlockSettings(block), ...patch },
  };
}

export function newManualScheduleEvent(): ManualScheduleEvent {
  return {
    id: uid("evt"),
    title: "Training",
    eventType: "training",
    dayOfWeek: 2,
    time: "18:00",
    location: "",
    repeat: "weekly",
    ends: "never",
  };
}

export function newAchievementCard(): AchievementCard {
  return {
    id: uid("ach"),
    icon: "🏆",
    title: "Great job!",
    player: "",
    description: "",
  };
}

export function newRosterPlayer(): RosterPlayer {
  return { id: uid("ply"), name: "", role: "", age: "" };
}

export function newGalleryImage(): GalleryImage {
  return { id: uid("img"), url: "", caption: "" };
}

export function newResultItem(): ContentItem {
  return newContentItem({ emoji: "🏆", name: "", subtitle: "" });
}

export function newContactItem(): ContentItem {
  return newContentItem({ name: "", role: "", url: "", photoUrl: "" });
}

export function newDocumentItem(): ContentItem {
  return newContentItem({ title: "", url: "" });
}

export function newFeedPost(): ContentItem {
  return newContentItem({ title: "", body: "" });
}

export function newCampItem(): ContentItem {
  return newContentItem({ title: "", body: "" });
}

export function newSponsorItem(): ContentItem {
  return newContentItem({ name: "", url: "", logoUrl: "" });
}

export function newResourceItem(): ResourceItem {
  return { id: uid("res"), title: "", description: "", url: "", kind: "pdf" };
}

export function newQuickActionItem(partial?: Partial<QuickActionItem>): QuickActionItem {
  return {
    id: uid("act"),
    icon: "custom",
    title: "",
    url: "",
    ...partial,
  };
}

export function newTeamShopProduct(partial?: Partial<TeamShopProduct>): TeamShopProduct {
  return {
    id: uid("prod"),
    imageUrl: "",
    name: "",
    price: "",
    description: "",
    buttonLabel: "Order now",
    productUrl: "",
    ...partial,
  };
}

export const ACHIEVEMENT_ICONS = ["🏆", "🥇", "🥈", "🥉", "⭐", "🎖", "📜", "🔥", "❤️"] as const;

export const LAYOUT_OPTIONS: { value: NonNullable<BlockInstance["layout"]>; label: string }[] = [
  { value: "full", label: "Full width" },
  { value: "featured", label: "Featured hero" },
  { value: "half", label: "Half width" },
  { value: "card", label: "Card grid" },
];

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
