export type ImageFitMode = "cover" | "contain";

export type ImagePreset = {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
  fit: ImageFitMode;
  /** Target width / height (e.g. 1 = square, 2.5 = wide banner). */
  aspectRatio?: number;
  background?: string;
};

export const IMAGE_PRESETS = {
  logo: {
    maxWidth: 512,
    maxHeight: 512,
    fit: "contain",
    aspectRatio: 1,
    quality: 0.88,
    background: "#ffffff",
  },
  cover: {
    maxWidth: 1600,
    maxHeight: 640,
    fit: "cover",
    aspectRatio: 21 / 9,
    quality: 0.85,
  },
  gallery: {
    maxWidth: 1200,
    maxHeight: 1200,
    fit: "cover",
    aspectRatio: 1,
    quality: 0.85,
  },
  shop: {
    maxWidth: 800,
    maxHeight: 1000,
    fit: "cover",
    aspectRatio: 4 / 5,
    quality: 0.85,
  },
  media: {
    maxWidth: 1600,
    maxHeight: 1600,
    fit: "cover",
    quality: 0.82,
  },
} as const satisfies Record<string, ImagePreset>;

export type MediaDisplayRole = "logo" | "cover" | "gallery" | "shop" | "avatar";

export function presetForUpload(
  folder: string,
  aspect?: "square" | "wide" | "portrait" | "auto",
): ImagePreset {
  switch (folder) {
    case "logos":
      return IMAGE_PRESETS.logo;
    case "hero":
      return IMAGE_PRESETS.cover;
    case "gallery":
      return IMAGE_PRESETS.gallery;
    case "shop":
      return IMAGE_PRESETS.shop;
    default:
      if (aspect === "square") return IMAGE_PRESETS.gallery;
      if (aspect === "wide") return IMAGE_PRESETS.cover;
      if (aspect === "portrait") return IMAGE_PRESETS.shop;
      return IMAGE_PRESETS.media;
  }
}

export function displayRoleForUpload(
  folder: string,
  aspect?: "square" | "wide" | "portrait" | "auto",
): MediaDisplayRole {
  switch (folder) {
    case "logos":
      return "logo";
    case "hero":
      return "cover";
    case "gallery":
      return "gallery";
    case "shop":
      return "shop";
    default:
      if (aspect === "square") return "gallery";
      if (aspect === "wide") return "cover";
      if (aspect === "portrait") return "shop";
      return "gallery";
  }
}

export function uploadHintForPreset(preset: ImagePreset, folder: string): string {
  if (folder === "logos") return "Any shape — we fit it inside a square frame.";
  if (folder === "hero") return "Wide banner — cropped to a consistent ratio.";
  if (folder === "gallery") return "Square crop, centered.";
  if (folder === "shop") return "Portrait crop (4:5), centered.";
  if (preset.aspectRatio && preset.aspectRatio !== 1) return "Auto-cropped to fit.";
  return "Auto-compressed on upload.";
}
