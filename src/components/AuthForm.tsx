"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { safeInternalPath } from "@/lib/safe-redirect";
import type { GrowingExperience, GrowingSpace } from "@/lib/types";

type Mode = "login" | "signup";

const EXPERIENCE_OPTIONS: GrowingExperience[] = ["Total Beginner", "Intermediate", "Expert"];
const SPACE_OPTIONS: GrowingSpace[] = [
  "Balcony",
  "Indoor windowsill",
  "Garden",
  "Greenhouse",
  "Other",
];

export function AuthForm({
  mode,
  redirectAfterLogin,
}: {
  mode: Mode;
  /** From ?next= on login page — must be a safe internal path */
  redirectAfterLogin?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [growingExperience, setGrowingExperience] = useState<GrowingExperience | "">("");
  const [growingSpace, setGrowingSpace] = useState<GrowingSpace | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "signup") {
      const ageNum = Number(age);
      if (!fullName.trim()) {
        setError("Full name is required.");
        setLoading(false);
        return;
      }
      if (!Number.isFinite(ageNum) || ageNum < 18) {
        setError("You must be 18 or older to sign up.");
        setLoading(false);
        return;
      }
      if (!occupation.trim()) {
        setError("Occupation is required.");
        setLoading(false);
        return;
      }
      if (!growingExperience) {
        setError("Please select your growing experience.");
        setLoading(false);
        return;
      }
      if (!growingSpace) {
        setError("Please select your growing space.");
        setLoading(false);
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            age: String(ageNum),
            occupation: occupation.trim(),
            growing_experience: growingExperience,
            growing_space: growingSpace,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setLoading(false);
        setError(signUpError.message);
        return;
      }

      setLoading(false);
      window.location.href = "/dashboard";
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    window.location.href = safeInternalPath(redirectAfterLogin) ?? "/dashboard";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-emerald-950">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-emerald-500 focus:ring-2"
            placeholder="Alex Grower"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-emerald-950">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-emerald-500 focus:ring-2"
          placeholder="you@farm.co"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-emerald-950">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-emerald-500 focus:ring-2"
          placeholder="••••••••"
        />
      </div>

      {mode === "signup" && (
        <>
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
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-emerald-500 focus:ring-2"
              placeholder="21"
            />
            <p className="mt-1 text-xs text-emerald-900/60">You must be 18 or older.</p>
          </div>
          <div>
            <label htmlFor="occupation" className="mb-1 block text-sm font-medium text-emerald-950">
              Occupation
            </label>
            <input
              id="occupation"
              type="text"
              required
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-emerald-500 focus:ring-2"
              placeholder="Teacher, engineer, retiree…"
            />
          </div>
          <div>
            <label htmlFor="growing_experience" className="mb-1 block text-sm font-medium text-emerald-950">
              Growing experience
            </label>
            <select
              id="growing_experience"
              required
              value={growingExperience}
              onChange={(e) => setGrowingExperience(e.target.value as GrowingExperience | "")}
              className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 outline-none ring-emerald-500 focus:ring-2"
            >
              <option value="" disabled>
                Select…
              </option>
              {EXPERIENCE_OPTIONS.map((opt) => (
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
              required
              value={growingSpace}
              onChange={(e) => setGrowingSpace(e.target.value as GrowingSpace | "")}
              className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 outline-none ring-emerald-500 focus:ring-2"
            >
              <option value="" disabled>
                Select…
              </option>
              {SPACE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {mode === "login" && (
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-medium text-emerald-700 hover:underline">
            Forgot password?
          </Link>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#1b3d3a] px-4 py-3 font-semibold text-white transition hover:bg-[#152f2c] disabled:opacity-60"
      >
        {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      <p className="text-center text-sm text-emerald-900/70">
        {mode === "login" ? (
          <>
            New grower?{" "}
            <Link href="/signup" className="font-medium text-emerald-700 underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already growing with us?{" "}
            <Link href="/login" className="font-medium text-emerald-700 underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
