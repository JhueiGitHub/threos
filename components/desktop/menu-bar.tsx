// components/desktop/menu-bar.tsx
"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  IconWifi,
  IconVolume,
  IconSearch,
  IconBattery,
  IconClock,
} from "@tabler/icons-react";

export const MenuBar = () => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const [time, setTime] = useState(getCurrentTime());

  useState(() => {
    const timer = setInterval(() => setTime(getCurrentTime()), 60000);
    return () => clearInterval(timer);
  });

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-6",
        "mix-blend-color-burn bg-black/21"
      )}
      style={{
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        background: "rgba(0, 0, 0, 0.21)",
      }}
    >
      <div className="h-full flex items-center justify-between px-2 text-white">
        <div className="flex items-center gap-4">
          <span>Orion</span>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Window</span>
          <span>Help</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <IconSearch className="h-4 w-4" />
          <IconWifi className="h-4 w-4" />
          <IconVolume className="h-4 w-4" />
          <IconBattery className="h-4 w-4" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};
