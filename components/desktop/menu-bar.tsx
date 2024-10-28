"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import type { Profile, Constellation } from "@prisma/client";

interface MenuBarProps {
  autoHide?: boolean;
  className?: string;
}

export function MenuBar({ autoHide, className }: MenuBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Load profile and constellations
  useEffect(() => {
    const loadData = async () => {
      const profile = await currentProfile();
      if (profile) {
        setProfile(profile);

        const constellations = await db.constellation.findMany({
          where: {
            profileId: profile.id,
          },
        });

        setConstellations(constellations);
      }
    };

    loadData();
  }, []);

  // Handle menu bar visibility
  useEffect(() => {
    if (!autoHide) return;

    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 2) {
        setIsVisible(true);
        clearTimeout(timeoutId);
      } else if (e.clientY > 40 && !activeMenu) {
        timeoutId = setTimeout(() => setIsVisible(false), 1000);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [autoHide, activeMenu]);

  const handleSwitchConstellation = async (constellationId: string) => {
    if (!profile) return;

    try {
      await db.profile.update({
        where: { id: profile.id },
        data: { activeConstellation: constellationId },
      });

      // Trigger any necessary UI updates
    } catch (error) {
      console.error("Failed to switch constellation:", error);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{
        y: isVisible ? 0 : -40,
        opacity: isVisible ? 1 : 0,
      }}
      className={cn(
        "fixed top-0 left-0 right-0 h-8 z-50",
        "bg-background/80 backdrop-blur-md border-b border-border/50",
        className
      )}
    >
      <div className="flex items-center h-full px-2 gap-4">
        {/* Orion Menu */}
        <MenuBarItem
          icon="/logo.svg"
          label="Orion"
          isActive={activeMenu === "orion"}
          onClick={() => setActiveMenu(activeMenu === "orion" ? null : "orion")}
        >
          <MenuBarDropdown
            items={[
              {
                label: "About OrionOS",
                onClick: () => {},
              },
              {
                label: "Preferences",
                onClick: () => {},
              },
              { type: "separator" },
              {
                label: "Log Out",
                onClick: () => {},
              },
            ]}
          />
        </MenuBarItem>

        {/* Constellation Menu */}
        <MenuBarItem
          icon="/icons/constellation.svg"
          label="Constellation"
          isActive={activeMenu === "constellation"}
          onClick={() =>
            setActiveMenu(
              activeMenu === "constellation" ? null : "constellation"
            )
          }
        >
          <MenuBarDropdown
            items={constellations.map((constellation) => ({
              label: constellation.name,
              onClick: () => handleSwitchConstellation(constellation.id),
              isActive: profile?.activeConstellation === constellation.id,
            }))}
          />
        </MenuBarItem>

        {/* Flow Menu */}
        <MenuBarItem
          icon="/icons/flow.svg"
          label="Flow"
          isActive={activeMenu === "flow"}
          onClick={() => setActiveMenu(activeMenu === "flow" ? null : "flow")}
        >
          <MenuBarDropdown
            items={[
              {
                label: "Open Flow Dashboard",
                onClick: () => {},
              },
              { type: "separator" },
              {
                label: "New Flow",
                onClick: () => {},
              },
              {
                label: "Import Flow",
                onClick: () => {},
              },
            ]}
          />
        </MenuBarItem>
      </div>
    </motion.div>
  );
}

interface MenuBarItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

function MenuBarItem({
  icon,
  label,
  isActive,
  onClick,
  children,
}: MenuBarItemProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md",
          "text-sm font-medium transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent/50 hover:text-accent-foreground"
        )}
      >
        <img src={icon} alt="" className="w-4 h-4" />
        <span>{label}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      <AnimatePresence>{isActive && children}</AnimatePresence>
    </div>
  );
}

interface MenuBarDropdownProps {
  items: Array<
    | {
        label: string;
        onClick: () => void;
        isActive?: boolean;
      }
    | {
        type: "separator";
      }
  >;
}

function MenuBarDropdown({ items }: MenuBarDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 mt-1 w-56 rounded-md border border-border bg-popover shadow-lg"
    >
      <div className="py-1">
        {items.map((item, index) =>
          "type" in item ? (
            <div key={index} className="h-px my-1 bg-border" />
          ) : (
            <button
              key={index}
              onClick={item.onClick}
              className={cn(
                "w-full px-3 py-1.5 text-sm text-left transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                item.isActive && "bg-accent/50 text-accent-foreground"
              )}
            >
              {item.label}
            </button>
          )
        )}
      </div>
    </motion.div>
  );
}
