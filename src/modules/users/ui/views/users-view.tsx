'use client'

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, UserPlus, Calendar, Mail, Phone, Edit, Check, MessageCircle, OctagonAlertIcon, Search, UserCheck, Users, X, Beer, Store, Send, LogOut, Pen, PencilIcon } from "lucide-react";
import { trpc } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, useSession } from "@/lib/auth-client";
import { ThumbnailUploadModal } from "../components/image-upload-modal";
import { UserInfo } from "../components/user-info";
import { UserFriendRequest } from "../components/user-friend-request";
import { Input } from "@/components/ui/input";
import { compactDate } from "@/lib/utils";
import { ResponsiveModal } from "@/components/responsive-modal";
import { DescriptionForm } from "../components/description-edit-form";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";

interface Props {
    userId: string;
}

export const UsersView = ({ userId }: Props) => {
    return (
        <Suspense fallback={<ProfileLoading />}>
            <ErrorBoundary fallback={<ProfileError />}>
                <UsersViewSuspense userId={userId} />
            </ErrorBoundary>
        </Suspense>
    );
}

const ProfileLoading = () => (
    <div className="min-h-screen bg-gradient-to-br  p-6">
        <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
                <Skeleton className="h-8 w-64 bg-green-200/50" />
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-32 bg-white/80 rounded-xl" />
                    <Skeleton className="h-32 bg-white/80 rounded-xl" />
                    <Skeleton className="h-32 bg-white/80 rounded-xl" />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-48 bg-white/80 rounded-xl" />
                        <Skeleton className="h-64 bg-white/80 rounded-xl" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-48 bg-white/80 rounded-xl" />
                        <Skeleton className="h-32 bg-white/80 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ProfileError = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-0 shadow-lg">
            <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <OctagonAlertIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
                <p className="text-gray-600 mb-4">We could not load the user profile. Please try again.</p>
                <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </Button>
            </CardContent>
        </Card>
    </div>
);

export const UsersViewSuspense = ({ userId }: Props) => {
    const { data: userData } = trpc.users.getOne.useQuery({ userId });
    // const { data: recentLocations } = trpc.users.getRecentLocations.useQuery({ userId });

    const [friends] = trpc.users.getFriends.useSuspenseQuery({ userId })
    const [pendientes] = trpc.users.getPending.useSuspenseQuery({ userId })
    const [degustaciones] = trpc.users.getDegustaciones.useSuspenseQuery({ userId })

    console.log("FRIENDS", friends)

    const { data: session } = useSession();

    const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");



    const { data: amigos } = trpc.users.getFriendship.useQuery({ userId })

    const utils = trpc.useUtils();

    const { mutate: sendFriendRequest, isPending } = trpc.users.sendRequest.useMutation({
        onSuccess: () => {
            utils.users.getFriendship.invalidate({ userId })
        }
    });

    const handleSendRequest = () => {
        sendFriendRequest({ toUserId: userId })
    }



    const filteredUsers = friends.filter(user => {

        //xd => se podria hacer mucho mejor pero bueno

        if (user.userA?.id === userId) {
            return user.userB?.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.userB?.username?.includes(searchQuery.toLowerCase());
        } else {
            return user.userA?.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.userA?.username?.includes(searchQuery.toLowerCase());
        }
    }
    );











    const [open, setOpen] = useState(false);






    console.log("OPEN", open);






    if (!userData) return <ProfileLoading />;

    const { user } = userData;

    // console.log("Session", session?.user.id)

    // console.log("DEGUSTACIONES", degustaciones)






    return (
        <>
            <ThumbnailUploadModal
                open={thumbnailModalOpen}
                onOpenChange={setThumbnailModalOpen}
                userId={userId}
            />
            <div className="min-h-screen bg-gradient-to-br  p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-green-100/50 p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-4 flex-1">
                                {session?.user.id === userId ? (
                                    <div className="relative  hover:cursor-pointer"
                                        onClick={() => setThumbnailModalOpen(true)}
                                    >
                                        <Avatar className="w-20 h-20 border-4 border-white shadow-lg"
                                        >
                                            <AvatarImage src={user.imageUrl ?? ""} alt={user.name || 'User'} className="hover:cursor-pointer"
                                            />
                                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white text-xl font-bold">
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-0 -right-1 rounded-full bg-green-500/90 p-1.5">
                                            <Pen className="size-4 " />
                                        </div>
                                    </div>
                                ) : (
                                    <Avatar className="w-20 h-20 border-4 border-white shadow-lg "
                                    >
                                        <AvatarImage src={user.imageUrl ?? ""} alt={user.name || 'User'} className="hover:cursor-pointer"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white text-xl font-bold">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-0">
                                            Active
                                        </Badge>
                                    </div>
                                    <p className="text-gray-600 text-lg mb-1">@{user.username}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full lg:w-auto">
                                {session?.user.id === userId ? (
                                    <Button
                                        onClick={() => authClient.signOut()}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <LogOut className="size-4" />
                                        Cerrar sesión
                                    </Button>
                                ) : amigos && amigos?.length > 0 ? !amigos[0].aceptada ? (

                                    <Button className="flex-1 lg:flex-none  text-white bg-green-600 opacity-65">
                                        <Send className="w-4 h-4 mr-2" />
                                        {amigos[0].userA !== userId ? <p>Solicitud Enviada</p> : <p>Esperando tu respuesta...</p>}
                                    </Button>
                                ) : (
                                    <Button className="flex-1 lg:flex-none  text-white bg-green-600 opacity-65">
                                        <UserCheck className="w-4 h-4 mr-2" />
                                        Amigos
                                    </Button>
                                ) :
                                    (
                                        <Button className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white"
                                            onClick={handleSendRequest}
                                            disabled={isPending}
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Añadir amigo
                                        </Button>
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Numero de degustaciones</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Beer className="w-5 h-5  text-yellow-400" />
                                            <span className="text-2xl font-bold text-gray-900">{degustaciones.length}</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <Beer className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Locales Introducidos (7 dias)</p>
                                        <div className="flex items-center gap-2">
                                            <Store className="w-6 h-6 text-blue-600" />
                                            <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Location</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span className="text-lg font-semibold text-gray-900">Madrid</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About Section */}
                            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-4 flex items-center gap-3">
                                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        About
                                    </CardTitle>
                                    {userId === session?.user.id && (
                                        < PencilIcon className="size-4 mb-1 hover:cursor-pointer" onClick={() => setOpen((e) => !e)} />
                                    )}


                                    {/*Edit about modal */}

                                    <ResponsiveModal
                                        title="Editar descripción"
                                        open={open}
                                        onOpenChange={() => setOpen(false)}
                                    >
                                        <DescriptionForm userId={user.id} setOpen={setOpen} />
                                    </ResponsiveModal>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-mono text-gray-600 leading-relaxed line-clamp-6 whitespace-pre-line ">
                                        {user.bio || "Este usuario no ha añadido ninguna descripción."}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Actividad Reciente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {degustaciones.map((degustacion) => (
                                            <div key={degustacion.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50">
                                                <div className="flex flex-col items-center text-center gap-1">
                                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <MapPin className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{degustacion.local}</p>
                                                </div>
                                                <div className="w-full flex flex-col gap-2">
                                                    <div className="w-full flex justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-md font-medium text-gray-900">{degustacion.cerveza.nombre}</p>
                                                            <Rating readOnly value={degustacion.calificacion} className="ml-3">
                                                                {Array.from({ length: 5 }).map((_, index) => (
                                                                    <RatingButton key={index} className=" text-yellow-300 w-5 h-5 mb-1" />
                                                                ))}
                                                            </Rating>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{compactDate(degustacion.createdAt)}</p>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-3">
                                                        {degustacion.comentario}
                                                        <MessageCircle className="size-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        {/* RIGHT COL - Friend Section */}
                        <div className="space-y-6">
                            {/* Friend List */}
                            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-green-600" />
                                            Amigos
                                            <Badge className="bg-green-100 text-green-800 border-0">
                                                {friends.length}
                                            </Badge>
                                        </CardTitle>
                                        <div className="relative flex-1 ml-5">
                                            <Input
                                                type="text"
                                                placeholder="Search profiles..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter'}
                                                className="w-full pl-10 pr-20 py-3 bg-white/80 dark:bg-[#212121] text-gray-900 dark:text-white rounded-xl backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-600 transition-colors"
                                                aria-label="Search profiles"
                                            />

                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600 " />
                                        </div>

                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                        <div className="space-y-2 p-4">
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((item, index) => {

                                                    if (item.userA?.id === userId) {
                                                        return (
                                                            <UserInfo
                                                                key={item.userB?.id}
                                                                id={item.userB?.id}
                                                                name={item.userB?.name}
                                                                imageUrl={item.userB?.imageUrl}
                                                                username={item.userB?.username}
                                                            />
                                                        )
                                                    } else {
                                                        return (
                                                            <UserInfo

                                                                key={item.userA?.id}
                                                                id={item.userA?.id}
                                                                name={item.userA?.name}
                                                                imageUrl={item.userA?.imageUrl}
                                                                username={item.userA?.username}
                                                            />
                                                        )
                                                    }
                                                }
                                                )
                                            ) : (
                                                <div className="text-center py-8">
                                                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-500 font-medium">No se han encontrado amigos</p>
                                                    <p className="text-sm text-gray-400 mt-1">Agrega más amigos</p>
                                                    <Button className="mt-4 bg-green-600 hover:bg-green-700">
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        Buscar Amigos
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {friends.length > 0 && (
                                        <div className="border-t border-gray-100 p-4 bg-gray-50/50 rounded-b-xl">
                                            <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Gestionar Amigos
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Friend Requests - Only visible to profile owner */}
                            {session?.user.id === userId && (
                                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                <UserPlus className="w-5 h-5 text-orange-500" />
                                                Solicitudes Pendientes
                                                <Badge className="bg-orange-100 text-orange-800 border-0">
                                                    {pendientes.length}
                                                </Badge>
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                            <div className="space-y-3 p-4">
                                                {pendientes.length > 0 ? (
                                                    pendientes.map((item) => (
                                                        <UserFriendRequest
                                                            key={item.userA!.id} //xd 
                                                            id={item.userA!.id} //xd 
                                                            imageUrl={item.userA?.imageUrl}
                                                            name={item.userA?.name}
                                                            username={item.userA?.username}
                                                            userId={userId}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="text-center py-6">
                                                        <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                                        <p className="text-gray-500 text-sm">No hay solicitudes pendientes</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* TODO: good  addition */}
                                        {/* {MockAmigos.length > 3 && (
                      <div className="border-t border-gray-100 p-3 bg-gray-50/50 rounded-b-xl">
                        <Button variant="ghost" className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 text-sm">
                          Ver todas las solicitudes ({MockAmigos.length})
                        </Button>
                      </div>
                    )} */}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                    </div>
                </div>
            </div >
        </>
    );
};

