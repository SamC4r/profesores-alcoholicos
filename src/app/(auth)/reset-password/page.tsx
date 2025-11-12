import { ResetPasswordView } from "@/modules/auth/ui/views/reset-password";
import { Suspense } from "react";

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordView />
        </Suspense>
    )
}

export default Page;