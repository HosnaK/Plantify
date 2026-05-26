import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { CheckInProgress } from "@/components/CheckInProgress";
import { CheckInTimeline } from "@/components/CheckInTimeline";
import type { GrowthReport } from "@/lib/types";

export default async function SeedReportPage({
  params,
}: {
  params: Promise<{ seedId: string }>;
}) {
  const { seedId } = await params;
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

  const { data: reports } = await supabase
    .from("growth_reports")
    .select("*")
    .eq("seed_id", seedId)
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: true });

  const chronological = (reports ?? []) as GrowthReport[];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/dashboard" className="text-sm font-medium text-emerald-700 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-emerald-950">Growth report</h1>
        <p className="mt-1 text-emerald-900/70">
          <span className="font-mono font-medium text-emerald-800">{seed.seed_code}</span>
          {" · "}
          {seed.plant_name}
        </p>
        <p className="mt-1 text-sm text-emerald-900/60">
          Registered {format(new Date(seed.registered_at), "MMMM d, yyyy")}
        </p>
      </div>

      <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-emerald-950">Your progress</h2>
        <CheckInProgress reportCount={chronological.length} registeredAt={seed.registered_at} />
        <p className="mt-3 text-sm text-emerald-900/60">
          {chronological.length === 0
            ? "Submit your first biweekly check-in to start your growth report."
            : `${chronological.length} check-in${chronological.length === 1 ? "" : "s"} on record.`}
        </p>
        <Link
          href={`/seeds/${seedId}/submit`}
          className="mt-4 inline-block rounded-xl bg-[#1b3d3a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#152f2c]"
        >
          Submit check-in
        </Link>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-emerald-950">Check-in history</h2>
        <p className="mb-6 text-sm text-emerald-900/60">Oldest to newest</p>
        <CheckInTimeline reports={chronological} />
      </section>
    </div>
  );
}
