import ArchivedList from "@/components/Archived/ArchivedList";
import LayoutMain from "@/components/layouts/LayoutMain"
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Archived Chats - Sonnet By Athul",
});

export default function Page() {
  return <LayoutMain>
    <ArchivedList />
  </LayoutMain>
}