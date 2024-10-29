// components/desktop/dock.tsx
"use client";

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

const links = [
  {
    title: "Flow",
    image: "/icns/finder.png",
    href: "#",
  },
  {
    title: "Stellar",
    image: "/icns/settings.png",
    href: "#",
  },
  {
    title: "Zeru",
    image: "/icns/mila.png",
    href: "#",
  },
  {
    title: "Mila",
    image: "/icns/zeru.png",
    href: "#",
  },
  {
    title: "Discord",
    image: "/icns/figma.png",
    href: "#",
  },
  {
    title: "Apps",
    image: "/icns/desktop.png",
    href: "#",
  },
];

export const Dock = () => {
  let mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "fixed bottom-3 left-1/2 -translate-x-1/2",
        "mx-auto hidden md:flex px-1 py-0.5",
        "bg-black/20 backdrop-blur-2xl",
        "border border-white/[0.08]"
      )}
      style={{
        borderRadius: "19px",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)", // iOS corner smoothing
      }}
    >
      <div className="flex gap-[3px] items-center">
        {links.map((link) => (
          <IconContainer mouseX={mouseX} key={link.title} {...link} />
        ))}
      </div>
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  image,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  image: string;
  href: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Adjusted for 68px base size with scaling
  let widthTransform = useTransform(distance, [-150, 0, 150], [68, 82, 68]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [68, 82, 68]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
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
              className="absolute left-1/2 -top-8 px-2 py-0.5 rounded-md bg-black/20 backdrop-blur-xl border border-white/[0.08] text-white text-xs whitespace-nowrap"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          ref={ref}
          style={{ width, height }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "flex items-center justify-center",
            "relative overflow-hidden"
          )}
        >
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </Link>
  );
}
