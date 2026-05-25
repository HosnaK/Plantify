"use client";

import { useState } from "react";
import { registerSeed } from "@/lib/actions";

export function RegisterSeedPanel({ errorMessage }: { errorMessage?: string | null }) {
  const [open, setOpen] = useState(!!errorMessage);

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-900/5">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl bg-[#1b3d3a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#152f2c]"
        >
          + Register new seed
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-emerald-950">Register a seed code</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
            >
              Cancel
            </button>
          </div>
          <p className="text-sm text-emerald-900/70">
            Enter your official seed code and plant label. Your first biweekly check-in is due
            in 14 days.
          </p>
          {errorMessage && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {errorMessage}
            </p>
          )}
          <form action={registerSeed} className="space-y-3">
            <div>
              <label htmlFor="seed_code" className="mb-1 block text-sm font-medium text-emerald-950">
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
              <label htmlFor="plant_name" className="mb-1 block text-sm font-medium text-emerald-950">
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
              className="rounded-xl bg-[#1b3d3a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#152f2c]"
            >
              Register seed
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
