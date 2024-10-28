// components/desktop/app-renderer.tsx
"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import type { AppState, Profile } from "@/types/desktop";

interface AppComponentProps {
  profile: Profile;
  appState: AppState;
}

const appComponents = {
  flow: dynamic<AppComponentProps>(() => import("@/apps/flow/App")),
  discord: dynamic<AppComponentProps>(() => import("@/apps/discord/App")),
};

interface AppRendererProps {
  profile: Profile;
  appState: AppState;
}

export function AppRenderer({ profile, appState }: AppRendererProps) {
  const AppComponent =
    appComponents[appState.app.name as keyof typeof appComponents];

  if (!AppComponent) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">App not found</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      <AppComponent profile={profile} appState={appState} />
    </Suspense>
  );
}
