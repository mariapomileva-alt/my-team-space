export type QuickActionIconId =
  | "payment"
  | "shop"
  | "registration"
  | "competition"
  | "booking"
  | "photos"
  | "videos"
  | "documents"
  | "maps"
  | "social"
  | "academy"
  | "custom";

export type QuickActionIconOption = {
  id: QuickActionIconId;
  emoji: string;
  label: string;
};

export const QUICK_ACTION_ICON_OPTIONS: QuickActionIconOption[] = [
  { id: "payment", emoji: "💳", label: "Payment" },
  { id: "shop", emoji: "🛍", label: "Shop" },
  { id: "registration", emoji: "📋", label: "Registration" },
  { id: "competition", emoji: "🏆", label: "Competition" },
  { id: "booking", emoji: "📅", label: "Booking" },
  { id: "photos", emoji: "📸", label: "Photos" },
  { id: "videos", emoji: "🎥", label: "Videos" },
  { id: "documents", emoji: "📄", label: "Documents" },
  { id: "maps", emoji: "📍", label: "Maps" },
  { id: "social", emoji: "📱", label: "Social" },
  { id: "academy", emoji: "🎓", label: "Academy" },
  { id: "custom", emoji: "⭐", label: "Custom" },
];

const EMOJI_BY_ID = Object.fromEntries(
  QUICK_ACTION_ICON_OPTIONS.map((o) => [o.id, o.emoji]),
) as Record<QuickActionIconId, string>;

export function quickActionEmoji(icon: QuickActionIconId | string | undefined): string {
  if (icon && icon in EMOJI_BY_ID) return EMOJI_BY_ID[icon as QuickActionIconId];
  return "⭐";
}
