/**
 * Landing page images — Supabase Storage public URLs.
 *
 * 1. Dashboard → Storage → use a **public** bucket (or set bucket to public).
 * 2. Upload layout: homepage images in the bucket root (`why-seeds-plant.png`,
 *    `growing-made-easy-app.png`), team under `team/<slug>.<ext>` (default `.jpg`),
 *    trees under
 *    `trees/<tree-id>.<ext>` (defaults to `.jpg`; set per-tree extension in
 *    `OurTreesSection` when needed).
 * 3. Replace `YOUR_PROJECT_REF` with your project ref (Project Settings → API;
 *    it is the subdomain in `https://<ref>.supabase.co`).
 * 4. Replace `YOUR_PUBLIC_BUCKET` with your bucket name.
 *
 * Public object URL shape:
 * `https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<path>`
 */
export const LANDING_STORAGE_BASE =
  "https://zvsmfqrjphrckykjervw.supabase.co/storage/v1/object/public/website-assets";

export const LANDING_IMAGES = {
  /** “Why Seeds?” section — plant / lifestyle visual */
  whySeedsPlant: `${LANDING_STORAGE_BASE}/why-seeds-plant.png`,
  /** “Growing Made Easy” section — phone / app screenshot */
  growingMadeEasyApp: `${LANDING_STORAGE_BASE}/growing-made-easy-app.png`,
  /** Hero pitch video (Supabase Storage MP4) */
  heroVideo: `${LANDING_STORAGE_BASE}/plantify%20video.mp4`,
} as const;

export type TeamPhotoExtension = "jpg" | "jpeg" | "png" | "webp";

/** Team headshots under `team/<slug>.<ext>` (default `jpg`). */
export function teamPhotoUrl(slug: string, ext: TeamPhotoExtension = "jpg"): string {
  return `${LANDING_STORAGE_BASE}/team/${slug}.${ext}`;
}

type TreePhotoExtension = "jpg" | "jpeg" | "png" | "webp";

/** Our Trees cards: object key `trees/<treeId>.<ext>` (default `jpg`). */
export function treePhotoUrl(treeId: string, ext: TreePhotoExtension = "jpg"): string {
  return `${LANDING_STORAGE_BASE}/trees/${treeId}.${ext}`;
}
