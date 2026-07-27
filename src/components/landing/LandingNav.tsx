import Link from "next/link";

const navLinks = [
  { label: "Our Trees", href: "#our-trees" },
  { label: "Growers", href: "/signup" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <header className="relative z-30 w-full bg-[var(--Background-Background-1)]">
      <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 sm:px-10 sm:py-6">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center bg-transparent"
          aria-label="Plantify home"
        >
          <img
            src="/logo.png"
            alt=""
            className="h-8 w-auto bg-transparent sm:h-10"
            width={107}
            height={41}
            style={{ backgroundColor: "transparent" }}
          />
        </Link>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-5 gap-y-2 sm:gap-x-7">
          <nav
            className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 sm:gap-x-7"
            aria-label="Primary"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-nav text-sm font-bold leading-[1.4] tracking-[-0.35px] text-[var(--Text-Link)] transition hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="font-nav inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] px-[22px] py-3.5 text-sm font-bold leading-[1.4] tracking-[-0.35px] text-[var(--Text-On-accent-1)] transition hover:bg-[var(--brand-green-hover)]"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="font-nav inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] px-[22px] py-3.5 text-sm font-bold leading-[1.4] tracking-[-0.35px] text-[var(--Text-On-accent-1)] transition hover:bg-[var(--brand-green-hover)]"
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
