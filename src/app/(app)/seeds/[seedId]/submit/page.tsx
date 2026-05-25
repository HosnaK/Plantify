import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { currentPeriod } from "@/lib/biweekly";
import { submitGrowthReport } from "@/lib/actions";

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

      <form
        action={submitGrowthReport}
        encType="multipart/form-data"
        className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="seed_id" value={seedId} />

        <div>
          <label htmlFor="height_cm" className="mb-1 block text-sm font-medium">
            Height (cm)
          </label>
          <input
            id="height_cm"
            name="height_cm"
            type="number"
            step="0.1"
            min="0"
            placeholder="42.5"
            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-emerald-500 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Leaf color, pests, irrigation changes…"
            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-emerald-500 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="photo" className="mb-1 block text-sm font-medium">
            Growth photo
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            className="w-full text-sm text-emerald-900 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:font-semibold file:text-emerald-800"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Submit check-in
        </button>
      </form>
    </div>
  );
}
