export function growthPhotoUrl(photoPath: string | null): string | null {
  if (!photoPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/growth-photos/${photoPath}`;
}

/** Display URLs for check-in images (uses `photo_urls` when set, else legacy `photo_path`). */
export function reportPhotoUrls(report: {
  photo_urls?: string[] | null;
  photo_path: string | null;
}): string[] {
  const urls = report.photo_urls?.filter((u) => typeof u === "string" && u.length > 0) ?? [];
  if (urls.length > 0) return urls;
  const legacy = growthPhotoUrl(report.photo_path);
  return legacy ? [legacy] : [];
}
