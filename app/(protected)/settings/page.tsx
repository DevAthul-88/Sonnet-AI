import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserNameForm } from "@/components/forms/user-name-form";
import LayoutMain from "@/components/layouts/LayoutMain";

export const metadata = constructMetadata({
  title: "Settings – Sonnet By Athul",
  description: "Configure your account",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <LayoutMain>
      <div className="p-6">
      <DashboardHeader
        heading="Settings"
        text="Manage your account"
      />
      <div className="divide-y divide-muted pb-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <DeleteAccountSection />
      </div>
      </div>
    </LayoutMain>
  );
}
