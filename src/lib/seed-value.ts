/** First segment of a seed code before '-', uppercased (e.g. OAK-2024-001 → OAK). */
export function codePrefixFromSeedCode(seedCode: string): string {
  const upper = seedCode.trim().toUpperCase();
  const dash = upper.indexOf("-");
  return dash === -1 ? upper : upper.slice(0, dash);
}

/** Biweekly periods until maturity (buyback_period_weeks ÷ 2). */
export function maturityBiweeklyPeriods(buybackPeriodWeeks: number): number {
  return Math.max(0.0001, buybackPeriodWeeks / 2);
}

/** Linear estimate: $0 at 0 check-ins → full_buyback at maturity periods. */
export function estimatedGrowerValueUsd(
  checkInCount: number,
  fullBuybackPrice: number,
  buybackPeriodWeeks: number
): number {
  const periods = maturityBiweeklyPeriods(buybackPeriodWeeks);
  const ratio = Math.min(1, checkInCount / periods);
  return fullBuybackPrice * ratio;
}
