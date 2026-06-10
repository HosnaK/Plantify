"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { GrowingExperience, GrowingSpace } from "@/lib/types";

const EXP: GrowingExperience[] = ["Total Beginner", "Intermediate", "Expert"];
const SPACE: GrowingSpace[] = [
  "Balcony",
  "Indoor windowsill",
  "Garden",
  "Greenhouse",
  "Other",
];

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const full_name = String(formData.get("full_name") ?? "").trim();
  const ageRaw = Number(formData.get("age"));
  const occupation = String(formData.get("occupation") ?? "").trim();
  const growing_experience = String(formData.get("growing_experience") ?? "") as GrowingExperience;
  const growing_space = String(formData.get("growing_space") ?? "") as GrowingSpace;

  if (!full_name) {
    redirect("/profile?error=" + encodeURIComponent("Full name is required."));
  }
  if (!Number.isFinite(ageRaw) || ageRaw < 18) {
    redirect("/profile?error=" + encodeURIComponent("Age must be 18 or older."));
  }
  if (!occupation) {
    redirect("/profile?error=" + encodeURIComponent("Occupation is required."));
  }
  if (!EXP.includes(growing_experience)) {
    redirect("/profile?error=" + encodeURIComponent("Please select your growing experience."));
  }
  if (!SPACE.includes(growing_space)) {
    redirect("/profile?error=" + encodeURIComponent("Please select your growing space."));
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name,
      age: ageRaw,
      occupation,
      growing_experience,
      growing_space,
    })
    .eq("id", user.id);

  if (error) {
    redirect("/profile?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  redirect("/profile?saved=1");
}
