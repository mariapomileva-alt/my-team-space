import type { SocialKey } from "@/lib/blocks/settings";

export type SocialNetwork = SocialKey | "website" | "phone";

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: "Instagram",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
  facebook: "Facebook",
  youtube: "YouTube",
};

function stripAt(value: string) {
  return value.replace(/^@+/, "").trim();
}

function hasProtocol(value: string) {
  return /^https?:\/\//i.test(value) || /^mailto:/i.test(value) || /^tel:/i.test(value);
}

export function normalizeSocialUrl(network: SocialNetwork, raw: string): string {
  const value = raw.trim();
  if (!value) return "";

  if (hasProtocol(value)) return value;

  if (network === "phone") {
    const digits = value.replace(/[^\d+]/g, "");
    return digits ? `tel:${digits}` : value;
  }

  if (network === "website") {
    return `https://${value.replace(/^\/\//, "")}`;
  }

  if (network === "whatsapp") {
    const digits = value.replace(/[^\d+]/g, "");
    if (digits) return `https://wa.me/${digits.replace(/^\+/, "")}`;
    return value;
  }

  if (network === "telegram") {
    const handle = stripAt(value);
    return handle.startsWith("+")
      ? `https://t.me/${handle.slice(1)}`
      : `https://t.me/${handle}`;
  }

  if (network === "instagram") {
    return `https://instagram.com/${stripAt(value)}`;
  }

  if (network === "tiktok") {
    const handle = stripAt(value);
    return handle.includes("/")
      ? `https://www.tiktok.com/${handle.replace(/^\//, "")}`
      : `https://www.tiktok.com/@${handle}`;
  }

  if (network === "facebook") {
    const handle = stripAt(value);
    return handle.includes("facebook.com") ? `https://${handle.replace(/^https?:\/\//, "")}` : `https://facebook.com/${handle}`;
  }

  if (network === "youtube") {
    const handle = stripAt(value);
    if (handle.includes("youtube.com") || handle.includes("youtu.be")) {
      return handle.startsWith("http") ? handle : `https://${handle}`;
    }
    return handle.startsWith("@")
      ? `https://www.youtube.com/${handle}`
      : `https://www.youtube.com/@${handle}`;
  }

  return value;
}

export const SOCIAL_ICON_CLASS: Record<SocialKey, string> = {
  instagram: "text-[#E4405F]",
  whatsapp: "text-[#25D366]",
  telegram: "text-[#229ED9]",
  tiktok: "text-zinc-900",
  facebook: "text-[#1877F2]",
  youtube: "text-[#FF0000]",
};
