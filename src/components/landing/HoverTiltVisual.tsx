"use client";

import Image from "next/image";
import { useState } from "react";

type HoverTiltVisualProps = {
  src: string;
  alt: string;
  className?: string;
};

export function HoverTiltVisual({ src, alt, className = "" }: HoverTiltVisualProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`perspective-[1000px] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative transition-transform duration-500 ease-out"
        style={{
          transform: hovered ? "rotateZ(-6deg) scale(1.02)" : "rotateZ(0deg) scale(1)",
          transformStyle: "preserve-3d",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={520}
          height={520}
          className="h-auto w-full max-w-md object-contain drop-shadow-xl"
          priority={src.includes("phone")}
        />
      </div>
    </div>
  );
}
