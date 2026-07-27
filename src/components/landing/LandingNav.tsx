import Link from "next/link";

const pillLinks = [
  { label: "Our Trees", href: "#our-trees" },
  { label: "Growers", href: "/signup" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <header className="relative z-30 w-full bg-[var(--Background-Background-1)]">
      <div className="relative mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 pb-6 pt-5 sm:px-10 sm:pb-10 sm:pt-5">
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

        <nav
          className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-5 rounded-full bg-white/40 px-6 py-5 backdrop-blur-[15px] md:flex sm:gap-7"
          aria-label="Primary"
        >
          {pillLinks.map((link) => (
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
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/signup"
              className="font-nav inline-flex items-center justify-center rounded-full border border-[var(--brand-green)]/30 bg-white px-4 py-3 text-sm font-bold leading-[1.4] tracking-[-0.35px] text-[var(--brand-green)] transition hover:bg-[var(--brand-green)]/5 sm:px-[22px] sm:py-3.5"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="font-nav inline-flex items-center justify-center rounded-full bg-[var(--brand-green)] px-4 py-3 text-sm font-bold leading-[1.4] tracking-[-0.35px] text-[var(--Text-On-accent-1)] transition hover:bg-[var(--brand-green-hover)] sm:px-[22px] sm:py-3.5"
            >
              Log In
            </Link>
          </div>
        )}
      </div>

      <nav
        className="mx-auto mb-4 flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-4 rounded-full bg-white/40 px-5 py-3 backdrop-blur-[15px] md:hidden"
        aria-label="Primary"
      >
        {pillLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-nav text-sm font-bold leading-[1.4] tracking-[-0.35px] text-[var(--Text-Link)] transition hover:opacity-70"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
