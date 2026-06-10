import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/profile-actions";
import type { GrowingExperience, GrowingSpace, Profile } from "@/lib/types";

const EXPERIENCE: GrowingExperience[] = ["Total Beginner", "Intermediate", "Expert"];
const SPACES: GrowingSpace[] = [
  "Balcony",
  "Indoor windowsill",
  "Garden",
  "Greenhouse",
  "Other",
];

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const profile = profileRow as Profile | null;
  const { error, saved } = await searchParams;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm text-emerald-700 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-emerald-950">Your profile</h1>
        <p className="mt-1 text-sm text-emerald-900/70">
          {user.email ? <span className="break-all">{user.email}</span> : null}
        </p>
      </div>

      {saved && (
        <p
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
          role="status"
        >
          Profile saved.
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {decodeURIComponent(error)}
        </p>
      )}

      <form action={updateProfile} className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-emerald-950">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            defaultValue={profile?.full_name ?? ""}
            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-[#10b981] focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="age" className="mb-1 block text-sm font-medium text-emerald-950">
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            required
            min={18}
            step={1}
            defaultValue={profile?.age ?? ""}
            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-[#10b981] focus:ring-2"
          />
          <p className="mt-1 text-xs text-emerald-900/60">Must be 18 or older.</p>
        </div>
        <div>
          <label htmlFor="occupation" className="mb-1 block text-sm font-medium text-emerald-950">
            Occupation
          </label>
          <input
            id="occupation"
            name="occupation"
            type="text"
            required
            defaultValue={profile?.occupation ?? ""}
            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-[#10b981] focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="growing_experience" className="mb-1 block text-sm font-medium text-emerald-950">
            Growing experience
          </label>
          <select
            id="growing_experience"
            name="growing_experience"
            required
            defaultValue={profile?.growing_experience ?? ""}
            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 outline-none ring-[#10b981] focus:ring-2"
          >
            <option value="" disabled>
              Select…
            </option>
            {EXPERIENCE.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="growing_space" className="mb-1 block text-sm font-medium text-emerald-950">
            Growing space
          </label>
          <select
            id="growing_space"
            name="growing_space"
            required
            defaultValue={profile?.growing_space ?? ""}
            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 outline-none ring-[#10b981] focus:ring-2"
          >
            <option value="" disabled>
              Select…
            </option>
            {SPACES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-[#1b3d3a] px-4 py-3 font-semibold text-white transition hover:bg-[#152f2c]"
        >
          Save profile
        </button>
      </form>
    </div>
  );
}
