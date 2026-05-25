"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { currentPeriod, nextDueFrom } from "@/lib/biweekly";
import { syncMissedFormNotifications } from "@/lib/notifications";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

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

  const now = new Date();
  const { error } = await supabase.from("seeds").insert({
    user_id: user.id,
    seed_code: seedCode,
    plant_name: plantName,
    registered_at: now.toISOString(),
    next_due_at: nextDueFrom(now).toISOString(),
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
  const heightRaw = String(formData.get("height_cm") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const photo = formData.get("photo") as File | null;

  const { data: seed, error: seedError } = await supabase
    .from("seeds")
    .select("*")
    .eq("id", seedId)
    .eq("user_id", user.id)
    .single();

  if (seedError || !seed) {
    redirect("/dashboard?error=seed_not_found");
  }

  let photoPath: string | null = null;
  if (photo && photo.size > 0) {
    const ext = photo.name.split(".").pop() ?? "jpg";
    const fileName = `${user.id}/${seedId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("growth-photos")
      .upload(fileName, photo, { upsert: false });

    if (uploadError) {
      redirect(
        `/seeds/${seedId}/submit?error=${encodeURIComponent(uploadError.message)}`
      );
    }
    photoPath = fileName;
  }

  const { periodStart, periodEnd } = currentPeriod(seed);
  const submittedAt = new Date();

  const { error: reportError } = await supabase.from("growth_reports").insert({
    seed_id: seedId,
    user_id: user.id,
    height_cm: heightRaw ? Number(heightRaw) : null,
    notes,
    photo_path: photoPath,
    submitted_at: submittedAt.toISOString(),
    period_start: periodStart.toISOString(),
    period_end: periodEnd.toISOString(),
  });

  if (reportError) {
    redirect(
      `/seeds/${seedId}/submit?error=${encodeURIComponent(reportError.message)}`
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

  revalidatePath("/dashboard");
  revalidatePath(`/seeds/${seedId}/submit`);
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
