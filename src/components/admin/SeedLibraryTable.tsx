"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createSeedSpecies,
  deleteSeedSpecies,
  updateSeedSpecies,
} from "@/lib/library-actions";
import type { DifficultyLevel, SeedSpecies } from "@/lib/types";

const difficulties: DifficultyLevel[] = ["Easy", "Medium", "Hard"];

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function emptyForm() {
  return {
    plant_name: "",
    code_prefix: "",
    buyback_period_weeks: "",
    seed_price: "",
    full_buyback_price: "",
    difficulty_level: "Easy" as DifficultyLevel,
    environment_preferences: "",
  };
}

export function SeedLibraryTable({ initialSpecies }: { initialSpecies: SeedSpecies[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm());
  const [error, setError] = useState<string | null>(null);

  function startEdit(s: SeedSpecies) {
    setEditingId(s.id);
    setEditForm({
      plant_name: s.plant_name,
      code_prefix: s.code_prefix,
      buyback_period_weeks: String(s.buyback_period_weeks),
      seed_price: String(s.seed_price),
      full_buyback_price: String(s.full_buyback_price),
      difficulty_level: s.difficulty_level,
      environment_preferences: s.environment_preferences,
    });
    setError(null);
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-emerald-950">Catalogue</h2>
        <button
          type="button"
          onClick={() => {
            setShowAdd((v) => !v);
            setError(null);
          }}
          className="rounded-xl bg-[#1b3d3a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#152f2c]"
        >
          {showAdd ? "Close form" : "Add species"}
        </button>
      </div>

      {showAdd && (
        <form
          key="add-species-form"
          className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm"
          action={(fd) => {
            setError(null);
            startTransition(async () => {
              const res = await createSeedSpecies(fd);
              if (res.error) setError(res.error);
              else {
                setShowAdd(false);
                router.refresh();
              }
            });
          }}
        >
          <p className="mb-4 text-sm font-medium text-emerald-950">New species</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Plant name" name="plant_name" required />
            <Field label="Code prefix" name="code_prefix" placeholder="OAK" required />
            <Field
              label="Buyback period (weeks)"
              name="buyback_period_weeks"
              type="number"
              step="0.1"
              min="0.1"
              required
            />
            <Field label="Seed price ($)" name="seed_price" type="number" step="0.01" min="0" required />
            <Field
              label="Full buyback ($)"
              name="full_buyback_price"
              type="number"
              step="0.01"
              min="0"
              required
            />
            <div>
              <label className="mb-1 block text-xs font-medium text-emerald-900/80">
                Difficulty
              </label>
              <select
                name="difficulty_level"
                defaultValue="Easy"
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm"
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-medium text-emerald-900/80">
                Environment preferences
              </label>
              <textarea
                name="environment_preferences"
                rows={2}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm"
                placeholder="Full sun, water twice a week…"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="mt-4 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Save species
          </button>
        </form>
      )}

      <div className="hidden overflow-x-auto rounded-2xl border border-emerald-100 bg-white shadow-sm md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-emerald-100 bg-emerald-50/60">
            <tr>
              <th className="px-3 py-3 font-semibold text-emerald-950">Plant</th>
              <th className="px-3 py-3 font-semibold text-emerald-950">Prefix</th>
              <th className="px-3 py-3 font-semibold text-emerald-950">Weeks</th>
              <th className="px-3 py-3 font-semibold text-emerald-950">Seed</th>
              <th className="px-3 py-3 font-semibold text-emerald-950">Buyback</th>
              <th className="px-3 py-3 font-semibold text-emerald-950">Difficulty</th>
              <th className="px-3 py-3 font-semibold text-emerald-950">Environment</th>
              <th className="px-3 py-3 font-semibold text-emerald-950">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {initialSpecies.map((s) =>
              editingId === s.id ? (
                <tr key={s.id} className="bg-emerald-50/30">
                  <td colSpan={8} className="p-4">
                    <form
                      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        setError(null);
                        startTransition(async () => {
                          const res = await updateSeedSpecies(s.id, fd);
                          if (res.error) setError(res.error);
                          else {
                            setEditingId(null);
                            router.refresh();
                          }
                        });
                      }}
                    >
                      <Field label="Plant name" name="plant_name" defaultValue={editForm.plant_name} required />
                      <Field label="Code prefix" name="code_prefix" defaultValue={editForm.code_prefix} required />
                      <Field
                        label="Buyback weeks"
                        name="buyback_period_weeks"
                        type="number"
                        step="0.1"
                        min="0.1"
                        defaultValue={editForm.buyback_period_weeks}
                        required
                      />
                      <Field label="Seed $" name="seed_price" type="number" step="0.01" min="0" defaultValue={editForm.seed_price} required />
                      <Field
                        label="Buyback $"
                        name="full_buyback_price"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={editForm.full_buyback_price}
                        required
                      />
                      <div>
                        <label className="mb-1 block text-xs font-medium text-emerald-900/80">Difficulty</label>
                        <select
                          name="difficulty_level"
                          defaultValue={editForm.difficulty_level}
                          className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm"
                        >
                          {difficulties.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2 lg:col-span-4">
                        <label className="mb-1 block text-xs font-medium text-emerald-900/80">Environment</label>
                        <textarea
                          name="environment_preferences"
                          rows={2}
                          defaultValue={editForm.environment_preferences}
                          className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
                        <button
                          type="submit"
                          disabled={pending}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={s.id} className="hover:bg-emerald-50/30">
                  <td className="px-3 py-3 font-medium text-emerald-950">{s.plant_name}</td>
                  <td className="px-3 py-3 font-mono text-emerald-800">{s.code_prefix}</td>
                  <td className="px-3 py-3 text-emerald-900/80">{s.buyback_period_weeks}</td>
                  <td className="px-3 py-3">{money(Number(s.seed_price))}</td>
                  <td className="px-3 py-3 font-semibold text-emerald-950">
                    {money(Number(s.full_buyback_price))}
                  </td>
                  <td className="px-3 py-3">{s.difficulty_level}</td>
                  <td className="max-w-[200px] truncate px-3 py-3 text-emerald-900/70" title={s.environment_preferences}>
                    {s.environment_preferences || "—"}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(s)}
                        className="rounded-lg border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (!confirm(`Delete species “${s.plant_name}” (${s.code_prefix})?`)) return;
                          setError(null);
                          startTransition(async () => {
                            const res = await deleteSeedSpecies(s.id);
                            if (res.error) setError(res.error);
                            else router.refresh();
                          });
                        }}
                        className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {initialSpecies.map((s) => (
          <li key={s.id} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <p className="font-semibold text-emerald-950">{s.plant_name}</p>
            <p className="font-mono text-sm text-emerald-700">{s.code_prefix}</p>
            <dl className="mt-2 grid grid-cols-2 gap-1 text-xs text-emerald-900/80">
              <dt>Weeks</dt>
              <dd>{s.buyback_period_weeks}</dd>
              <dt>Seed</dt>
              <dd>{money(Number(s.seed_price))}</dd>
              <dt>Buyback</dt>
              <dd className="font-semibold">{money(Number(s.full_buyback_price))}</dd>
              <dt>Difficulty</dt>
              <dd>{s.difficulty_level}</dd>
            </dl>
            <p className="mt-2 text-xs text-emerald-900/70">{s.environment_preferences}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(s)}
                className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (!confirm(`Delete “${s.plant_name}”?`)) return;
                  startTransition(async () => {
                    const res = await deleteSeedSpecies(s.id);
                    if (res.error) setError(res.error);
                    else router.refresh();
                  });
                }}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700"
              >
                Delete
              </button>
            </div>
            {editingId === s.id && (
              <form
                className="mt-4 space-y-2 border-t border-emerald-100 pt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  setError(null);
                  startTransition(async () => {
                    const res = await updateSeedSpecies(s.id, fd);
                    if (res.error) setError(res.error);
                    else {
                      setEditingId(null);
                      router.refresh();
                    }
                  });
                }}
              >
                <Field label="Plant name" name="plant_name" defaultValue={editForm.plant_name} required />
                <Field label="Prefix" name="code_prefix" defaultValue={editForm.code_prefix} required />
                <Field label="Weeks" name="buyback_period_weeks" type="number" step="0.1" defaultValue={editForm.buyback_period_weeks} required />
                <Field label="Seed $" name="seed_price" type="number" step="0.01" defaultValue={editForm.seed_price} required />
                <Field label="Buyback $" name="full_buyback_price" type="number" step="0.01" defaultValue={editForm.full_buyback_price} required />
                <div>
                  <label className="mb-1 block text-xs">Difficulty</label>
                  <select name="difficulty_level" defaultValue={editForm.difficulty_level} className="w-full rounded border px-2 py-1 text-sm">
                    {difficulties.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea name="environment_preferences" defaultValue={editForm.environment_preferences} rows={2} className="w-full rounded border px-2 py-1 text-sm" />
                <div className="flex gap-2">
                  <button type="submit" className="rounded bg-emerald-600 px-3 py-1 text-sm text-white">
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="text-sm underline">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
  step,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
  min?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-emerald-900/80">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        step={step}
        min={min}
        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm"
      />
    </div>
  );
}
