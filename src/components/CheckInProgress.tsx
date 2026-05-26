import { differenceInCalendarDays } from "date-fns";

type CheckInProgressProps = {
  reportCount: number;
  registeredAt: string;
};

/** Biweekly periods elapsed since registration (minimum 1). */
export function biweeklyPeriodsSince(registeredAt: string): number {
  const days = differenceInCalendarDays(new Date(), new Date(registeredAt));
  return Math.max(1, Math.floor(days / 14) + 1);
}

export function CheckInProgress({ reportCount, registeredAt }: CheckInProgressProps) {
  const periods = biweeklyPeriodsSince(registeredAt);
  const percent = Math.min(100, Math.round((reportCount / periods) * 100));

  return (
    <div className="mt-3 w-full">
      <div className="mb-1 flex items-center justify-between text-xs text-emerald-900/70">
        <span>Check-ins completed</span>
        <span className="font-semibold text-emerald-950">
          {reportCount} of {periods} period{periods === 1 ? "" : "s"}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-[#1b3d3a]/10"
        role="progressbar"
        aria-valuenow={reportCount}
        aria-valuemin={0}
        aria-valuemax={periods}
        aria-label={`${reportCount} check-ins completed`}
      >
        <div
          className="h-full rounded-full bg-[#10b981] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
