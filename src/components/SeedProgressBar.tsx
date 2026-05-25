import { periodProgress } from "@/lib/biweekly";

type SeedProgressBarProps = {
  nextDueAt: string;
  periodComplete: boolean;
  status: "on_track" | "due_soon" | "overdue";
};

export function SeedProgressBar({
  nextDueAt,
  periodComplete,
  status,
}: SeedProgressBarProps) {
  const { percent, label } = periodProgress(nextDueAt, periodComplete);

  const fillClass =
    periodComplete
      ? "bg-[#22c55e]"
      : status === "overdue"
        ? "bg-red-500"
        : status === "due_soon"
          ? "bg-amber-400"
          : "bg-[#10b981]";

  return (
    <div className="mt-3 w-full">
      <div className="mb-1 flex items-center justify-between text-xs text-emerald-900/70">
        <span>Biweekly progress</span>
        <span className="font-medium text-emerald-950">{label}</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-[#1b3d3a]/15"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${fillClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
