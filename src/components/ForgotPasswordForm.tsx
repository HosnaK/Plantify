"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback?next=/auth/update-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-emerald-900/80">
          If an account exists for <strong>{email.trim()}</strong>, we sent a reset link. Check
          your inbox and spam folder.
        </p>
        <p className="text-sm text-emerald-900/60">
          In Supabase → Authentication → URL Configuration, add your site URL and redirect URL
          ending in <code className="rounded bg-emerald-100 px-1">/auth/callback</code> so the
          email link works.
        </p>
        <Link href="/login" className="inline-block font-semibold text-emerald-700 underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="you@example.com"
          autoComplete="email"
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
        className="w-full rounded-xl bg-[#1b3d3a] px-4 py-3 font-semibold text-white transition hover:bg-[#152f2c] disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send reset link"}
      </button>
      <p className="text-center text-sm text-emerald-900/70">
        <Link href="/login" className="font-medium text-emerald-700 underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
