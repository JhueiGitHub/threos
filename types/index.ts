// types/index.ts
import type {
  Profile,
  Desktop,
  Constellation,
  AppState,
  App,
  InstalledApp,
} from "@prisma/client";

// Re-export Prisma types
export type { Profile, Desktop, Constellation, AppState, App, InstalledApp };

// Basic window types
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface AppStateWithRelations extends AppState {
  app: App;
  installedApp: InstalledApp;
}

export interface ConstellationWithRelations extends Constellation {
  appStates: AppStateWithRelations[];
}
