export type SubscriptionPlan = "free" | "pro" | "club";

export type TeamVisibility = "public" | "private" | "mixed";

export type BlockAudience = "public" | "private";

export type PaymentStatus = "paid" | "pending" | "unpaid";

export type PaymentTrackerRow = {
  id: string;
  label: string;
  month: string;
  status: PaymentStatus;
  note?: string;
};

export type TeamPageSettings = {
  parentConsent?: boolean;
  hideChildNames?: boolean;
  coachWhatsapp?: string;
  pollNotifications?: boolean;
  payments?: PaymentTrackerRow[];
  /** External logo URL (builder); falls back to Storage logo_path when unset */
  logoUrl?: string;
};

export type ThemeId =
  | "ocean_aqua"
  | "dark_athletic"
  | "energetic_orange"
  | "minimal_mono"
  | "premium_forest"
  | "pastel_youth";

export type BlockType =
  | "hero"
  | "announcement_bar"
  | "calendar"
  | "schedule"
  | "results"
  | "achievements"
  | "team_feed"
  | "attendance"
  | "camp_trip"
  | "contacts"
  | "documents"
  | "polls"
  | "gallery"
  | "sponsors"
  | "weather"
  | "countdown"
  | "birthdays"
  | "quick_links"
  | "payments"
  | "quick_actions"
  | "team_shop"
  | "integrations"
  | "resources";

export type BlockLayout = "full" | "half" | "card" | "featured";

export type BlockInstance = {
  id: string;
  type: BlockType;
  enabled: boolean;
  order: number;
  /** Visual width / emphasis on the public page */
  layout?: BlockLayout;
  /** Block-specific content — see lib/blocks/settings.ts */
  settings?: Record<string, unknown>;
};

export type TeamSpace = {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  themeId: ThemeId;
  plan: SubscriptionPlan;
  tagline?: string;
  blocks: BlockInstance[];
  /** Denormalized for UI (from DB) */
  subscriptionStatus?: string;
  publishStatus?: "draft" | "published";
  isPlanPrimary?: boolean;
  planEditLocked?: boolean;
  pageVisibility?: TeamVisibility;
  accessCode?: string;
  inviteToken?: string;
  pageSettings?: TeamPageSettings;
  /** ISO timestamp from `teams.updated_at` — used to prevent stale cross-device overwrites */
  updatedAt?: string;
};
