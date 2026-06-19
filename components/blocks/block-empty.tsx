/** Shown on the public page when a block is enabled but has no coach content yet. */
export function BlockEmpty({ message }: { message: string }) {
  return (
    <p className="mts-block-empty rounded-2xl border border-[color:var(--mts-card-border)] bg-[color-mix(in_srgb,var(--mts-accent-soft)_25%,transparent)] px-5 py-10 text-center text-[15px] font-normal leading-relaxed text-[color:var(--mts-muted)]">
      {message}
    </p>
  );
}
