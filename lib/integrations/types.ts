export type IntegrationCardVariant = "compact" | "featured" | "tile";

export type IntegrationCategory =
  | "fitness"
  | "calendar"
  | "photos"
  | "video"
  | "social"
  | "chat"
  | "music"
  | "docs"
  | "design"
  | "sports"
  | "other";

export type IntegrationPreviewStat = {
  label: string;
  value: string;
};

export type IntegrationPreview = {
  headline?: string;
  subline?: string;
  stats?: IntegrationPreviewStat[];
  thumbnailUrl?: string;
  duration?: string;
  chips?: string[];
  /** Instagram-style post placeholders */
  postSwatches?: string[];
};

export type IntegrationLink = {
  id: string;
  url: string;
  label?: string;
  description?: string;
  providerId?: string;
  variant?: IntegrationCardVariant;
  /** Force featured layout (first link defaults to featured when unset) */
  featured?: boolean;
};
