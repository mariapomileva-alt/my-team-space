/** Shown on the public page when a block is enabled but has no coach content yet. */
export function BlockEmpty({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-[color:var(--mts-card-border)] bg-[var(--mts-accent-soft)]/40 px-4 py-6 text-center text-sm text-[color:var(--mts-muted)]">
      {message}
    </p>
  );
}
