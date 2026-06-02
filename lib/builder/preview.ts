/** Compact builder preview dimensions (~30% narrower than previous 480px phone). */

export const BUILDER_PREVIEW_COLUMN_W = 340;

/** Mobile phone frame */
export const BUILDER_PHONE_W = 280;
export const BUILDER_PHONE_H = 520;
export const BUILDER_PHONE_NOTCH_H = 22;
export const BUILDER_PHONE_HOME_H = 18;
export const BUILDER_PHONE_VIEWPORT_H =
  BUILDER_PHONE_H - BUILDER_PHONE_NOTCH_H - BUILDER_PHONE_HOME_H;

/** Desktop browser chrome preview */
export const BUILDER_DESKTOP_FRAME_H = 380;
export const BUILDER_DESKTOP_CHROME_H = 32;

export type BuilderPreviewMode = "mobile" | "desktop";

export const BUILDER_PREVIEW_MODE_STORAGE_KEY = "mts-builder-preview-mode";

export function readStoredPreviewMode(): BuilderPreviewMode {
  if (typeof window === "undefined") return "mobile";
  try {
    const v = localStorage.getItem(BUILDER_PREVIEW_MODE_STORAGE_KEY);
    if (v === "mobile" || v === "desktop") return v;
  } catch {
    /* ignore */
  }
  return "mobile";
}

export function storePreviewMode(mode: BuilderPreviewMode) {
  try {
    localStorage.setItem(BUILDER_PREVIEW_MODE_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}
