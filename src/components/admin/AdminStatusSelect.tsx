"use client";

import { useTransition } from "react";
import { updateSeedAdminStatus } from "@/lib/admin-actions";
import { ADMIN_STATUS_OPTIONS } from "@/lib/admin-constants";
import type { SeedAdminStatus } from "@/lib/types";

export function AdminStatusSelect({
  seedId,
  currentStatus,
}: {
  seedId: string;
  currentStatus: SeedAdminStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={currentStatus}
      disabled={pending}
      onChange={(e) => {
        e.stopPropagation();
        startTransition(async () => {
          await updateSeedAdminStatus(seedId, e.target.value);
        });
      }}
      onClick={(e) => e.stopPropagation()}
      className="w-full min-w-[10rem] rounded-lg border border-emerald-200 bg-white px-2 py-1.5 text-sm font-medium text-emerald-950 outline-none ring-[#10b981] focus:ring-2 disabled:opacity-60"
      aria-label="Seed status"
    >
      {ADMIN_STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
