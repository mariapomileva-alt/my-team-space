/** Detect album URLs coaches paste — show grid embed where possible */
export function isGooglePhotosAlbumUrl(url: string): boolean {
  return /photos\.google\.com|photos\.app\.goo\.gl/i.test(url);
}

export function isGoogleDriveFolderUrl(url: string): boolean {
  return /drive\.google\.com\/.*\/folders\//i.test(url);
}

export function galleryEmbedSrc(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  if (isGoogleDriveFolderUrl(u)) {
    const id = u.match(/folders\/([a-zA-Z0-9_-]+)/)?.[1];
    if (id) return `https://drive.google.com/embeddedfolderview?id=${id}#grid`;
  }
  return null;
}
