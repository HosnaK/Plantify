import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { requireAdmin, adminStatusLabel } from "@/lib/admin";
import { AdminStatusSelect } from "@/components/admin/AdminStatusSelect";
import { CheckInTimeline } from "@/components/admin/CheckInTimeline";
import type { GrowthReport, SeedAdminStatus } from "@/lib/types";

export default async function AdminSeedReportPage({
  params,
}: {
  params: Promise<{ seedId: string }>;
}) {
  const { seedId } = await params;
  const { supabase } = await requireAdmin();

  const { data: seed } = await supabase
    .from("seeds")
    .select(
      `
      *,
      profiles (
        full_name,
        email
      )
    `
    )
    .eq("id", seedId)
    .single();

  if (!seed) notFound();

  const profile = Array.isArray(seed.profiles) ? seed.profiles[0] : seed.profiles;

  const { data: reports } = await supabase
    .from("growth_reports")
    .select("*")
    .eq("seed_id", seedId)
    .order("submitted_at", { ascending: true });

  const chronological = (reports ?? []) as GrowthReport[];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm font-medium text-emerald-700 hover:underline">
          ← Back to all seeds
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-mono text-2xl font-bold text-emerald-950 sm:text-3xl">
              {seed.seed_code}
            </h1>
            <p className="mt-1 text-lg text-emerald-900/80">{seed.plant_name}</p>
          </div>
          <div className="min-w-[12rem]">
            <p className="mb-1 text-xs font-medium text-emerald-900/60">Status</p>
            <AdminStatusSelect
              seedId={seed.id}
              currentStatus={seed.admin_status as SeedAdminStatus}
            />
          </div>
        </div>
      </div>

      <section className="grid gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-emerald-900/60">Grower</p>
          <p className="font-semibold text-emerald-950">{profile?.full_name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-emerald-900/60">Email</p>
          <p className="break-all font-semibold text-emerald-950">{profile?.email ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-emerald-900/60">Registered</p>
          <p className="font-semibold text-emerald-950">
            {format(new Date(seed.registered_at), "MMM d, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-xs text-emerald-900/60">Pipeline status</p>
          <p className="font-semibold text-emerald-950">
            {adminStatusLabel(seed.admin_status as SeedAdminStatus)}
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-emerald-950">
          Biweekly check-ins ({chronological.length})
        </h2>
        <p className="mb-6 text-sm text-emerald-900/60">Oldest to newest</p>
        <CheckInTimeline reports={chronological} />
      </section>
    </div>
  );
}
