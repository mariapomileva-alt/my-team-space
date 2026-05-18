export type CompressOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mime?: "image/webp" | "image/jpeg";
};

const DEFAULTS: Required<CompressOptions> = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  mime: "image/webp",
};

/** Resize + compress in-browser before upload (coach-friendly, saves bandwidth). */
export async function compressImageFile(
  file: File,
  options: CompressOptions = {},
): Promise<{ blob: Blob; mime: string; extension: string }> {
  const opts = { ...DEFAULTS, ...options };
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.type === "image/svg+xml") {
    return { blob: file, mime: file.type, extension: "svg" };
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, opts.maxWidth / bitmap.width, opts.maxHeight / bitmap.height);
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const mime = opts.mime;
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Compression failed"))),
      mime,
      opts.quality,
    );
  });

  return { blob, mime, extension: mime === "image/webp" ? "webp" : "jpg" };
}
