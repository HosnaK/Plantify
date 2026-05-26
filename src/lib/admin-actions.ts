"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import type { SeedAdminStatus } from "@/lib/types";

const validStatuses: SeedAdminStatus[] = [
  "active",
  "mature",
  "approved_for_buyback",
];

export async function updateSeedAdminStatus(seedId: string, adminStatus: string) {
  const { supabase } = await requireAdmin();

  if (!validStatuses.includes(adminStatus as SeedAdminStatus)) {
    return { error: "Invalid status" };
  }

  const { error } = await supabase
    .from("seeds")
    .update({ admin_status: adminStatus })
    .eq("id", seedId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath(`/admin/seeds/${seedId}`);
  return { success: true };
}
