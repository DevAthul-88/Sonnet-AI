import ChatBox from "@/components/Home/ChatBox";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Sonnet By Athul",
});


export default function IndexPage() {
  return (
    <>
       <ChatBox />
    </>
  );
}
