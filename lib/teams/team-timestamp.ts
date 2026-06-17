export function parseTeamUpdatedAt(value: unknown): number | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

export function isTeamVersionNewer(next?: string, prev?: string): boolean {
  const nextMs = parseTeamUpdatedAt(next);
  const prevMs = parseTeamUpdatedAt(prev);
  if (nextMs == null || prevMs == null) return false;
  return nextMs > prevMs;
}
