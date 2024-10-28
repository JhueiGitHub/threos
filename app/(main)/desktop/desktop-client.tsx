// app/(main)/desktop/desktop-client.tsx
"use client";

import { useState, useEffect } from "react";
import { WindowManager } from "@/components/desktop/window-manager";
import type { Profile, Desktop, ConstellationWithRelations } from "@/types";

interface DesktopClientProps {
  profile: Profile;
  desktop: Desktop;
  constellation: ConstellationWithRelations;
}

export function DesktopClient({
  profile,
  desktop,
  constellation,
}: DesktopClientProps) {
  const [mounted, setMounted] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <WindowManager
        appStates={constellation.appStates}
        activeWindowId={activeWindowId}
        onFocus={setActiveWindowId}
      />
    </div>
  );
}
