"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { linkAllUnlinkedSeedsGlobally } from "@/lib/link-seed-species";
import type { DifficultyLevel } from "@/lib/types";

const difficulties: DifficultyLevel[] = ["Easy", "Medium", "Hard"];

function parseSpeciesForm(formData: FormData) {
  const plant_name = String(formData.get("plant_name") ?? "").trim();
  const code_prefix = String(formData.get("code_prefix") ?? "")
    .trim()
    .toUpperCase();
  const buyback_period_weeks = Number(formData.get("buyback_period_weeks"));
  const seed_price = Number(formData.get("seed_price"));
  const full_buyback_price = Number(formData.get("full_buyback_price"));
  const difficulty_level = String(formData.get("difficulty_level") ?? "") as DifficultyLevel;
  const environment_preferences = String(formData.get("environment_preferences") ?? "").trim();

  return {
    plant_name,
    code_prefix,
    buyback_period_weeks,
    seed_price,
    full_buyback_price,
    difficulty_level,
    environment_preferences,
  };
}

function validateSpeciesInput(p: ReturnType<typeof parseSpeciesForm>): string | null {
  if (!p.plant_name) return "Plant name is required.";
  if (!p.code_prefix) return "Code prefix is required.";
  if (!Number.isFinite(p.buyback_period_weeks) || p.buyback_period_weeks <= 0) {
    return "Buyback period (weeks) must be a positive number.";
  }
  if (!Number.isFinite(p.seed_price) || p.seed_price < 0) return "Seed price must be zero or greater.";
  if (!Number.isFinite(p.full_buyback_price) || p.full_buyback_price < 0) {
    return "Full buyback price must be zero or greater.";
  }
  if (!difficulties.includes(p.difficulty_level)) return "Invalid difficulty level.";
  return null;
}

export async function createSeedSpecies(formData: FormData) {
  const { supabase } = await requireAdmin();
  const p = parseSpeciesForm(formData);
  const err = validateSpeciesInput(p);
  if (err) return { error: err };

  const { error } = await supabase.from("seed_species").insert({
    plant_name: p.plant_name,
    code_prefix: p.code_prefix,
    buyback_period_weeks: p.buyback_period_weeks,
    seed_price: p.seed_price,
    full_buyback_price: p.full_buyback_price,
    difficulty_level: p.difficulty_level,
    environment_preferences: p.environment_preferences,
  });

  if (error) {
    if (error.code === "23505") return { error: "That code prefix is already in use." };
    return { error: error.message };
  }

  await linkAllUnlinkedSeedsGlobally(supabase);

  revalidatePath("/admin/library");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateSeedSpecies(speciesId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const p = parseSpeciesForm(formData);
  const err = validateSpeciesInput(p);
  if (err) return { error: err };

  const { error } = await supabase
    .from("seed_species")
    .update({
      plant_name: p.plant_name,
      code_prefix: p.code_prefix,
      buyback_period_weeks: p.buyback_period_weeks,
      seed_price: p.seed_price,
      full_buyback_price: p.full_buyback_price,
      difficulty_level: p.difficulty_level,
      environment_preferences: p.environment_preferences,
    })
    .eq("id", speciesId);

  if (error) {
    if (error.code === "23505") return { error: "That code prefix is already in use." };
    return { error: error.message };
  }

  await linkAllUnlinkedSeedsGlobally(supabase);

  revalidatePath("/admin/library");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteSeedSpecies(speciesId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("seed_species").delete().eq("id", speciesId);

  if (error) return { error: error.message };

  revalidatePath("/admin/library");
  revalidatePath("/dashboard");
  return { success: true };
}
