// app/(setup)/page.tsx

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { InitialModal } from "@/components/modals/initial-modal";
import { initializeOrionOS } from "@/lib/initial-setup";

const SetupPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  // Check if user already has a profile and desktop setup
  const existingProfile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      desktop: true,
      constellations: {
        where: {
          name: "Default Workspace",
        },
        take: 1,
      },
    },
  });

  // If user has a complete setup, redirect to their desktop
  if (existingProfile?.desktop && existingProfile.constellations[0]) {
    return redirect(
      `/desktop/${existingProfile.id}?constellation=${existingProfile.constellations[0].id}`
    );
  }

  // If setup is incomplete, initialize the user's environment
  const customization = {
    name: `${user.firstName} ${user.lastName}`,
    imageUrl: user.imageUrl,
    constellationName: "Default Workspace",
    wallpaper: "/wallpapers/default-black.jpg",
  };

  const initializedProfile = await initializeOrionOS({
    user,
    customization,
  });

  // Redirect to the desktop with the newly created profile
  return redirect(
    `/desktop/${initializedProfile.profile.id}?constellation=${initializedProfile.constellation.id}`
  );
};

export default SetupPage;
