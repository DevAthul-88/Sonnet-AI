import LayoutMain from "@/components/layouts/LayoutMain"
import ChatUI from "@/components/Share/ChatUI";

export default function Page({ params }) {
  const { id } = params;
  return <>
    <ChatUI chatId={id} />
  </>
}