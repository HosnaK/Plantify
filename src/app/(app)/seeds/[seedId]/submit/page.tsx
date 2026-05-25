import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { currentPeriod } from "@/lib/biweekly";
import { CheckInForm } from "@/components/CheckInForm";

export default async function SubmitGrowthPage({
  params,
  searchParams,
}: {
  params: Promise<{ seedId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { seedId } = await params;
  const { error } = await searchParams;
  const errorMessage = error ? decodeURIComponent(error) : null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: seed } = await supabase
    .from("seeds")
    .select("*")
    .eq("id", seedId)
    .eq("user_id", user.id)
    .single();

  if (!seed) notFound();

  const { periodStart, periodEnd } = currentPeriod(seed);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm text-emerald-700 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-emerald-950">Biweekly check-in</h1>
        <p className="mt-1 text-emerald-900/70">
          {seed.plant_name} · <span className="font-mono">{seed.seed_code}</span>
        </p>
        <p className="mt-2 text-sm text-emerald-800/80">
          Reporting period: {format(periodStart, "MMM d")} – {format(periodEnd, "MMM d, yyyy")}
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      )}

      <CheckInForm seedId={seedId} />
    </div>
  );
}
