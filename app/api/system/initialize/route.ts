// app/api/system/initialize/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { initializeOrionOS } from "@/lib/initial-setup";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, imageUrl, constellation, wallpaper } = await req.json();

    const system = await initializeOrionOS({
      user,
      customization: {
        name,
        imageUrl,
        constellationName: constellation,
        wallpaper,
      },
    });

    return NextResponse.json(system);
  } catch (error) {
    console.error("[SYSTEM_INITIALIZATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
