import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export { deriveHealthStatus, ADMIN_STATUS_OPTIONS, adminStatusLabel } from "@/lib/admin-constants";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return { supabase, user };
}
