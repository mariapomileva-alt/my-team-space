import type { TeamSpace } from "@/lib/types";

export type PageLiveStatus = "not_live" | "live";

export function pageLiveStatus(team: TeamSpace): PageLiveStatus {
  return team.publishStatus === "published" ? "live" : "not_live";
}

export function pageStatusPrimaryLabel(team: TeamSpace): "Not live" | "Live" {
  return pageLiveStatus(team) === "live" ? "Live" : "Not live";
}

export function pageStatusHelperText(team: TeamSpace): string {
  return pageLiveStatus(team) === "live"
    ? "Parents can view this page."
    : "Only you can see this page.";
}

export function pageStatusSecondaryLabel(saveState: "idle" | "saving" | "saved" | "error"): string {
  if (saveState === "saving") return "Saving…";
  if (saveState === "error") return "Save issue";
  return "Saved";
}
