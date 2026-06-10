import Image from "next/image";

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
  const external = href.startsWith("http://") || href.startsWith("https://");
  return (
    <a
      href={href}
      className="inline-flex shrink-0 items-center"
      aria-label="Plantify home"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <Image
        src="/plantify-logo.png"
        alt=""
        width={360}
        height={96}
        priority={priority}
        className={`h-20 w-auto sm:h-[5.5rem] ${className}`}
      />
    </a>
  );
}
