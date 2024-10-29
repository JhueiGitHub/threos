// lib/initial-profile.ts
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
    include: {
      constellations: true,
      streams: {
        include: {
          flows: true,
        },
      },
      driveItems: true,
    },
  });

  if (profile) {
    return profile;
  }

  // Create new profile with default environment
  const newProfile = await db.user.create({
    data: {
      clerkId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,

      // Create default streams
      streams: {
        create: [
          {
            name: "OS",
            type: "SYSTEM",
            // Create default Zenith flow within OS stream
            flows: {
              create: [
                {
                  name: "Zenith",
                  type: "CORE",
                  content: {
                    colors: {
                      background: { primary: "#292929", secondary: "#010203" },
                      border: { primary: "#292929", secondary: "#FFFFFF" },
                      text: { primary: "#ABC4C3", secondary: "#748393" },
                      accent: { primary: "#7B6CBD", secondary: "#003431" },
                      system: {
                        active: "#28C840",
                        warning: "#FEBC2E",
                        error: "#FF5F57",
                      },
                    },
                    typography: {
                      fontFamilies: {
                        primary: "Arial",
                        secondary: "Inter",
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            name: "Apps",
            type: "APPLICATION",
            // Create app-specific flows
            flows: {
              create: [
                {
                  name: "Zenith-OS",
                  type: "APP",
                  content: {
                    wallpaper: null,
                    dockIcons: [],
                    useFlow: "Zenith", // Reference to OS stream's Zenith flow
                  },
                },
                {
                  name: "Zenith-Stellar",
                  type: "APP",
                  content: {
                    useFlow: "Zenith",
                  },
                },
                {
                  name: "Zenith-Flow",
                  type: "APP",
                  content: {
                    useFlow: "Zenith",
                  },
                },
              ],
            },
          },
        ],
      },

      // Create root drive directory
      driveItems: {
        create: {
          name: "Root",
          type: "FOLDER",
          path: "/",
        },
      },
    },
    include: {
      streams: {
        include: {
          flows: true,
        },
      },
      driveItems: true,
    },
  });

  // Create default Zenith constellation pointing to app flows
  const appStream = newProfile.streams.find((s) => s.type === "APPLICATION");
  const constellation = await db.constellation.create({
    data: {
      name: "Zenith",
      isActive: true,
      userId: newProfile.id,
      configs: {
        create: appStream?.flows.map((flow) => ({
          appId: flow.name.split("-")[1].toLowerCase(),
          flowId: flow.id,
        })),
      },
    },
  });

  return newProfile;
};
