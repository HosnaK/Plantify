import Link from "next/link";
import { PlantifyLogo } from "@/components/PlantifyLogo";
import { signOut } from "@/lib/actions";

export function AdminNavbar() {
  return (
    <header className="border-b border-emerald-900/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <PlantifyLogo />
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            Admin
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-emerald-950/80">
          <Link href="/admin" className="hover:text-emerald-700">
            All seeds
          </Link>
          <Link href="/admin/library" className="hover:text-emerald-700">
            Seed library
          </Link>
          <Link href="/dashboard" className="hover:text-emerald-700">
            Grower app
          </Link>
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
