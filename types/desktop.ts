// types/desktop.ts
import type {
  Profile as PrismaProfile,
  AppState as PrismaAppState,
  App,
  InstalledApp,
  Constellation,
} from "@prisma/client";

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

export interface AppState extends Omit<PrismaAppState, "position" | "size"> {
  id: string;
  app: App;
  installedApp: InstalledApp;
  position: Position;
  size: Size;
  contentState: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile extends PrismaProfile {
  activeConstellation: string | null;
}

export interface WindowManagerProps {
  profile: Profile;
  appStates: AppState[];
  activeWindowId: string | null;
}

export interface WindowContentProps {
  profile: Profile;
  appState: AppState;
}

export interface AppStateWithRelations extends Omit<AppState, "position" | "size"> {
  position: Position; // Ensure position is always of type Position
  size: Size; // Ensure size is always of type Size
}
