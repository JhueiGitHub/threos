// components/desktop/window-chrome.tsx
"use client";

import { useState } from "react";
import { XIcon, MinusIcon, MaximizeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { App } from "@prisma/client";

interface WindowChromeProps {
  app: App;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export function WindowChrome({
  app,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize
}: WindowChromeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="h-7 px-3 flex items-center justify-between bg-background/90 border-b border-border/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          className="w-3 h-3 rounded-full bg-red-500"
        >
          {isHovered && <XIcon className="w-2 h-2" />}
        </button>
        <button
          onClick={onMinimize}
          className="w-3 h-3 rounded-full bg-yellow-500"
        >
          {isHovered && <MinusIcon className="w-2 h-2" />}
        </button>
        <button
          onClick={onMaximize}
          className="w-3 h-3 rounded-full bg-green-500"
        >
          {isHovered && <MaximizeIcon className="w-2 h-2" />}
        </button>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2">
        {app.displayName}
      </div>
    </div>
  );
}