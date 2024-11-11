import NotFound from '@/components/404'
import { constructMetadata } from '@/lib/utils';
import React from 'react'


export const metadata = constructMetadata({
    title: "Page Not Found – Sonnet By Athul",
});


function page() {
    return (
        <div>
            <NotFound />
        </div>
    )
}

export default page