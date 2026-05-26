import type { GrowthReport, SeedAdminStatus } from "@/lib/types";

export function deriveHealthStatus(report: GrowthReport): string {
  if (!report.has_sprouted) {
    return "Pre-sprout";
  }

  const issues: string[] = [];

  if (report.leaf_color === "yellow") issues.push("Yellow leaves");
  if (report.leaf_color === "brown") issues.push("Brown leaves");
  if (report.pests === "yes") issues.push("Pests observed");
  if (report.pests === "other") {
    issues.push(report.pests_other ? `Pests: ${report.pests_other}` : "Pests (other)");
  }

  if (issues.length === 0) {
    return report.leaf_color === "green" ? "Healthy" : "Sprouted — monitoring";
  }

  return issues.join(" · ");
}

export const ADMIN_STATUS_OPTIONS: { value: SeedAdminStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "mature", label: "Mature" },
  { value: "approved_for_buyback", label: "Approved for Buyback" },
];

export function adminStatusLabel(status: SeedAdminStatus): string {
  return ADMIN_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}
