// components/desktop/app-window.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WindowContent } from "./window-content";
import type { AppStateWithRelations, Position, Size, Profile } from "@/types";
import { currentProfile } from "@/lib/current-profile";

interface AppWindowProps {
  appState: AppStateWithRelations;
  isFocused: boolean;
  onFocus: () => void;
}

export function AppWindow({ appState, isFocused, onFocus }: AppWindowProps) {
  const defaultPosition: Position = { x: 0, y: 0 };
  const defaultSize: Size = { width: 100, height: 100 };

  const [position, setPosition] = useState<Position>(
    appState.position && typeof appState.position === 'string'
      ? JSON.parse(appState.position)
      : defaultPosition
  );

  const currentPosition = position || defaultPosition; // Ensure position is not null
  const [size, setSize] = useState<Size>(
    appState.size ? JSON.parse(appState.size as string) : defaultSize
  );

  // Ensure position and size are not null
  const currentSize = size || defaultSize;

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const fetchedProfile = await currentProfile();
      setProfile(fetchedProfile);
    }
    fetchProfile();
  }, []);

  return (
    <motion.div
      layout
      drag={!appState.isMaximized}
      dragMomentum={false}
      onClick={onFocus}
      animate={{
        x: currentPosition.x,
        y: currentPosition.y,
        width: currentSize.width,
        height: currentSize.height,
      }}
      className={cn(
        "absolute rounded-lg overflow-hidden",
        "border border-border/50 bg-background/95",
        isFocused ? "z-10" : "z-0"
      )}
    >
      {profile && (
        <WindowContent 
          appState={{ 
            ...appState, 
            position: currentPosition, 
            size: currentSize
          }} 
          profile={profile}
        />
      )}
    </motion.div>
  );
}
