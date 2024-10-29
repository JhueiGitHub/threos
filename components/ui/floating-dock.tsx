// components/ui/floating-dock.tsx
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    isActive?: boolean;
  }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    isActive?: boolean;
  }[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex h-16 items-end rounded-xl px-2 pb-2",
        // Modified background for macOS glass effect
        "bg-[rgba(0,0,0,0.84)] backdrop-blur-md",
        // Subtle border for depth
        "border border-[rgba(255,255,255,0.09)]",
        className
      )}
    >
      <div className="flex gap-2 items-end">
        {items.map((item, i) => (
          <IconContainer
            mouseX={mouseX}
            key={item.title}
            {...item}
            isFirst={i === 0}
            isLast={i === items.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  isActive,
  isFirst,
  isLast,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Increased scaling range for more pronounced effect
  let widthTransform = useTransform(distance, [-200, 0, 200], [45, 90, 45]);
  let heightTransform = useTransform(distance, [-200, 0, 200], [45, 90, 45]);
  let scaleTransform = useTransform(distance, [-200, 0, 200], [0.5, 1, 0.5]);

  // Added spring physics for smoother animations
  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 120,
    damping: 15,
  });

  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 120,
    damping: 15,
  });

  let scale = useSpring(scaleTransform, {
    mass: 0.1,
    stiffness: 120,
    damping: 15,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href}>
      <div className="relative">
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className={cn(
                "absolute left-1/2 -top-10 w-fit min-w-max",
                "px-3 py-1 rounded-md",
                "bg-[rgba(0,0,0,0.84)] backdrop-blur-md",
                "border border-[rgba(255,255,255,0.09)]",
                "text-[#ABC4C3] text-sm"
              )}
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          ref={ref}
          style={{
            width,
            height,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "relative flex items-center justify-center",
            "rounded-full",
            isActive &&
              "after:absolute after:bottom-[-8px] after:w-1 after:h-1",
            "after:rounded-full after:bg-[#28C840]",
            "hover:brightness-110 transition-all"
          )}
        >
          <motion.div
            style={{ scale }}
            className="w-12 h-12 flex items-center justify-center"
          >
            {icon}
          </motion.div>

          <motion.div
            style={{ scale }}
            className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full"
          >
            <div className="w-full h-full bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </Link>
  );
}

// Mobile version remains mostly unchanged
const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: { delay: idx * 0.05 },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <Link
                  href={item.href}
                  key={item.title}
                  className={cn(
                    "h-10 w-10 rounded-full",
                    "bg-[rgba(0,0,0,0.84)] backdrop-blur-md",
                    "border border-[rgba(255,255,255,0.09)]",
                    "flex items-center justify-center"
                  )}
                >
                  <div className="h-4 w-4">{item.icon}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
