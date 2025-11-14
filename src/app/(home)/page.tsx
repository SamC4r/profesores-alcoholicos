import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { HomeView } from "@/modules/home/ui/components/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

import { useRouter } from "next/navigation";

export default function Home() {

  void trpc.users.getMany.prefetch();

  return (
    <HydrateClient>
      <HomeView />
    </HydrateClient>
  )

}
