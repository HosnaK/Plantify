import type { SupabaseClient } from "@supabase/supabase-js";
import { codePrefixFromSeedCode } from "@/lib/seed-value";

/**
 * Sets `species_id` on every seed where the code prefix matches a library row
 * and `species_id` is still null. Call after admin catalogue changes so growers
 * do not need to reload the dashboard first.
 */
export async function linkAllUnlinkedSeedsGlobally(supabase: SupabaseClient): Promise<void> {
  const { data: species } = await supabase.from("seed_species").select("id, code_prefix");
  if (!species?.length) return;

  const prefixToId = new Map(
    species.map((row) => [String(row.code_prefix).trim().toUpperCase(), row.id])
  );

  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, seed_code")
    .is("species_id", null);
  if (!seeds?.length) return;

  for (const seed of seeds) {
    const prefix = codePrefixFromSeedCode(seed.seed_code);
    const speciesId = prefixToId.get(prefix);
    if (!speciesId) continue;
    await supabase.from("seeds").update({ species_id: speciesId }).eq("id", seed.id);
  }
}

/**
 * Sets `species_id` on the user's seeds when the code prefix matches a row in
 * `seed_species` but the FK was still null (e.g. library entry added after registration).
 */
export async function linkUnlinkedSeedsToSpecies(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { data: seeds } = await supabase
    .from("seeds")
    .select("id, seed_code, species_id")
    .eq("user_id", userId);

  const unlinked = (seeds ?? []).filter((s) => s.species_id == null);
  if (unlinked.length === 0) return;

  const { data: species } = await supabase.from("seed_species").select("id, code_prefix");
  if (!species?.length) return;

  const prefixToId = new Map(
    species.map((row) => [String(row.code_prefix).trim().toUpperCase(), row.id])
  );

  for (const seed of unlinked) {
    const prefix = codePrefixFromSeedCode(seed.seed_code);
    const speciesId = prefixToId.get(prefix);
    if (!speciesId) continue;

    await supabase.from("seeds").update({ species_id: speciesId }).eq("id", seed.id);
  }
}
