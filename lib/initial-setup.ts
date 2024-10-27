// lib/initial-setup.ts

import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Custom types for initialization
interface CustomizationOptions {
  name: string;
  imageUrl: string;
  constellationName: string;
  wallpaper: string;
}

interface InitializationOptions {
  user: any;
  customization: CustomizationOptions;
}

interface DockItem {
  appId: string;
  position: number;
}

// Helper function for BigInt serialization
const serializeBigInt = (obj: any): any => {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

export const initializeOrionOS = async ({
  user,
  customization,
}: InitializationOptions) => {
  if (!user) {
    return redirectToSignIn();
  }

  // Check for existing profile
  const existingProfile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      desktop: true,
      drive: true,
      constellations: {
        include: {
          dockConfig: true,
          appStates: true,
        },
      },
      installedApps: {
        include: {
          flowConfig: true,
        },
      },
    },
  });

  if (existingProfile) {
    return serializeBigInt(existingProfile);
  }

  // Create the entire OS environment atomically
  const result = await db.$transaction(async (transaction) => {
    // Step 1: Create profile
    const profile = await transaction.profile.create({
      data: {
        userId: user.id,
        name: customization.name || `${user.firstName} ${user.lastName}`,
        imageUrl: customization.imageUrl || user.imageUrl || "",
        email: user.emailAddresses[0].emailAddress,
      },
    });

    // Step 2: Create desktop
    const desktop = await transaction.desktop.create({
      data: {
        profileId: profile.id,
        wallpaper: customization.wallpaper || "/wallpapers/default-black.jpg",
        dockPosition: "bottom",
        dockAutoHide: true,
        menuBarAutoHide: false,
      },
    });

    // Step 3: Create drive with proper Prisma BigInt types
    const drive = await transaction.drive.create({
      data: {
        profileId: profile.id,
        totalStorage: 0,
        storageLimit: 10737418240, // 10GB
      },
    });

    // Step 4: Create initial stream for flows
    const systemStream = await transaction.stream.create({
      data: {
        name: "System",
        description: "System-wide flows and configurations",
        profileId: profile.id,
      },
    });

    // Step 5: Create Zenith flow
    const zenithFlow = await transaction.flow.create({
      data: {
        name: "Zenith",
        description: "Default system design tokens",
        isSystem: true,
        streamId: systemStream.id,
        tokens: {
          backgrounds: {
            underlying: { value: "#292929", opacity: 0.81 },
            overlaying: { value: "#010203", opacity: 0.69 },
          },
          borders: {
            primary: { value: "#292929", opacity: 0.81 },
            thin: { value: "#FFFFFF", opacity: 0.09 },
          },
          glass: {
            light: { value: "#000000", opacity: 0.3 },
            heavy: { value: "#000000", opacity: 0.84 },
          },
          colors: {
            black: { value: "#000000" },
            white: { value: "#CCCCCC", opacity: 0.69 },
          },
          status: {
            active: { value: "#28C840" },
            warning: { value: "#FEBC2E" },
            error: { value: "#FF5F57" },
          },
          accents: {
            lilac: { value: "#7B6CBD" },
            teal: { value: "#003431" },
          },
          typography: {
            primary: {
              font: "Arial",
              color: { value: "#ABC4C3" },
            },
            secondary: {
              font: "Inter",
              color: { value: "#748393" },
            },
          },
        } as Prisma.JsonObject,
      },
    });

    // Step 6: Register core system apps
    const coreApps = await Promise.all([
      // Flow App
      transaction.app.create({
        data: {
          name: "flow",
          displayName: "Flow",
          description: "Design System Manager",
          iconUrl: "/apps/flow/icon.svg",
          isSystem: true,
          defaultWindowConfig: {
            width: 1200,
            height: 800,
            position: { x: "center", y: "center" },
          } as Prisma.JsonObject,
          supportedFeatures: ["flowSystem", "realtime", "canvas"],
        },
      }),
      // Stellar App
      transaction.app.create({
        data: {
          name: "stellar",
          displayName: "Stellar",
          description: "File System Manager",
          iconUrl: "/apps/stellar/icon.svg",
          isSystem: true,
          defaultWindowConfig: {
            width: 900,
            height: 600,
            position: { x: "center", y: "center" },
          } as Prisma.JsonObject,
          supportedFeatures: ["fileSystem", "realtime"],
        },
      }),
    ]);

    // Create dock items array
    const dockItems = coreApps.map((app, index) => ({
      appId: app.id,
      position: index,
    }));

    // Create dock configuration
    const dockConfig = {
      items: dockItems,
      config: {
        position: "bottom",
        autoHide: true,
        magnification: true,
        size: 68,
      },
    };

    // Step 7: Create default constellation
    const defaultConstellation = await transaction.constellation.create({
      data: {
        profileId: profile.id,
        name: customization.constellationName || "Default Workspace",
        description: "Primary workspace environment",
        activeFlowId: zenithFlow.id,
        dockConfig: {
          create: {
            items: dockItems as Prisma.InputJsonValue[],
          },
        },
      },
    });

    // Step 8: Install core apps
    const installedApps = await Promise.all(
      coreApps.map((app) =>
        transaction.installedApp.create({
          data: {
            profileId: profile.id,
            appId: app.id,
            settings: app.defaultWindowConfig as Prisma.JsonObject,
            flowConfig: {
              create: {
                profileId: profile.id,
                appId: app.id,
                styleTokens: {} as Prisma.JsonObject,
                overrides: {} as Prisma.JsonObject,
              },
            },
          },
        })
      )
    );

    // Step 9: Create initial app states
    await Promise.all(
      installedApps.map((installedApp) =>
        transaction.appState.create({
          data: {
            appId: installedApp.appId,
            profileId: profile.id,
            constellationId: defaultConstellation.id,
            installedAppId: installedApp.id,
            isOpen: false,
            isMinimized: false,
            isMaximized: false,
            position: { x: 0, y: 0 } as Prisma.JsonObject,
            size: installedApp.settings as Prisma.JsonObject,
            contentState: {} as Prisma.JsonObject,
          },
        })
      )
    );

    // Log initialization
    const initializationLog = {
      profileId: profile.id,
      desktopId: desktop.id,
      driveId: drive.id,
      defaultConstellationId: defaultConstellation.id,
      zenithFlowId: zenithFlow.id,
      installedAppIds: installedApps.map((app) => app.id),
      driveStorage: {
        total: drive.totalStorage.toString(),
        limit: drive.storageLimit.toString(),
      },
    };

    console.log("OrionOS Initialization Complete:", initializationLog);

    return {
      profile,
      desktop,
      drive,
      constellation: defaultConstellation,
      flow: zenithFlow,
      installedApps,
    };
  });

  // Serialize the result before returning
  return serializeBigInt(result);
};
