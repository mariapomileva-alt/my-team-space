export type SubscriptionPlan = "free" | "pro" | "club";

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
  | "quick_links";

export type BlockInstance = {
  id: string;
  type: BlockType;
  enabled: boolean;
  order: number;
  /** Block-specific config (future Supabase JSON) */
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
};
