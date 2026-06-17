/** True when team content is persisted in Supabase (production). */
export function usesCloudTeamStorage(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
}
