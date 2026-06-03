import Image from "next/image";
import Link from "next/link";

type PlantifyLogoProps = {
  /** Defaults to site homepage */
  href?: string;
  className?: string;
  priority?: boolean;
};

export function PlantifyLogo({
  href = "/",
  className = "",
  priority = false,
}: PlantifyLogoProps) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      <Image
        src="/plantify-logo.png"
        alt="Plantify"
        width={360}
        height={96}
        priority={priority}
        className={`h-20 w-auto sm:h-[5.5rem] ${className}`}
      />
    </Link>
  );
}
