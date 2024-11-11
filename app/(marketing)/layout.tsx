import { NavBar } from "@/components/layout/navbar";
import { NavMobile } from "@/components/layout/mobile-nav";
import LayoutMain from "@/components/layouts/LayoutMain";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div>
      <LayoutMain>
        <main>{children}</main>
      </LayoutMain>
    </div>
  );
}
