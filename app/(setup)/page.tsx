import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();

  const desktop = await db.desktop.findFirst({
    where: {
      profileId: profile.id,
    },
  });

  if (desktop) {
    return redirect(`/desktops/${desktop.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
