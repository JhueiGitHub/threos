// app/api/system/initialize/route.ts
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      name,
      imageUrl,
      constellation = "Default Workspace",
    } = await req.json();

    // Create Desktop (Singleton)
    const desktop = await db.desktop.create({
      data: {
        profileId: profile.id,
        wallpaper: "/wallpapers/default-black.jpg",
        dockPosition: "bottom",
        dockAutoHide: true,
        menuBarAutoHide: false,
      },
    });

    // Create Default Constellation
    const defaultConstellation = await db.constellation.create({
      data: {
        name: constellation,
        profileId: profile.id,
        description: "Default workspace",
      },
    });

    // Update profile with active constellation
    await db.profile.update({
      where: { id: profile.id },
      data: { activeConstellation: defaultConstellation.id },
    });

    // Initialize Drive
    const drive = await db.drive.create({
      data: {
        profileId: profile.id,
      },
    });

    return NextResponse.json({
      success: true,
      desktop: desktop.id,
      constellation: defaultConstellation.id,
      drive: drive.id,
    });
  } catch (error) {
    console.log("[SYSTEM_INITIALIZE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
