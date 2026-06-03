import Link from "next/link";
import { format } from "date-fns";
import type { SeedWithProgress } from "@/lib/types";
import { CheckInProgress } from "@/components/CheckInProgress";
import { EstimatedValueBlock } from "@/components/EstimatedValueBlock";
import { SeedProgressBar } from "@/components/SeedProgressBar";

const statusStyles = {
  on_track: "bg-emerald-100 text-emerald-800",
  due_soon: "bg-emerald-200/80 text-emerald-900",
  overdue: "bg-red-100 text-red-800",
} as const;

const statusLabels = {
  on_track: "On track",
  due_soon: "Due soon",
  overdue: "Overdue",
} as const;

export function SeedList({ seeds }: { seeds: SeedWithProgress[] }) {
  if (seeds.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-10 text-center text-emerald-900/70">
        No seeds registered yet. Use &ldquo;Register new seed&rdquo; above to add your first
        seed code.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-emerald-100 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm shadow-emerald-900/5">
      {seeds.map((seed) => (
        <li key={seed.id} className="px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-emerald-950">{seed.plant_name}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[seed.status]}`}
                >
                  {statusLabels[seed.status]}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-sm text-emerald-700">{seed.seed_code}</p>
              <p className="mt-1 text-xs text-emerald-900/60">
                Next check-in due {format(new Date(seed.next_due_at), "MMM d, yyyy")}
              </p>
              <CheckInProgress
                reportCount={seed.report_count}
                registeredAt={seed.registered_at}
              />
              <SeedProgressBar
                nextDueAt={seed.next_due_at}
                periodComplete={seed.period_complete}
                status={seed.status}
              />
              <EstimatedValueBlock species={seed.seed_species} checkInCount={seed.report_count} />
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col lg:min-w-[11rem]">
              <Link
                href={`/seeds/${seed.id}/report`}
                className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#1b3d3a] transition hover:bg-emerald-50"
              >
                View Report
              </Link>
              <Link
                href={`/seeds/${seed.id}/submit`}
                className="rounded-xl bg-[#1b3d3a] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#152f2c]"
              >
                Biweekly check-in
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
