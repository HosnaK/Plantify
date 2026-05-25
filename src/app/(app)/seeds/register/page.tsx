import Link from "next/link";
import { registerSeed } from "@/lib/actions";

const errorMessages: Record<string, string> = {
  missing_fields: "Seed code and plant name are required.",
  duplicate_seed: "You have already registered this seed code.",
};

export default async function RegisterSeedPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error
    ? (errorMessages[error] ?? decodeURIComponent(error))
    : null;
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm text-emerald-700 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-emerald-950">Register a seed code</h1>
        <p className="mt-1 text-emerald-900/70">
          Link an official seed code to a plant. Your first biweekly form will be due in 14
          days.
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      )}

      <form
        action={registerSeed}
        className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="seed_code" className="mb-1 block text-sm font-medium">
            Seed code
          </label>
          <input
            id="seed_code"
            name="seed_code"
            required
            placeholder="PLT-2026-0042"
            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 font-mono uppercase outline-none ring-emerald-500 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="plant_name" className="mb-1 block text-sm font-medium">
            Plant name / variety
          </label>
          <input
            id="plant_name"
            name="plant_name"
            required
            placeholder="Cherry Tomato — Block A"
            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-emerald-500 focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Register seed
        </button>
      </form>
    </div>
  );
}
