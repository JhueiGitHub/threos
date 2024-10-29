// components/desktop/wallpaper.tsx
"use client";

import { motion } from "framer-motion";

interface WallpaperProps {
  wallpaper?: string | null;
}

export const Wallpaper = ({ wallpaper }: WallpaperProps) => {
  // Default background if no wallpaper is set
  if (!wallpaper) {
    return (
      <div
        className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black"
        style={{ backgroundColor: "#292929" }} // Zenith default
      />
    );
  }

  // If wallpaper is a video
  if (wallpaper.endsWith(".mp4")) {
    return (
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={wallpaper} type="video/mp4" />
        </video>
      </div>
    );
  }

  // If wallpaper is an image
  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${wallpaper})` }}
    />
  );
};
