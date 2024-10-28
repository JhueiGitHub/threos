// types/extended.ts
import type { Profile, AppState, App, InstalledApp } from "@prisma/client";

export interface ExtendedProfile extends Profile {
  activeConstellation: string | null;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
}

export interface ExtendedAppState extends AppState {
  app: App;
  installedApp: InstalledApp;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  position: Position;
  size: Size;
  isMaximized: boolean;
  isMinimized: boolean;
}
