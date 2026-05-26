import {
  detectIntegrationProvider,
  vimeoVideoId,
  youtubeVideoId,
  type IntegrationProvider,
} from "@/lib/integrations/providers";
import type { IntegrationLink, IntegrationPreview } from "@/lib/integrations/types";

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]!;
}

export function integrationCta(provider: IntegrationProvider): string {
  switch (provider.category) {
    case "fitness":
      return "Open dashboard";
    case "video":
      return "Watch video";
    case "calendar":
      return "Open calendar";
    case "photos":
      return "View gallery";
    case "social":
      return "View profile";
    case "chat":
      return "Open chat";
    case "music":
      return "Open playlist";
    case "docs":
    case "design":
      return "Open workspace";
    case "sports":
      return "Open hub";
    default:
      return "Open link";
  }
}

export function defaultDescription(provider: IntegrationProvider): string {
  switch (provider.id) {
    case "garmin":
      return "Training load & activity sync for your squad.";
    case "strava":
      return "Club rides, runs, and team challenges.";
    case "trainingpeaks":
      return "Structured plans and coach dashboards.";
    case "google_calendar":
      return "Practices, meets, and family-friendly schedule.";
    case "google_photos":
      return "Shared albums from games and events.";
    case "youtube":
      return "Highlights, drills, and team moments.";
    case "instagram":
      return "Latest posts and stories from the team.";
    case "spotify":
      return "Warm-up playlists and bus ride vibes.";
    case "notion":
      return "Playbooks, notes, and team wiki.";
    default:
      return `Quick access to ${provider.name}.`;
  }
}

export function buildIntegrationPreview(url: string, provider: IntegrationProvider): IntegrationPreview {
  const seed = hashSeed(url);
  const yt = youtubeVideoId(url);
  const vimeo = vimeoVideoId(url);

  if (yt) {
    return {
      headline: "Team video",
      subline: "Tap to play on YouTube",
      thumbnailUrl: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`,
      duration: `${3 + (seed % 8)}:${String(10 + (seed % 49)).padStart(2, "0")}`,
    };
  }

  if (vimeo) {
    return {
      headline: "Team video",
      subline: "Tap to play on Vimeo",
      thumbnailUrl: `https://vumbnail.com/${vimeo}.jpg`,
      duration: `${2 + (seed % 6)}:${String(5 + (seed % 54)).padStart(2, "0")}`,
    };
  }

  switch (provider.id) {
    case "garmin":
      return {
        headline: "Garmin squad",
        subline: pick(["Synced today", "Updated 2h ago", "Live sync"], seed),
        stats: [
          { label: "Athletes", value: String(8 + (seed % 14)) },
          { label: "This week", value: `${120 + (seed % 80)} km` },
          { label: "Status", value: pick(["On track", "Recovery", "Peak week"], seed) },
        ],
      };
    case "strava":
      return {
        headline: "Club activity",
        subline: "Team feed & leaderboards",
        stats: [
          { label: "Members", value: String(10 + (seed % 20)) },
          { label: "Activities", value: String(24 + (seed % 40)) },
        ],
      };
    case "google_calendar":
      return {
        headline: "Upcoming",
        subline: pick(["Team practice · Tue 18:00", "Meet · Sat 10:00", "Camp weekend"], seed),
        stats: [
          { label: "This week", value: `${3 + (seed % 5)} events` },
          { label: "Next", value: pick(["Tomorrow", "In 2 days", "This weekend"], seed) },
        ],
      };
    case "google_photos":
      return {
        headline: "Shared album",
        subline: "Team photos & memories",
        postSwatches: ["#fda4af", "#93c5fd", "#fcd34d", "#86efac"],
      };
    case "instagram":
      return {
        headline: "@team",
        subline: "Latest from the squad",
        postSwatches: ["#f472b6", "#fb923c", "#a78bfa", "#38bdf8", "#4ade80", "#fbbf24"],
      };
    case "spotify":
      return {
        headline: pick(["Game day mix", "Warm-up beats", "Bus playlist"], seed),
        subline: "Spotify · Team playlist",
        chips: ["Warm-up", "Focus", "Celebrate"],
      };
    case "telegram":
    case "whatsapp":
      return {
        headline: provider.name,
        subline: "Group chat for parents & coaches",
        chips: ["Updates", "Reminders"],
      };
    default:
      return {
        headline: provider.name,
        subline: tryHostname(url),
      };
  }
}

function tryHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "External link";
  }
}

export function resolveLinkVariant(
  link: IntegrationLink,
  index: number,
  _total: number,
): "compact" | "featured" | "tile" {
  if (link.variant) return link.variant;
  if (link.featured) return "featured";
  if (index === 0) return "featured";
  return "tile";
}

export function enrichIntegrationLink(link: IntegrationLink, index: number, total: number) {
  const url = link.url?.trim() ?? "";
  const provider = detectIntegrationProvider(url);
  const variant = resolveLinkVariant(link, index, total);
  const preview = url ? buildIntegrationPreview(url, provider) : undefined;
  return {
    ...link,
    providerId: provider.id,
    variant,
    description: link.description?.trim() || link.label?.trim() || defaultDescription(provider),
    label: link.label?.trim() || preview?.headline || provider.name,
    preview,
    provider,
    cta: integrationCta(provider),
  };
}
