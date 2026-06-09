import type { ImagePreset } from "@/lib/media/image-presets";

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

function cropRect(bitmap: ImageBitmap, aspect: number) {
  const srcAspect = bitmap.width / bitmap.height;
  if (srcAspect > aspect) {
    const sh = bitmap.height;
    const sw = sh * aspect;
    return { sx: (bitmap.width - sw) / 2, sy: 0, sw, sh };
  }
  const sw = bitmap.width;
  const sh = sw / aspect;
  return { sx: 0, sy: (bitmap.height - sh) / 2, sw, sh };
}

function targetSize(preset: ImagePreset): { w: number; h: number } {
  const ratio = preset.aspectRatio ?? preset.maxWidth / preset.maxHeight;
  if (preset.fit === "contain" && preset.aspectRatio) {
    return { w: preset.maxWidth, h: Math.round(preset.maxWidth / ratio) };
  }
  const w = preset.maxWidth;
  const h = Math.round(w / ratio);
  return { w, h: Math.min(h, preset.maxHeight) };
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Compression failed"))), mime, quality);
  });
}

/** Resize, crop or letterbox to a preset, then compress in-browser before upload. */
export async function processImageFile(
  file: File,
  preset: ImagePreset,
  mime: "image/webp" | "image/jpeg" = "image/webp",
): Promise<{ blob: Blob; mime: string; extension: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.type === "image/svg+xml") {
    return { blob: file, mime: file.type, extension: "svg" };
  }

  const bitmap = await createImageBitmap(file);
  const quality = preset.quality ?? DEFAULTS.quality;
  const { w, h } = targetSize(preset);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image.");

  if (preset.fit === "contain") {
    ctx.fillStyle = preset.background ?? "#ffffff";
    ctx.fillRect(0, 0, w, h);
    const scale = Math.min(w / bitmap.width, h / bitmap.height);
    const dw = bitmap.width * scale;
    const dh = bitmap.height * scale;
    ctx.drawImage(bitmap, (w - dw) / 2, (h - dh) / 2, dw, dh);
  } else if (preset.aspectRatio) {
    const crop = cropRect(bitmap, preset.aspectRatio);
    ctx.drawImage(bitmap, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, w, h);
  } else {
    const scale = Math.min(1, w / bitmap.width, h / bitmap.height);
    const dw = Math.max(1, Math.round(bitmap.width * scale));
    const dh = Math.max(1, Math.round(bitmap.height * scale));
    canvas.width = dw;
    canvas.height = dh;
    ctx.drawImage(bitmap, 0, 0, dw, dh);
  }

  bitmap.close();

  const outMime = mime;
  const blob = await canvasToBlob(canvas, outMime, quality);
  return { blob, mime: outMime, extension: outMime === "image/webp" ? "webp" : "jpg" };
}

/** Resize + compress in-browser before upload (coach-friendly, saves bandwidth). */
export async function compressImageFile(
  file: File,
  options: CompressOptions = {},
): Promise<{ blob: Blob; mime: string; extension: string }> {
  const opts = { ...DEFAULTS, ...options };
  return processImageFile(
    file,
    {
      maxWidth: opts.maxWidth,
      maxHeight: opts.maxHeight,
      quality: opts.quality,
      fit: "cover",
    },
    opts.mime,
  );
}
