"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      setLoading(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
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
    window.location.href = "/dashboard";
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
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
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
