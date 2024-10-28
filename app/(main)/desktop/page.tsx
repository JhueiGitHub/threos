// app/(main)/desktop/page.tsx
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DesktopClient } from "./desktop-client";

export default async function DesktopPage() {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const desktop = await db.desktop.findUnique({
    where: {
      profileId: profile.id,
    },
  });

  if (!desktop) {
    return redirect("/");
  }

  const constellation = await db.constellation.findFirst({
    where: {
      id: profile.activeConstellation || undefined,
      profileId: profile.id,
    },
    include: {
      appStates: {
        include: {
          app: true,
          installedApp: true,
        },
      },
    },
  });

  if (!constellation) {
    return redirect("/");
  }

  return (
    <DesktopClient
      profile={profile}
      desktop={desktop}
      constellation={constellation}
    />
  );
}
