import Image from "next/image";
import Link from "next/link";

type PlantifyLogoProps = {
  href?: string;
  className?: string;
  priority?: boolean;
};

export function PlantifyLogo({ href, className = "", priority = false }: PlantifyLogoProps) {
  const image = (
    <Image
      src="/plantify-logo.png"
      alt="Plantify"
      width={180}
      height={48}
      priority={priority}
      className={`h-10 w-auto sm:h-11 ${className}`}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{image}</span>;
}
