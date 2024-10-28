// components/desktop/dock.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Constellation } from "@prisma/client";

interface DockProps {
  position?: "bottom" | "left" | "right";
  autoHide?: boolean;
  constellation: Constellation;
  className?: string;
}

export function Dock({
  position = "bottom",
  autoHide = true,
  constellation,
  className,
}: DockProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);

  useEffect(() => {
    if (!autoHide) return;

    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      const threshold = 20;
      const isNearDock =
        position === "bottom"
          ? e.clientY >= window.innerHeight - threshold
          : position === "left"
          ? e.clientX <= threshold
          : e.clientX >= window.innerWidth - threshold;

      if (isNearDock) {
        setIsVisible(true);
        clearTimeout(timeoutId);
      } else {
        timeoutId = setTimeout(() => setIsVisible(false), 1000);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [autoHide, position]);

  return (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0 }}
      className={cn(
        "fixed p-2 backdrop-blur-xl bg-background/20",
        position === "bottom" && "bottom-0 left-1/2 -translate-x-1/2",
        position === "left" && "left-0 top-1/2 -translate-y-1/2",
        position === "right" && "right-0 top-1/2 -translate-y-1/2",
        "flex items-center gap-1 rounded-xl border border-border/50",
        className
      )}
    >
      {/* Dock items implementation */}
    </motion.div>
  );
}
