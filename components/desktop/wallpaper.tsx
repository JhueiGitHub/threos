// components/desktop/wallpaper.tsx
"use client";

import Image from "next/image";
import { useDesktop } from "@/hooks/use-desktop";

interface WallpaperProps {
  src: string;
  className?: string;
}

export function Wallpaper({ src, className }: WallpaperProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src={src}
        alt="Desktop Wallpaper"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
    </div>
  );
}
