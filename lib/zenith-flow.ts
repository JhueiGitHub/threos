// /lib/zenith-flow.ts
import { TokenCategory, FontCategory, AssetCategory } from "@prisma/client";

export const zenithFlow = {
  name: "Zenith",
  description: "Default OrionOS design system",
  tokens: [
    // Background colors
    {
      name: "underlying-bg",
      value: "#292929",
      category: TokenCategory.COLOR,
      description: "81% opacity background base",
    },
    {
      name: "overlay-bg",
      value: "#010203",
      category: TokenCategory.COLOR,
      description: "69% opacity overlay background",
    },
    {
      name: "border",
      value: "#292929",
      category: TokenCategory.COLOR,
      description: "81% opacity borders",
    },

    // System colors
    {
      name: "black",
      value: "#000000",
      category: TokenCategory.COLOR,
      description: "Pure black",
    },
    {
      name: "glass",
      value: "#000000",
      category: TokenCategory.COLOR,
      description: "30% opacity glass effect",
    },
    {
      name: "white",
      value: "#CCCCCC",
      category: TokenCategory.COLOR,
      description: "69% opacity white",
    },

    // Status colors
    {
      name: "active",
      value: "#28C840",
      category: TokenCategory.COLOR,
      description: "Success/active state",
    },
    {
      name: "warning",
      value: "#FEBC2E",
      category: TokenCategory.COLOR,
      description: "Warning state",
    },
    {
      name: "error",
      value: "#FF5F57",
      category: TokenCategory.COLOR,
      description: "Error state",
    },

    // Accent colors
    {
      name: "accent-lilac",
      value: "#7B6CBD",
      category: TokenCategory.COLOR,
      description: "Primary accent",
    },
    {
      name: "accent-teal",
      value: "#003431",
      category: TokenCategory.COLOR,
      description: "Secondary accent",
    },

    // Text colors
    {
      name: "text-primary",
      value: "#ABC4C3",
      category: TokenCategory.COLOR,
      description: "Header text",
    },
    {
      name: "text-secondary",
      value: "#748393",
      category: TokenCategory.COLOR,
      description: "Body text",
    },

    // Shadows
    {
      name: "window-shadow",
      value: "0 8px 32px rgba(0, 0, 0, 0.25)",
      category: TokenCategory.SHADOW,
    },
    {
      name: "dock-shadow",
      value: "0 4px 16px rgba(0, 0, 0, 0.15)",
      category: TokenCategory.SHADOW,
    },

    // Borders
    { name: "border-radius-sm", value: "6px", category: TokenCategory.BORDER },
    { name: "border-radius-md", value: "8px", category: TokenCategory.BORDER },
    { name: "border-radius-lg", value: "12px", category: TokenCategory.BORDER },

    // Blur effects
    { name: "glass-blur", value: "16px", category: TokenCategory.BLUR },

    // Spacing
    { name: "spacing-xs", value: "4px", category: TokenCategory.SPACING },
    { name: "spacing-sm", value: "8px", category: TokenCategory.SPACING },
    { name: "spacing-md", value: "16px", category: TokenCategory.SPACING },
    { name: "spacing-lg", value: "24px", category: TokenCategory.SPACING },
    { name: "spacing-xl", value: "32px", category: TokenCategory.SPACING },
  ],
  fonts: [
    {
      name: "Arial",
      url: "/fonts/arial.woff2",
      category: FontCategory.PRIMARY,
      variants: ["400", "500", "600", "700"],
    },
    {
      name: "Inter",
      url: "/fonts/inter.woff2",
      category: FontCategory.SECONDARY,
      variants: ["400", "500", "600"],
    },
  ],
  assets: [
    {
      name: "default-wallpaper",
      url: "/assets/wallpapers/zenith-dark.jpg",
      category: AssetCategory.WALLPAPER,
    },
    {
      name: "finder-icon",
      url: "/assets/icons/finder.svg",
      category: AssetCategory.ICON,
    },
  ],
};

// Type definitions to match Prisma schema
export type ZenithToken = (typeof zenithFlow.tokens)[number];
export type ZenithFont = (typeof zenithFlow.fonts)[number];
export type ZenithAsset = (typeof zenithFlow.assets)[number];
