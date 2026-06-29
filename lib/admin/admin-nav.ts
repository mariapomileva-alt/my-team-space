import type { BuilderIconId } from "@/lib/builder/section-icons";

export type TeamAdminNavId = "build" | "members" | "calendar" | "results" | "settings";

export type TeamAdminNavItem = {
  id: TeamAdminNavId;
  href: (teamId: string) => string;
  label: string;
  icon: BuilderIconId;
};

export const TEAM_ADMIN_NAV: TeamAdminNavItem[] = [
  { id: "build", href: (id) => `/admin/team/${id}/build`, label: "Build Page", icon: "layout-panel" },
  { id: "members", href: (id) => `/admin/team/${id}/members`, label: "Members", icon: "users" },
  { id: "calendar", href: (id) => `/admin/team/${id}/calendar`, label: "Schedule", icon: "calendar" },
  { id: "results", href: (id) => `/admin/team/${id}/results`, label: "Results", icon: "trophy" },
  { id: "settings", href: (id) => `/admin/team/${id}/settings`, label: "Settings", icon: "settings" },
];

export const BUILDER_TEAM_TOOL_LINKS: {
  label: string;
  icon: BuilderIconId;
  href: (teamId: string) => string;
}[] = [
  { label: "Members", icon: "users", href: (id) => `/admin/team/${id}/members` },
  { label: "Schedule", icon: "calendar", href: (id) => `/admin/team/${id}/calendar` },
  { label: "Results", icon: "trophy", href: (id) => `/admin/team/${id}/results` },
];

export function teamBuildPath(teamId: string) {
  return `/admin/team/${teamId}/build`;
}
