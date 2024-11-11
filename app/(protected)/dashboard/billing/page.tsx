import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";
import { Icons } from "@/components/shared/icons";

export const metadata = constructMetadata({
  title: "Billing – InspireYT",
  description: "Manage billing and your subscription plan.",
});

export default async function BillingPage() {
  const user = await getCurrentUser();

  let userSubscriptionPlan;
  if (user && user.id && user.role === "USER") {
    userSubscriptionPlan = await getUserSubscriptionPlan(user.id);
  } else {
    redirect("/login");
  }

  return (
    <>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8 pt-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>Upgrade Your Plan</AlertTitle>
          <AlertDescription className="text-balance">
            Unlock premium features by upgrading your plan today! Enjoy enhanced tools, increased limits, and priority support to get the most out of your SaaS experience.
            <br />
            To explore available plans and pricing, visit our{" "}
            <a
              href="/pricing"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Pricing Page
            </a>
            .
          </AlertDescription>
        </Alert>

        <BillingInfo userSubscriptionPlan={userSubscriptionPlan} />
      </div>
    </>
  );
}
