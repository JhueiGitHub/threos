// components/desktop/window-manager.tsx
"use client";

import { AppWindow } from "./app-window";
import type { AppStateWithRelations } from "@/types";

interface WindowManagerProps {
  appStates: AppStateWithRelations[];
  activeWindowId: string | null;
  onFocus: (id: string) => void;
}

export function WindowManager({
  appStates,
  activeWindowId,
  onFocus,
}: WindowManagerProps) {
  return (
    <div className="fixed inset-0">
      {appStates
        .filter((state) => state.isOpen)
        .map((state) => (
          <AppWindow
            key={state.id}
            appState={state}
            isFocused={state.id === activeWindowId}
            onFocus={() => onFocus(state.id)}
          />
        ))}
    </div>
  );
}
