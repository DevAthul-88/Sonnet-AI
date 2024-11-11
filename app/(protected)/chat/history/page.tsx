import HistoryList from "@/components/History/HistoryList";
import LayoutMain from "@/components/layouts/LayoutMain"
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Chat History - Sonnet By Athul",
});

export default function Page() {
  return <LayoutMain>
    <HistoryList />
  </LayoutMain>
}