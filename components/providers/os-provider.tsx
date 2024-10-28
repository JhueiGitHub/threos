// providers/os-provider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import type { Profile, Desktop, Constellation, FlowConfig } from "@prisma/client";

interface OSContextType {
  profile: Profile | null;
  desktop: Desktop | null;
  activeConstellation: Constellation | null;
  activeFlowConfig: FlowConfig | null;
  isLoading: boolean;
  refreshOS: () => Promise<void>;
  switchConstellation: (constellationId: string) => Promise<void>;
  updateDesktopSettings: (settings: Partial<Desktop>) => Promise<void>;
}

const OSContext = createContext<OSContextType | null>(null);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [desktop, setDesktop] = useState<Desktop | null>(null);
  const [activeConstellation, setActiveConstellation] = useState<Constellation | null>(null);
  const [activeFlowConfig, setActiveFlowConfig] = useState<FlowConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshOS = async () => {
    try {
      setIsLoading(true);
      const profile = await currentProfile();
      
      if (!profile) {
        setIsLoading(false);
        return;
      }

      const [desktop, constellation, flowConfig] = await Promise.all([
        db.desktop.findUnique({
          where: { profileId: profile.id }
        }),
        db.constellation.findFirst({
          where: { 
            id: profile.activeConstellation || undefined,
            profileId: profile.id
          },
          include: {
            dockConfig: true,
            appStates: {
              include: {
                app: true,
                installedApp: true
              }
            }
          }
        }),
        db.flowConfig.findFirst({
          where: {
            profileId: profile.id,
            app: {
              name: 'flow'
            }
          }
        })
      ]);

      setProfile(profile);
      setDesktop(desktop);
      setActiveConstellation(constellation);
      setActiveFlowConfig(flowConfig);
    } catch (error) {
      console.error('Failed to refresh OS state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchConstellation = async (constellationId: string) => {
    if (!profile) return;

    try {
      await db.profile.update({
        where: { id: profile.id },
        data: { activeConstellation: constellationId }
      });

      await refreshOS();
    } catch (error) {
      console.error('Failed to switch constellation:', error);
    }
  };

  const updateDesktopSettings = async (settings: Partial<Desktop>) => {
    if (!desktop) return;

    try {
      const updatedDesktop = await db.desktop.update({
        where: { id: desktop.id },
        data: settings
      });

      setDesktop(updatedDesktop);
    } catch (error) {
      console.error('Failed to update desktop settings:', error);
    }
  };

  useEffect(() => {
    refreshOS();
  }, []);

  return (
    <OSContext.Provider 
      value={{
        profile,
        desktop,
        activeConstellation,
        activeFlowConfig,
        isLoading,
        refreshOS,
        switchConstellation,
        updateDesktopSettings
      }}
    >
      {children}
    </OSContext.Provider>
  );
}

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};