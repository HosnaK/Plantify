import { format } from "date-fns";
import { deriveHealthStatus } from "@/lib/admin-constants";
import { growthPhotoUrl } from "@/lib/photos";
import type { GrowthReport, LeafColor } from "@/lib/types";

function leafColorLabel(color: LeafColor | null): string {
  if (!color) return "—";
  return color.charAt(0).toUpperCase() + color.slice(1);
}

export function CheckInTimeline({ reports }: { reports: GrowthReport[] }) {
  if (reports.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-10 text-center text-emerald-900/70">
        No biweekly check-ins submitted yet.
      </p>
    );
  }

  return (
    <ol className="space-y-6">
      {reports.map((report, index) => {
        const photoUrl = growthPhotoUrl(report.photo_path);
        const health = deriveHealthStatus(report);

        return (
          <li
            key={report.id}
            className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-50 bg-emerald-50/50 px-4 py-3 sm:px-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Check-in #{index + 1}
                </p>
                <p className="text-sm font-semibold text-emerald-950">
                  {format(new Date(report.submitted_at), "MMMM d, yyyy")}
                </p>
                <p className="text-xs text-emerald-900/60">
                  Period {format(new Date(report.period_start), "MMM d")} –{" "}
                  {format(new Date(report.period_end), "MMM d, yyyy")}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  health === "Healthy"
                    ? "bg-emerald-100 text-emerald-800"
                    : health === "Pre-sprout"
                      ? "bg-neutral-100 text-neutral-700"
                      : "bg-amber-100 text-amber-900"
                }`}
              >
                {health}
              </span>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-emerald-900/60">Sprouted</dt>
                  <dd className="font-medium text-emerald-950">
                    {report.has_sprouted ? "Yes" : "No"}
                  </dd>
                </div>
                {report.has_sprouted && (
                  <>
                    <div>
                      <dt className="text-emerald-900/60">Leaf color</dt>
                      <dd className="font-medium text-emerald-950">
                        {leafColorLabel(report.leaf_color)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-emerald-900/60">Pests</dt>
                      <dd className="font-medium capitalize text-emerald-950">
                        {report.pests ?? "—"}
                        {report.pests === "other" && report.pests_other
                          ? ` — ${report.pests_other}`
                          : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-emerald-900/60">Height</dt>
                      <dd className="font-medium text-emerald-950">
                        {report.height_cm != null ? `${report.height_cm} cm` : "—"}
                      </dd>
                    </div>
                  </>
                )}
                <div>
                  <dt className="text-emerald-900/60">Notes</dt>
                  <dd className="font-medium text-emerald-950">
                    {report.notes?.trim() ? report.notes : "—"}
                  </dd>
                </div>
              </dl>

              <div>
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt={`Check-in photo ${format(new Date(report.submitted_at), "MMM d, yyyy")}`}
                    className="h-48 w-full rounded-xl object-cover sm:h-56"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 text-sm text-emerald-900/50 sm:h-56">
                    No photo
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
