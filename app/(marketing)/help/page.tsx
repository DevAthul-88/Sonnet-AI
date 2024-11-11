import Help from "@/components/Help";
import LayoutMain from "@/components/layouts/LayoutMain"
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
    title: "Help - Sonnet By Athul",
});

export default function Page() {
    return <>
        <div className="mt-5 mb-5">
            <Help />
        </div>
    </>
}