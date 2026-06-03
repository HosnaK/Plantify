import { requireAdmin } from "@/lib/admin";
import { SeedLibraryTable } from "@/components/admin/SeedLibraryTable";
import type { SeedSpecies } from "@/lib/types";

export default async function AdminSeedLibraryPage() {
  const { supabase } = await requireAdmin();

  const { data: species, error } = await supabase
    .from("seed_species")
    .select("*")
    .order("code_prefix", { ascending: true });

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 px-4 py-3 text-red-700">
        Could not load seed library: {error.message}. Run migration{" "}
        <code className="rounded bg-red-100 px-1">004_seed_species.sql</code> in Supabase.
      </div>
    );
  }

  const rows = (species ?? []) as SeedSpecies[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-950">Seed library</h1>
        <p className="mt-1 text-emerald-900/70">
          Species catalogue used to match grower seed codes by prefix (e.g.{" "}
          <span className="font-mono">OAK</span> in <span className="font-mono">OAK-2024-001</span>
          ). Growers see estimated buyback value on the dashboard when a species matches.
        </p>
      </div>
      <SeedLibraryTable initialSpecies={rows} />
    </div>
  );
}
