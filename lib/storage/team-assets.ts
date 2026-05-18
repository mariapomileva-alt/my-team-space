import { getSupabaseUrl } from "@/lib/supabase/env";

export const TEAM_ASSETS_BUCKET = "team-assets";

export function teamAssetPublicUrl(storagePath: string): string {
  const base = getSupabaseUrl();
  if (!base) return storagePath;
  const path = storagePath.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${TEAM_ASSETS_BUCKET}/${path}`;
}

export function buildTeamAssetPath(teamId: string, folder: string, filename: string): string {
  const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "").slice(0, 32) || "media";
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  return `${teamId}/${safeFolder}/${safeName}`;
}
