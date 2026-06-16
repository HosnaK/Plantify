import Link from "next/link";

const navLinks = [
  { label: "Video", href: "#pitch-video" },
  { label: "Our trees", href: "#our-trees" },
  { label: "Growers", href: "/signup" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 bg-transparent">
      <div className="mx-auto max-w-6xl bg-transparent px-4 sm:px-6">
        <div className="flex min-h-20 w-full flex-row items-center justify-between gap-4 py-3 sm:py-0">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center bg-transparent"
            aria-label="Plantify home"
          >
            <img
              src="/logo.png"
              alt=""
              className="h-12 w-auto bg-transparent"
              width={180}
              height={48}
              style={{ backgroundColor: "transparent" }}
            />
          </Link>
          <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2 text-base font-medium text-emerald-900/80 sm:gap-5 sm:text-lg">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-emerald-950">
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-[#1b3d3a] px-6 py-3 text-white transition hover:bg-[#152f2c]"
              >
                Dashboard
              </Link>
            ) : (
              <span className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                <Link
                  href="/signup"
                  className="rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-emerald-950 transition hover:bg-emerald-50 sm:px-6 sm:py-3"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg bg-[#1b3d3a] px-5 py-2.5 text-white transition hover:bg-[#152f2c] sm:px-6 sm:py-3"
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
