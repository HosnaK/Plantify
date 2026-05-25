"use client";

import { useState, type ReactNode } from "react";

type HoverTiltBoxProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

export function HoverTiltBox({ children, className = "", label }: HoverTiltBoxProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`perspective-[1000px] w-full ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="transition-transform duration-500 ease-out"
        style={{
          transform: hovered ? "rotateZ(-6deg) scale(1.02)" : "rotateZ(0deg) scale(1)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
      {label && (
        <p className="mt-2 text-center text-xs text-neutral-400 sm:hidden">{label}</p>
      )}
    </div>
  );
}

export function ImagePlaceholder({
  aspect = "square",
  caption = "Image coming soon",
}: {
  aspect?: "square" | "phone";
  caption?: string;
}) {
  const aspectClass =
    aspect === "phone" ? "aspect-[9/16] max-h-[min(70vh,520px)]" : "aspect-square max-h-[min(50vh,400px)]";

  return (
    <div
      className={`flex w-full ${aspectClass} max-w-md items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-neutral-50 mx-auto`}
      aria-hidden
    >
      <span className="px-4 text-center text-sm font-medium text-emerald-900/40">{caption}</span>
    </div>
  );
}
