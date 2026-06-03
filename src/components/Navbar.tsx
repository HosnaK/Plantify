import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions";
import { PlantifyLogo } from "@/components/PlantifyLogo";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  const unread = count ?? 0;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  return (
    <header className="border-b border-[#1b3d3a]/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <PlantifyLogo priority />
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-emerald-950/80">
          <Link href="/dashboard" className="hover:text-emerald-700">
            Dashboard
          </Link>
          <Link href="/notifications" className="relative hover:text-emerald-700">
            Notifications
            {unread > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#10b981] px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link href="/admin" className="font-semibold text-emerald-800 hover:text-emerald-600">
              Admin
            </Link>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[#1b3d3a] hover:bg-emerald-50"
            >
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
