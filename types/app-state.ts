// types/app-state.ts
import type { Position, Size } from "./desktop";

export interface AppStateUpdate {
  position?: Position;
  size?: Size;
  isMaximized?: boolean;
  isMinimized?: boolean;
  isOpen?: boolean;
  contentState?: any;
}

export interface AppStateData {
  position: Position;
  size: Size;
  isMaximized: boolean;
  isMinimized: boolean;
  isOpen: boolean;
  contentState?: any;
}
