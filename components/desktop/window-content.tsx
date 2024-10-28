// components/desktop/window-content.tsx
"use client";

import { AppRenderer } from "./app-renderer";
import type { WindowContentProps } from "@/types/desktop";

export function WindowContent({ profile, appState }: WindowContentProps) {
  return (
    <div className="h-full w-full">
      <AppRenderer profile={profile} appState={appState} />
    </div>
  );
}
