// app/desktop/page.tsx
import { redirect } from "next/navigation";
import { DesktopLayout } from "@/components/desktop/desktop-layout";
import { initialProfile } from "@/lib/initial-profile";

const DesktopPage = async () => {
  const profile = await initialProfile();

  return <DesktopLayout />;
};

export default DesktopPage;
