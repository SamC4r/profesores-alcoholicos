'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { user } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { trpc } from "@/trpc/client";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const {
        data: session,
        // isPending,
        // error,
        // refetch,
    } = authClient.useSession();

    const userId = session?.user.id || ""

    const route = useRouter();

    const { data } = trpc.users.getOne.useQuery({ userId })


    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="mx-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                        <span className="text-xl font-bold text-green-900">BeerSP</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/beers"
                            className="text-green-700 hover:text-green-900 transition-colors"
                        >
                            Cervezas
                        </Link>
                        <Link
                            href="/ratings"
                            className="text-green-700 hover:text-green-900 transition-colors"
                        >
                            Mis valoraciones
                        </Link>
                        <Link
                            href="/locations"
                            className="text-green-700 hover:text-green-900 transition-colors"
                        >
                            Locales
                        </Link>

                        {!!session && !!data && !!user ? (
                            <UserInfo
                                id={data.user.id}
                                imageUrl={data.user.imageUrl || ""}
                                name={data.user.name}
                                username={data.user.username}
                                navbar
                            />
                        ) : (
                            <Button
                                onClick={() => route.push('/sign-in')}
                                className="bg-green-600 hover:bg-green-700 hover:cursor-pointer"
                            >
                                <LogIn className="size-4" />
                                Iniciar sesión
                            </Button>
                        )}


                    </div>
                </div>
            </div>
        </nav>
    );
}