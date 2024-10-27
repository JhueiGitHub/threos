// /lib/initial-profile.ts
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { zenithFlow } from "@/lib/zenith-flow";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  // Create new profile
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  // Create default stream
  const defaultStream = await db.stream.create({
    data: {
      name: "OS",
      description: "Default OrionOS stream",
      isDefault: true,
      profileId: newProfile.id,
    },
  });

  // Create default flow with Zenith tokens
  const defaultFlow = await db.flow.create({
    data: {
      name: zenithFlow.name,
      description: zenithFlow.description,
      isDefault: true,
      streamId: defaultStream.id,
      profileId: newProfile.id,
    },
  });

  // Create tokens batch
  await db.token.createMany({
    data: zenithFlow.tokens.map((token) => ({
      ...token,
      flowId: defaultFlow.id,
    })),
  });

  // Create fonts batch
  await db.font.createMany({
    data: zenithFlow.fonts.map((font) => ({
      ...font,
      flowId: defaultFlow.id,
    })),
  });

  // Create assets batch
  await db.asset.createMany({
    data: zenithFlow.assets.map((asset) => ({
      ...asset,
      flowId: defaultFlow.id,
    })),
  });

  return newProfile;
};
