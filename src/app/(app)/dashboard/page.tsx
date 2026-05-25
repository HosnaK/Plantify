import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasReportForCurrentPeriod, seedStatus } from "@/lib/biweekly";
import { syncMissedFormNotifications } from "@/lib/notifications";
import { RegisterSeedPanel } from "@/components/RegisterSeedPanel";
import { SeedList } from "@/components/SeedList";
import type { GrowthReport, SeedWithProgress } from "@/lib/types";

const registerErrors: Record<string, string> = {
  missing_fields: "Seed code and plant name are required.",
  duplicate_seed: "You have already registered this seed code.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await searchParams;
  const registerError = error
    ? (registerErrors[error] ?? decodeURIComponent(error))
    : null;

  await syncMissedFormNotifications(user.id);

  const { data: seeds } = await supabase
    .from("seeds")
    .select("*")
    .eq("user_id", user.id)
    .order("registered_at", { ascending: false });

  const seedList = seeds ?? [];
  const seedIds = seedList.map((s) => s.id);

  let reports: GrowthReport[] = [];
  if (seedIds.length > 0) {
    const { data } = await supabase
      .from("growth_reports")
      .select("*")
      .in("seed_id", seedIds)
      .order("submitted_at", { ascending: false });
    reports = data ?? [];
  }

  const seedsWithProgress: SeedWithProgress[] = seedList.map((seed) => {
    const seedReports = reports.filter((r) => r.seed_id === seed.id);
    const { status, daysUntilDue } = seedStatus(seed.next_due_at);
    const period_complete = hasReportForCurrentPeriod(seedReports, seed);
    return {
      ...seed,
      reports: seedReports,
      report_count: seedReports.length,
      status,
      days_until_due: daysUntilDue,
      period_complete,
    };
  });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const name = profile?.full_name ?? user.email?.split("@")[0] ?? "Grower";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-emerald-950">Dashboard</h1>
        <p className="mt-1 text-emerald-900/70">Welcome back, {name}</p>
      </header>

      <RegisterSeedPanel errorMessage={registerError} key={error ?? "none"} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-emerald-950">Your registered seeds</h2>
        <SeedList seeds={seedsWithProgress} />
      </section>
    </div>
  );
}
