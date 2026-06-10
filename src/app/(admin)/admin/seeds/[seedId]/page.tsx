import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { requireAdmin, adminStatusLabel } from "@/lib/admin";
import { linkUnlinkedSeedsToSpecies } from "@/lib/link-seed-species";
import { AdminStatusSelect } from "@/components/admin/AdminStatusSelect";
import { CheckInTimeline } from "@/components/CheckInTimeline";
import { EstimatedValueBlock } from "@/components/EstimatedValueBlock";
import { normalizeJoinedSpecies } from "@/lib/seed-species-normalize";
import type { GrowthReport, SeedAdminStatus, SeedSpecies } from "@/lib/types";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default async function AdminSeedReportPage({
  params,
}: {
  params: Promise<{ seedId: string }>;
}) {
  const { seedId } = await params;
  const { supabase } = await requireAdmin();

  const { data: seedMeta } = await supabase
    .from("seeds")
    .select("user_id")
    .eq("id", seedId)
    .maybeSingle();
  if (seedMeta?.user_id) {
    await linkUnlinkedSeedsToSpecies(supabase, seedMeta.user_id);
  }

  const { data: seed } = await supabase
    .from("seeds")
    .select(
      `
      *,
      seed_species (*),
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
  const species = normalizeJoinedSpecies(
    seed.seed_species as SeedSpecies | SeedSpecies[] | null | undefined
  );

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

      <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-emerald-950">Seed library match</h2>
        {species ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-emerald-900/60">Catalogue plant</p>
              <p className="font-semibold text-emerald-950">{species.plant_name}</p>
              <p className="font-mono text-sm text-emerald-700">{species.code_prefix}</p>
            </div>
            <div>
              <p className="text-xs text-emerald-900/60">Buyback window</p>
              <p className="font-semibold text-emerald-950">{species.buyback_period_weeks} weeks</p>
              <p className="text-xs text-emerald-900/55">
                Seed {usd.format(Number(species.seed_price))} → full buyback{" "}
                {usd.format(Number(species.full_buyback_price))}
              </p>
            </div>
            <div>
              <p className="text-xs text-emerald-900/60">Difficulty</p>
              <p className="font-semibold text-emerald-950">{species.difficulty_level}</p>
            </div>
            {species.environment_preferences ? (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-xs text-emerald-900/60">Environment</p>
                <p className="text-sm text-emerald-900/80">{species.environment_preferences}</p>
              </div>
            ) : null}
            <div className="sm:col-span-2 lg:col-span-3 border-t border-emerald-50 pt-4">
              <p className="mb-2 text-xs font-medium text-emerald-900/60">Grower-facing estimate</p>
              <EstimatedValueBlock species={species} checkInCount={chronological.length} />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-emerald-900/70">
            No species in the library matches this seed code prefix yet. Add or adjust a prefix in{" "}
            <Link href="/admin/library" className="font-medium text-emerald-800 underline">
              Seed library
            </Link>{" "}
            so the grower sees buyback progress on their dashboard.
          </p>
        )}
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
