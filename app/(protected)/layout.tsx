import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user) redirect("/");

  return (
    <div className="relative flex min-h-screen w-full">
        {children}
    </div>
  );
}
