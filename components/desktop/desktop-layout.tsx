// components/desktop/desktop-layout.tsx
"use client";

import { MenuBar } from "@/components/desktop/menu-bar";
import { Dock } from "@/components/desktop/dock";

export function DesktopLayout() {
  return (
    <div
      className="h-screen w-screen relative bg-black overflow-hidden"
      style={{
        borderRadius: "env(desktop-frame-border-radius, 12px)",
      }}
    >
      <MenuBar />
      <Dock />
    </div>
  );
}
