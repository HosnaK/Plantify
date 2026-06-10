"use client";

import { useEffect, useRef, useState } from "react";
import { submitGrowthReport } from "@/lib/actions";

type CheckInFormProps = {
  seedId: string;
};

function syncInputFiles(input: HTMLInputElement, files: File[]) {
  const dt = new DataTransfer();
  for (const f of files) {
    dt.items.add(f);
  }
  input.files = dt.files;
}

export function CheckInForm({ seedId }: CheckInFormProps) {
  const [sprouted, setSprouted] = useState<"" | "yes" | "no">("");
  const [pests, setPests] = useState<"" | "yes" | "no" | "other">("");
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [photoHint, setPhotoHint] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSproutedFields = sprouted === "yes";

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  function onPhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoHint(null);
    const input = e.target;
    const picked = Array.from(input.files ?? []).filter((f) => f.size > 0);
    if (picked.length === 0) {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      return;
    }
    let next = picked;
    if (picked.length > 3) {
      next = picked.slice(0, 3);
      setPhotoHint("You can attach up to 3 photos per check-in. Only the first three were kept.");
    }
    syncInputFiles(input, next);
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews(next.map((file) => ({ file, url: URL.createObjectURL(file) })));
  }

  function clearPhotos() {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setPhotoHint(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

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
        <label htmlFor="photos" className="mb-1 block text-sm font-medium">
          Check-in photos <span className="text-red-600">*</span>
        </label>
        <p className="mb-2 text-xs text-emerald-900/65">
          Upload 1–3 images (JPEG, PNG, or WebP). You&apos;ll see a preview before you submit.
        </p>
        <input
          ref={fileInputRef}
          id="photos"
          name="photos"
          type="file"
          accept="image/*"
          multiple
          required
          onChange={onPhotosChange}
          className="w-full text-sm text-emerald-900 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:font-semibold file:text-emerald-800"
        />
        {photoHint && (
          <p className="mt-2 text-xs font-medium text-amber-800" role="status">
            {photoHint}
          </p>
        )}
        {previews.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-emerald-800">Preview</p>
            <div className="flex flex-wrap gap-2">
              {previews.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.url}
                  src={p.url}
                  alt={p.file.name}
                  className="h-24 w-24 rounded-lg border border-emerald-100 object-cover"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={clearPhotos}
              className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900"
            >
              Clear photos
            </button>
          </div>
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
