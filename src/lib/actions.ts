"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { currentPeriod, nextDueFrom } from "@/lib/biweekly";
import { syncMissedFormNotifications } from "@/lib/notifications";
import { codePrefixFromSeedCode } from "@/lib/seed-value";

export async function registerSeed(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const seedCode = String(formData.get("seed_code") ?? "").trim().toUpperCase();
  const plantName = String(formData.get("plant_name") ?? "").trim();

  if (!seedCode || !plantName) {
    redirect("/dashboard?error=missing_fields");
  }

  const { data: speciesMatch } = await supabase
    .from("seed_species")
    .select("id")
    .eq("code_prefix", codePrefixFromSeedCode(seedCode))
    .maybeSingle();

  const now = new Date();
  const { error } = await supabase.from("seeds").insert({
    user_id: user.id,
    seed_code: seedCode,
    plant_name: plantName,
    registered_at: now.toISOString(),
    next_due_at: nextDueFrom(now).toISOString(),
    species_id: speciesMatch?.id ?? null,
  });

  if (error) {
    const code =
      error.code === "23505" ? "duplicate_seed" : encodeURIComponent(error.message);
    redirect(`/dashboard?error=${code}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function submitGrowthReport(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const seedId = String(formData.get("seed_id") ?? "");
  const sproutedRaw = String(formData.get("has_sprouted") ?? "");
  const heightRaw = String(formData.get("height_cm") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const leafColor = String(formData.get("leaf_color") ?? "").trim() || null;
  const pests = String(formData.get("pests") ?? "").trim() || null;
  const pestsOther = String(formData.get("pests_other") ?? "").trim() || null;

  const rawPhotos = formData.getAll("photos");
  const photoFiles: File[] = [];
  for (const item of rawPhotos) {
    if (item instanceof File && item.size > 0) photoFiles.push(item);
  }

  if (sproutedRaw !== "yes" && sproutedRaw !== "no") {
    redirect(
      `/seeds/${seedId}/submit?error=${encodeURIComponent("Please indicate if your seed has sprouted.")}`
    );
  }

  const hasSprouted = sproutedRaw === "yes";

  if (hasSprouted) {
    if (!leafColor || !["green", "yellow", "brown"].includes(leafColor)) {
      redirect(
        `/seeds/${seedId}/submit?error=${encodeURIComponent("Please select a leaf color.")}`
      );
    }
    if (!pests || !["yes", "no", "other"].includes(pests)) {
      redirect(
        `/seeds/${seedId}/submit?error=${encodeURIComponent("Please answer the pests question.")}`
      );
    }
    if (pests === "other" && !pestsOther) {
      redirect(
        `/seeds/${seedId}/submit?error=${encodeURIComponent("Please explain the pests you noticed.")}`
      );
    }
  }

  if (photoFiles.length < 1 || photoFiles.length > 3) {
    redirect(
      `/seeds/${seedId}/submit?error=${encodeURIComponent("Please upload 1 to 3 photos for this check-in.")}`
    );
  }

  for (const file of photoFiles) {
    if (!file.type.startsWith("image/")) {
      redirect(
        `/seeds/${seedId}/submit?error=${encodeURIComponent("Each upload must be an image file (JPEG, PNG, WebP, etc.).")}`
      );
    }
  }

  const { data: seed, error: seedError } = await supabase
    .from("seeds")
    .select("*")
    .eq("id", seedId)
    .eq("user_id", user.id)
    .single();

  if (seedError || !seed) {
    redirect("/dashboard?error=seed_not_found");
  }

  const uploadedPaths: string[] = [];

  try {
    for (let i = 0; i < photoFiles.length; i++) {
      const photo = photoFiles[i]!;
      const ext = photo.name.split(".").pop() ?? "jpg";
      const safeExt = /^[a-z0-9]+$/i.test(ext) ? ext.toLowerCase() : "jpg";
      const fileName = `${user.id}/${seedId}/${Date.now()}_${i}.${safeExt}`;
      const { error: uploadError } = await supabase.storage
        .from("growth-photos")
        .upload(fileName, photo, {
          upsert: false,
          contentType: photo.type || "image/jpeg",
        });

      if (uploadError) {
        throw new Error(
          `Photo upload failed: ${uploadError.message}. Check your connection and file size, then try again.`
        );
      }
      uploadedPaths.push(fileName);
    }

    const photoUrls = uploadedPaths.map((path) => {
      const { data } = supabase.storage.from("growth-photos").getPublicUrl(path);
      return data.publicUrl;
    });

    const { periodStart, periodEnd } = currentPeriod(seed);
    const submittedAt = new Date();

    const { error: reportError } = await supabase.from("growth_reports").insert({
      seed_id: seedId,
      user_id: user.id,
      height_cm: hasSprouted && heightRaw ? Number(heightRaw) : null,
      notes: hasSprouted ? notes : null,
      photo_path: uploadedPaths[0] ?? null,
      photo_urls: photoUrls,
      has_sprouted: hasSprouted,
      leaf_color: hasSprouted ? leafColor : null,
      pests: hasSprouted ? pests : null,
      pests_other: hasSprouted && pests === "other" ? pestsOther : null,
      submitted_at: submittedAt.toISOString(),
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
    });

    if (reportError) {
      throw new Error(
        `Could not save your check-in: ${reportError.message}. Your photos were not saved; try again or contact support.`
      );
    }

    await supabase
      .from("seeds")
      .update({ next_due_at: nextDueFrom(submittedAt).toISOString() })
      .eq("id", seedId);

    await supabase
      .from("notifications")
      .delete()
      .eq("user_id", user.id)
      .eq("seed_id", seedId)
      .in("type", ["missed_form", "form_due_soon"])
      .eq("read", false);

    await syncMissedFormNotifications(user.id);
  } catch (err) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from("growth-photos").remove(uploadedPaths);
    }
    const message =
      err instanceof Error ? err.message : "Something went wrong while saving your check-in.";
    redirect(`/seeds/${seedId}/submit?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/seeds/${seedId}/submit`);
  revalidatePath(`/seeds/${seedId}/report`);
  redirect("/dashboard");
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
}
