import type { SeedSpecies } from "@/lib/types";

/** Supabase may return nested `seed_species` as object or single-element array. */
export function normalizeJoinedSpecies(
  row: SeedSpecies | SeedSpecies[] | null | undefined
): SeedSpecies | null {
  if (row == null) return null;
  return Array.isArray(row) ? (row[0] ?? null) : row;
}
