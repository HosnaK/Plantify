"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { AdminStatusSelect } from "@/components/admin/AdminStatusSelect";
import type { AdminSeedRow } from "@/lib/types";

export function SeedsTable({ seeds }: { seeds: AdminSeedRow[] }) {
  const router = useRouter();

  if (seeds.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center text-emerald-900/70">
        No seeds registered yet.
      </p>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm md:block">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-emerald-100 bg-emerald-50/60">
            <tr>
              <th className="px-4 py-3 font-semibold text-emerald-950">Seed Code</th>
              <th className="px-4 py-3 font-semibold text-emerald-950">Library</th>
              <th className="px-4 py-3 font-semibold text-emerald-950">Grower Name</th>
              <th className="px-4 py-3 font-semibold text-emerald-950">Grower Email</th>
              <th className="px-4 py-3 font-semibold text-emerald-950">Date Registered</th>
              <th className="px-4 py-3 font-semibold text-emerald-950">Number of Check-ins</th>
              <th className="px-4 py-3 font-semibold text-emerald-950">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {seeds.map((seed) => (
              <tr
                key={seed.id}
                onClick={() => router.push(`/admin/seeds/${seed.id}`)}
                className="cursor-pointer transition-colors hover:bg-emerald-50/50"
              >
                <td className="px-4 py-3">
                  <span className="font-mono font-medium text-emerald-800">{seed.seed_code}</span>
                  <p className="text-xs text-emerald-900/50">{seed.plant_name}</p>
                </td>
                <td className="px-4 py-3 text-emerald-900/80">
                  {seed.library_species_label ? (
                    <span className="text-sm">{seed.library_species_label}</span>
                  ) : (
                    <span className="text-xs text-emerald-900/45">No match</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-emerald-950">
                  {seed.grower_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-emerald-900/80">{seed.grower_email ?? "—"}</td>
                <td className="px-4 py-3 text-emerald-900/80">
                  {format(new Date(seed.registered_at), "MMM d, yyyy")}
                </td>
                <td className="px-4 py-3 font-semibold text-emerald-950">
                  {seed.check_in_count}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <AdminStatusSelect seedId={seed.id} currentStatus={seed.admin_status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {seeds.map((seed) => (
          <li
            key={seed.id}
            onClick={() => router.push(`/admin/seeds/${seed.id}`)}
            className="cursor-pointer rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/30"
          >
            <p className="font-mono font-semibold text-emerald-800">{seed.seed_code}</p>
            <p className="text-sm text-emerald-900/60">{seed.plant_name}</p>
            <p className="mt-1 text-xs text-emerald-900/55">
              Library: {seed.library_species_label ?? "No match"}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-emerald-900/50">Grower</dt>
                <dd className="font-medium text-emerald-950">{seed.grower_name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-emerald-900/50">Check-ins</dt>
                <dd className="font-medium text-emerald-950">{seed.check_in_count}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-emerald-900/50">Email</dt>
                <dd className="break-all text-emerald-900/80">{seed.grower_email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-emerald-900/50">Registered</dt>
                <dd>{format(new Date(seed.registered_at), "MMM d, yyyy")}</dd>
              </div>
            </dl>
            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
              <p className="mb-1 text-xs text-emerald-900/50">Status</p>
              <AdminStatusSelect seedId={seed.id} currentStatus={seed.admin_status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
