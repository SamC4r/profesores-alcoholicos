'use client'

import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";

interface LayoutProps{
    children: React.ReactNode;
}


const Page = ({children}:LayoutProps) => {
    return (
        <HomeLayout>
            {children}
        </HomeLayout>
    )
}

export default Page;