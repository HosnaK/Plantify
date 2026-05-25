import { addDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { hasReportForCurrentPeriod, isFormOverdue } from "@/lib/biweekly";
import type { GrowthReport, Seed } from "@/lib/types";

export async function syncMissedFormNotifications(userId: string) {
  const supabase = await createClient();

  const { data: seeds } = await supabase
    .from("seeds")
    .select("*")
    .eq("user_id", userId);

  if (!seeds?.length) return;

  const seedIds = seeds.map((s) => s.id);
  const { data: reports } = await supabase
    .from("growth_reports")
    .select("*")
    .in("seed_id", seedIds)
    .order("submitted_at", { ascending: false });

  const reportsBySeed = new Map<string, GrowthReport[]>();
  for (const report of reports ?? []) {
    const list = reportsBySeed.get(report.seed_id) ?? [];
    list.push(report);
    reportsBySeed.set(report.seed_id, list);
  }

  for (const seed of seeds as Seed[]) {
    const seedReports = reportsBySeed.get(seed.id) ?? [];

    if (!isFormOverdue(seed.next_due_at)) {
      await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId)
        .eq("seed_id", seed.id)
        .eq("type", "missed_form")
        .eq("read", false);
      continue;
    }

    if (hasReportForCurrentPeriod(seedReports, seed)) {
      await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId)
        .eq("seed_id", seed.id)
        .eq("type", "missed_form")
        .eq("read", false);
      continue;
    }

    const daysLate = Math.ceil(
      (Date.now() - new Date(seed.next_due_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", userId)
      .eq("seed_id", seed.id)
      .eq("type", "missed_form")
      .eq("read", false)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("notifications")
        .update({
          message: `Biweekly growth form for "${seed.plant_name}" (${seed.seed_code}) is ${daysLate} day${daysLate === 1 ? "" : "s"} overdue.`,
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("notifications").insert({
        user_id: userId,
        seed_id: seed.id,
        type: "missed_form",
        message: `Biweekly growth form for "${seed.plant_name}" (${seed.seed_code}) is ${daysLate} day${daysLate === 1 ? "" : "s"} overdue.`,
      });
    }

    const dueSoonAt = addDays(new Date(seed.next_due_at), -3);
    if (Date.now() >= dueSoonAt.getTime() && !isFormOverdue(seed.next_due_at)) {
      const { data: dueSoon } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", userId)
        .eq("seed_id", seed.id)
        .eq("type", "form_due_soon")
        .eq("read", false)
        .maybeSingle();

      if (!dueSoon) {
        await supabase.from("notifications").insert({
          user_id: userId,
          seed_id: seed.id,
          type: "form_due_soon",
          message: `Growth form for "${seed.plant_name}" is due soon.`,
        });
      }
    }
  }
}
