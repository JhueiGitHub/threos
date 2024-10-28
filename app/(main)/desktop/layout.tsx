// app/(main)/desktop/layout.tsx
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export default async function DesktopLayout({ children }: DesktopLayoutProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  return <div className="h-screen">{children}</div>;
}
