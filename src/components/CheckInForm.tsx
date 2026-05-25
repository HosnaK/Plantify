"use client";

import { useState } from "react";
import { submitGrowthReport } from "@/lib/actions";

type CheckInFormProps = {
  seedId: string;
};

export function CheckInForm({ seedId }: CheckInFormProps) {
  const [sprouted, setSprouted] = useState<"" | "yes" | "no">("");
  const [pests, setPests] = useState<"" | "yes" | "no" | "other">("");

  const showSproutedFields = sprouted === "yes";

  return (
    <form
      action={submitGrowthReport}
      encType="multipart/form-data"
      className="space-y-5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="seed_id" value={seedId} />

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-emerald-950">
          Have your seed sprouted?
        </legend>
        <div className="flex flex-wrap gap-3">
          {(["yes", "no"] as const).map((value) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                sprouted === value
                  ? "border-[#1b3d3a] bg-[#1b3d3a]/5 text-emerald-950"
                  : "border-emerald-200 text-emerald-900/80 hover:border-emerald-300"
              }`}
            >
              <input
                type="radio"
                name="has_sprouted"
                value={value}
                required
                checked={sprouted === value}
                onChange={() => setSprouted(value)}
                className="accent-[#1b3d3a]"
              />
              {value === "yes" ? "Yes" : "No"}
            </label>
          ))}
        </div>
      </fieldset>

      {showSproutedFields && (
        <>
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-emerald-950">
              Indicate the color of the leaves
            </legend>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  ["green", "Green"],
                  ["yellow", "Yellow"],
                  ["brown", "Brown"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-medium text-emerald-900/80 hover:border-emerald-300 has-[:checked]:border-[#1b3d3a] has-[:checked]:bg-[#1b3d3a]/5"
                >
                  <input
                    type="radio"
                    name="leaf_color"
                    value={value}
                    required={showSproutedFields}
                    className="accent-[#1b3d3a]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-emerald-950">
              Have you noticed pests? Any small bugs been around your plant recently?
            </legend>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  ["yes", "Yes"],
                  ["no", "No"],
                  ["other", "Other"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    pests === value
                      ? "border-[#1b3d3a] bg-[#1b3d3a]/5 text-emerald-950"
                      : "border-emerald-200 text-emerald-900/80 hover:border-emerald-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="pests"
                    value={value}
                    required={showSproutedFields}
                    checked={pests === value}
                    onChange={() => setPests(value)}
                    className="accent-[#1b3d3a]"
                  />
                  {label}
                </label>
              ))}
            </div>
            {pests === "other" && (
              <div className="mt-3">
                <label htmlFor="pests_other" className="mb-1 block text-sm font-medium">
                  Please explain
                </label>
                <textarea
                  id="pests_other"
                  name="pests_other"
                  required
                  rows={3}
                  placeholder="Describe what you observed…"
                  className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-[#10b981] focus:ring-2"
                />
              </div>
            )}
          </fieldset>

          <div>
            <label htmlFor="height_cm" className="mb-1 block text-sm font-medium">
              Height (cm) <span className="font-normal text-emerald-900/50">optional</span>
            </label>
            <input
              id="height_cm"
              name="height_cm"
              type="number"
              step="0.1"
              min="0"
              placeholder="42.5"
              className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-[#10b981] focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-medium">
              Notes <span className="font-normal text-emerald-900/50">optional</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Irrigation, weather, anything else…"
              className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 outline-none ring-[#10b981] focus:ring-2"
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="photo" className="mb-1 block text-sm font-medium">
          Growth photo{sprouted === "no" ? "" : " (optional)"}
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          required={sprouted === "no"}
          className="w-full text-sm text-emerald-900 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:font-semibold file:text-emerald-800"
        />
        {sprouted === "no" && (
          <p className="mt-1 text-xs text-emerald-900/60">
            Upload a photo of your seed — other fields are not required until it sprouts.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!sprouted}
        className="w-full rounded-xl bg-[#1b3d3a] px-4 py-3 font-semibold text-white transition hover:bg-[#152f2c] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit check-in
      </button>
    </form>
  );
}
