import { addDays, differenceInCalendarDays, isAfter, isBefore, subDays } from "date-fns";

export const BIWEEKLY_DAYS = 14;

export function nextDueFrom(date: Date): Date {
  return addDays(date, BIWEEKLY_DAYS);
}

export function currentPeriod(seed: { next_due_at: string }) {
  const periodEnd = new Date(seed.next_due_at);
  const periodStart = subDays(periodEnd, BIWEEKLY_DAYS);
  return { periodStart, periodEnd };
}

export function seedStatus(nextDueAt: string): {
  status: "on_track" | "due_soon" | "overdue";
  daysUntilDue: number;
} {
  const due = new Date(nextDueAt);
  const now = new Date();
  const daysUntilDue = differenceInCalendarDays(due, now);

  if (isAfter(now, due)) {
    return { status: "overdue", daysUntilDue };
  }
  if (daysUntilDue <= 3) {
    return { status: "due_soon", daysUntilDue };
  }
  return { status: "on_track", daysUntilDue };
}

export function isFormOverdue(nextDueAt: string): boolean {
  return isAfter(new Date(), new Date(nextDueAt));
}

export function hasReportForCurrentPeriod(
  reports: { period_end: string }[],
  seed: { next_due_at: string }
): boolean {
  const { periodEnd } = currentPeriod(seed);
  return reports.some((r) => {
    const end = new Date(r.period_end);
    return !isBefore(end, periodEnd) && !isAfter(end, addDays(periodEnd, 1));
  });
}
