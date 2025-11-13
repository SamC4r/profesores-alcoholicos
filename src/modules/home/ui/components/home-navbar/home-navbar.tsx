'use client'
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export const Navbar = () => {
    const {
        data: session,
        // isPending,
        // error,
        // refetch,
    } = authClient.useSession();

    const userId = session?.user.id


    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-full"></div>
                        <span className="text-xl font-bold text-emerald-900">BeerSP</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/beers"
                            className="text-emerald-700 hover:text-emerald-900 transition-colors"
                        >
                            Beers
                        </Link>
                        <Link
                            href="/ratings"
                            className="text-emerald-700 hover:text-emerald-900 transition-colors"
                        >
                            My Ratings
                        </Link>
                        <Link
                            href="/locations"
                            className="text-emerald-700 hover:text-emerald-900 transition-colors"
                        >
                            Locations
                        </Link>
                        <Link
                            href={`/users/${userId}`}
                            className="text-emerald-700 hover:text-emerald-900 transition-colors"
                        >
                            Profile
                        </Link>
                        {session ?

                            <Button
                                onClick={() => authClient.signOut()}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                Sign out
                            </Button>
                            :
                            <Link href={"/sign-in"}>
                                Crea una cuenta
                            </Link>
                        }

                    </div>
                </div>
            </div>
        </nav>
    );
}