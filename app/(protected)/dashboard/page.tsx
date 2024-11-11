import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import NavCards from "@/components/NavCards";

export const metadata = constructMetadata({
  title: "Dashboard – InspireYT",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();



  return (
    <>
      <DashboardHeader
        heading="Dashboard"
      />

      <div className="mt-8">
        <NavCards />
      </div>
    </>
  );
}
