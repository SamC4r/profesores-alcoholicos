import { UsersView } from "@/modules/users/ui/views/users-view";
import { HydrateClient, trpc } from "@/trpc/server";


type Props = {
    params: Promise<{userId: string}>
}

const Page = async ({params}:Props) => {

    const {userId} = await params;

    void trpc.users.getOne.prefetch({userId})


    return (
        <HydrateClient>
            <UsersView userId={userId} />
        </HydrateClient>
    )
}

export default Page;