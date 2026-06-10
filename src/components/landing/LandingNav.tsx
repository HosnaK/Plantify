import Link from "next/link";
import { PlantifyLogo } from "@/components/PlantifyLogo";

const navLinks = [
  { label: "Video", href: "#pitch-video" },
  { label: "Our trees", href: "#our-trees" },
  { label: "Growers", href: "/signup" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PlantifyLogo href="/" priority className="!h-[4.5rem] sm:!h-20" />
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-emerald-900/80 sm:justify-end sm:gap-4 sm:text-sm">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-emerald-950">
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-[#1b3d3a] px-3 py-1.5 text-white hover:bg-[#152f2c] sm:px-4 sm:py-2"
              >
                Dashboard
              </Link>
            ) : (
              <span className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Link
                  href="/signup"
                  className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-emerald-950 hover:bg-emerald-50 sm:px-4 sm:py-2"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg bg-[#1b3d3a] px-3 py-1.5 text-white hover:bg-[#152f2c] sm:px-4 sm:py-2"
                >
                  Log In
                </Link>
              </span>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
