// hooks/use-desktop.tsx
import { create } from "zustand";
import { toast } from "sonner";
import type { AppState } from "@prisma/client";

interface WindowPosition {
  x: number;
  y: number;
}

interface WindowSize {
  width: number;
  height: number;
}

interface DesktopStore {
  appStates: AppState[];
  activeWindowId: string | null;
  setActiveWindow: (windowId: string | null) => void;
  updateAppState: (
    appStateId: string,
    position: WindowPosition,
    size: WindowSize
  ) => void;
}

export const useDesktop = create<DesktopStore>((set) => ({
  appStates: [],
  activeWindowId: null,

  setActiveWindow: (windowId) => {
    set({ activeWindowId: windowId });
  },

  updateAppState: (appStateId, position, size) => {
    set((state) => ({
      appStates: state.appStates.map((appState) =>
        appState.id === appStateId
          ? {
              ...appState,
              position: JSON.stringify(position),
              size: JSON.stringify(size),
            }
          : appState
      ),
    }));
  },
}));
