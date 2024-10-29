// // hooks/use-desktop-store.ts
// import create from "zustand";
// import { subscribeWithSelector } from "zustand/middleware";

// interface DesktopState {
//   activeApps: string[];
//   constellation: any; // Type this properly
//   initialize: (constellation: any) => void;
//   openApp: (appId: string) => void;
//   closeApp: (appId: string) => void;
// }

// export const useDesktopStore = create<DesktopState>()(
//   subscribeWithSelector((set) => ({
//     activeApps: [],
//     constellation: null,

//     initialize: (constellation) =>
//       set({
//         constellation,
//         activeApps: [],
//       }),

//     openApp: (appId) =>
//       set((state) => ({
//         activeApps: [...state.activeApps, appId],
//       })),

//     closeApp: (appId) =>
//       set((state) => ({
//         activeApps: state.activeApps.filter((id) => id !== appId),
//       })),
//   }))
// );
