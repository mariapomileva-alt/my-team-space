/** Shared type scale for team app, blocks, and builder preview (Inter / font-sans). */

export const mtsTypeTitle =
  "font-sans text-balance font-semibold leading-snug tracking-normal text-[color:var(--mts-text)]";

export const mtsTypeTitleXs = `${mtsTypeTitle} text-[13px]`;
export const mtsTypeTitleSm = `${mtsTypeTitle} text-[15px]`;
export const mtsTypeTitleMd = `${mtsTypeTitle} text-base sm:text-lg`;
export const mtsTypeTitleLg = `${mtsTypeTitle} text-[17px] sm:text-xl`;

export const mtsTypeBody = "font-sans text-sm font-normal leading-relaxed tracking-normal text-[color:var(--mts-muted)]";
export const mtsTypeBodySm = "font-sans text-xs font-normal leading-normal tracking-normal text-[color:var(--mts-muted)]";
export const mtsTypePlaceholder =
  "font-sans text-xs font-normal leading-normal tracking-normal text-[color:var(--mts-muted)]";

export const mtsTypeLabel =
  "font-sans text-[10px] font-semibold uppercase tracking-wider text-[color:var(--mts-muted)]";

/** Club website section heading — dominant, brand voice. */
export const mtsTypeSectionTitle =
  "font-[family-name:var(--font-brand)] text-[17px] font-bold leading-tight tracking-tight text-[color:var(--mts-text)] sm:text-[1.125rem]";

/** Primary item under a section (e.g. next training, lead contact). */
export const mtsTypeItemTitle =
  "font-sans text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[color:var(--mts-text)] sm:text-[16px]";

/** Secondary line under a section title or content headline. */
export const mtsTypeSectionLead =
  "font-sans text-[14px] font-medium leading-snug text-[color:var(--mts-text)] sm:text-[15px]";

/** Metadata: time, location, role — legible but quieter. */
export const mtsTypeSectionMeta =
  "font-sans text-[12px] font-medium leading-snug text-[color:color-mix(in_srgb,var(--mts-muted)_90%,var(--mts-text))] sm:text-[13px]";

/** Tertiary note — smallest readable tier. */
export const mtsTypeSectionNote =
  "font-sans text-[11px] font-normal leading-relaxed text-[color:var(--mts-muted)]";

/** Section tap affordance on the right. */
export const mtsTypeSectionAction =
  "font-sans text-[13px] font-semibold leading-none text-[color:color-mix(in_srgb,var(--mts-muted)_75%,var(--mts-text))] transition-colors group-hover:text-[color:var(--mts-primary)] group-active:text-[color:var(--mts-primary)]";

/** @deprecated use mtsTypeSectionAction */
export const mtsTypeSectionLink = mtsTypeSectionAction;
