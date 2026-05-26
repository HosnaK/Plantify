import { requireAdmin } from "@/lib/admin";
import { SeedsTable } from "@/components/admin/SeedsTable";
import type { AdminSeedRow } from "@/lib/types";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();

  const { data: seeds, error } = await supabase
    .from("seeds")
    .select(
      `
      id,
      seed_code,
      plant_name,
      registered_at,
      admin_status,
      user_id,
      profiles (
        full_name,
        email
      )
    `
    )
    .order("registered_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 px-4 py-3 text-red-700">
        Failed to load seeds: {error.message}. Run migration 003_admin.sql and ensure your
        account has role &apos;admin&apos;.
      </div>
    );
  }

  const seedIds = (seeds ?? []).map((s) => s.id);
  const checkInCounts = new Map<string, number>();

  if (seedIds.length > 0) {
    const { data: reports } = await supabase
      .from("growth_reports")
      .select("seed_id")
      .in("seed_id", seedIds);

    for (const r of reports ?? []) {
      checkInCounts.set(r.seed_id, (checkInCounts.get(r.seed_id) ?? 0) + 1);
    }
  }

  const rows: AdminSeedRow[] = (seeds ?? []).map((seed) => {
    const profile = Array.isArray(seed.profiles) ? seed.profiles[0] : seed.profiles;
    return {
      id: seed.id,
      seed_code: seed.seed_code,
      plant_name: seed.plant_name,
      registered_at: seed.registered_at,
      admin_status: seed.admin_status,
      grower_name: profile?.full_name ?? null,
      grower_email: profile?.email ?? null,
      check_in_count: checkInCounts.get(seed.id) ?? 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">Seed registry</h1>
        <p className="mt-1 text-emerald-900/70">
          All registered seeds across growers. Click a row for the full check-in report.
        </p>
      </div>
      <SeedsTable seeds={rows} />
    </div>
  );
}
