export type BuilderSaveState = "idle" | "saving" | "saved" | "error";

/** Map Supabase / auth errors to a short hint under the toolbar status. */
export function humanizeSaveError(message: string): string {
  const raw = message.trim();
  if (!raw) return "Unknown error — try Publish or refresh the page.";
  if (raw === "Forbidden") return "No access to this team — sign in again as the coach.";
  if (/JWT|session|refresh token|not authenticated/i.test(raw)) {
    return "Session expired — refresh the page and sign in again.";
  }
  if (/page_settings|page_visibility|invite_token|theme_id/.test(raw) && /does not exist|column/i.test(raw)) {
    return "Database needs an update — run migrations in Supabase (folder supabase/migrations).";
  }
  if (/Missing Supabase env/i.test(raw)) {
    return "Server is missing Supabase keys (SUPABASE_URL / SUPABASE_ANON_KEY on the host).";
  }
  if (/Failed to fetch|NetworkError|load failed/i.test(raw)) {
    return "Network error — check connection. Static GitHub Pages cannot autosave; use Vercel or npm run dev.";
  }
  return raw.length > 120 ? `${raw.slice(0, 117)}…` : raw;
}

export function formatBuilderSaveLabel(
  saveState: BuilderSaveState,
  lastSaved: Date | null,
  now = new Date(),
): string {
  if (saveState === "saving") return "Saving…";
  if (saveState === "error") return "Couldn't save — try again";
  if (!lastSaved) return "Draft — changes autosave";
  const sec = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
  if (sec < 8) return "Saved just now";
  if (sec < 60) return `Saved ${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `Saved ${min}m ago`;
  return `Last saved ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}
