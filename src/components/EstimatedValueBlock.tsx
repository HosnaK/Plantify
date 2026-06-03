import { estimatedGrowerValueUsd, maturityBiweeklyPeriods } from "@/lib/seed-value";
import type { SeedSpecies } from "@/lib/types";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function EstimatedValueBlock({
  species,
  checkInCount,
}: {
  species: SeedSpecies | null;
  checkInCount: number;
}) {
  if (!species) {
    return (
      <div className="mt-3 rounded-xl border border-dashed border-emerald-200/80 bg-emerald-50/30 px-3 py-2">
        <p className="text-xs text-emerald-900/60">
          Estimated value: add a matching species in the admin Seed Library (code prefix{" "}
          <span className="font-mono">e.g. OAK</span>) to see buyback progress.
        </p>
      </div>
    );
  }

  const periods = maturityBiweeklyPeriods(species.buyback_period_weeks);
  const value = estimatedGrowerValueUsd(
    checkInCount,
    Number(species.full_buyback_price),
    Number(species.buyback_period_weeks)
  );
  const pct = Math.min(100, Math.round((checkInCount / periods) * 100));

  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-emerald-900/70">Est. value (buyback)</span>
        <span className="text-sm font-bold text-emerald-950">{usd.format(value)}</span>
      </div>
      <p className="mt-0.5 text-[10px] text-emerald-900/50">
        {checkInCount} / {periods % 1 === 0 ? periods : periods.toFixed(1)} biweekly check-ins toward{" "}
        {usd.format(Number(species.full_buyback_price))}
      </p>
      <div
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#1b3d3a]/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward full buyback value"
      >
        <div
          className="h-full rounded-full bg-[#10b981] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
