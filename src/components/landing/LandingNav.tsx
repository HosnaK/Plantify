import Link from "next/link";
import { PlantifyLogo } from "@/components/PlantifyLogo";

const navLinks = [
  { label: "Video", href: "#pitch-video" },
  { label: "Growers", href: "/signup" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PlantifyLogo href="/" priority className="!h-9 sm:!h-10" />
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-neutral-600 sm:justify-end sm:gap-5 sm:text-sm">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-neutral-900">
                {link.label}
              </Link>
            ))}
            <Link
              href="/signup"
              className="rounded-lg bg-[#1b3d3a] px-3 py-1.5 text-white hover:bg-[#152f2c] sm:px-4 sm:py-2"
            >
              Open app
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
