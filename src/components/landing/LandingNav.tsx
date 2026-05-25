import Link from "next/link";
import { PlantifyLogo } from "@/components/PlantifyLogo";

const navLinks = [
  { label: "Growers", href: "/signup" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <PlantifyLogo href="/" priority />
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-600 sm:gap-6">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-neutral-900">
              {link.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="rounded-lg bg-[#1b3d3a] px-4 py-2 text-white hover:bg-[#152f2c]"
          >
            Open app
          </Link>
        </nav>
      </div>
    </header>
  );
}
