/** Normalize coach-pasted links for safe external navigation. */
export function toExternalHref(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  if (/^mailto:/i.test(t) || /^tel:/i.test(t)) return t;
  return `https://${t}`;
}
