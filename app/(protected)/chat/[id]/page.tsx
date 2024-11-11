import ChatUI from "@/components/Chat/ChatUI";
import LayoutMain from "@/components/layouts/LayoutMain"
import { constructMetadata } from "@/lib/utils";


export default function Page({ params }) {
  const { id } = params;
  return <LayoutMain>
    <ChatUI chatId={id} />
  </LayoutMain>
}