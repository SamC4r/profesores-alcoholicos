'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { trpc } from "@/trpc/client";
import { Check, UserPen, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export const HomeView = () => {

    const router = useRouter();

    const { data: session } = authClient.useSession();

    const goToSignIn = () => {
        router.push('/sign-in')
    }

    const goToSignUp = () => {
        router.push('/sign-up')
    }

    const [users] = trpc.users.getMany.useSuspenseQuery();

    if (session) {


        return (
            <div className="min-h-screen bg-gradient-to-br">
                {/* Header */}
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
                            Hola {session.user.name}
                        </h1>

                    </div>

                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <h3 className="font-semibold text-green-900 mb-2">Calificar Cerveza</h3>
                            <p className="text-green-700 text-sm">Comparte tus gustos</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <span className="text-2xl">🔍</span>
                            </div>
                            <h3 className="font-semibold text-green-900 mb-2">Descubre</h3>
                            <p className="text-green-700 text-sm">Encuentra nuevas cervezas para probar</p>
                        </div>

                        <Link href={`/users/${session.user.id}`}>
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-green-500 text-center hover:scale-105 transition duration-100">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <UserPen />
                                </div>
                                <h3 className="font-semibold text-green-900 mb-2">Mi perfil</h3>
                                <p className="text-green-700 text-sm">Accede a tus estadisticas y mira tus</p>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Activity */}
                    <Card className="bg-white rounded-xl p-6 shadow-sm border border-green-100 max-w-2xl mx-auto">
                        <CardHeader className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <CardTitle>
                                Usuarios
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                        {users.map((item) => (
                            <>
                                <UserInfo
                                    id={item.id}
                                    name={item.name}
                                    imageUrl={item.imageUrl}
                                    username={item.username}
                                />
                            </>
                        ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }




    return (

        <div className="min-h-screen bg-gradient-to-br ">


            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">

                    <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-6">
                        BeerSP
                    </h1>

                    <p className="text-xl text-green-800 mb-8 max-w-2xl mx-auto">
                        Califica tus cervezas favoritas
                    </p>



                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={goToSignIn}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                        >
                            Iniciar sesión
                        </Button>

                        <Button
                            onClick={goToSignUp}
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg"
                        >
                            Crear cuenta
                        </Button>
                    </div>


                </div>
            </main>
        </div>
    );



};