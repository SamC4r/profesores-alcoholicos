'use client'

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin,  UserPlus, Calendar, Mail, Phone, Edit, Check, MessageCircle, OctagonAlertIcon, Search, UserCheck, Users, X, Beer, Store } from "lucide-react";
import { trpc } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, useSession } from "@/lib/auth-client";
import { ThumbnailUploadModal } from "../components/image-upload-modal";

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

  const { data: session } = useSession();
  
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);

  if (!userData) return <ProfileLoading />;

  const { user } = userData;

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
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg hover:cursor-pointer"
                  onClick={() => setThumbnailModalOpen(true)}
                >
                  <AvatarImage src={user.imageUrl?? ""} alt={user.name || 'User'}  className="hover:cursor-pointer"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white text-xl font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-0">
                      Active
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-lg mb-1">@{user.username}</p>
                  {user?.bio && (
                    <p className="text-gray-500 mt-2">{user.bio}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                {session?.user.id !== userId ? (
                  <Button variant="outline" className="flex-1 lg:flex-none border-green-200 text-green-700 hover:bg-green-50">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <Button className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white">
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
                      <span className="text-2xl font-bold text-gray-900">8</span>
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
                      <p className="text-2xl font-bold text-gray-900 mt-2">2</p>
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
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {user.bio || "No bio available. This user hasn't added any information about themselves yet."}
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
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Checked in at a new location</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
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
                      <Users className="w-5 h-5 text-emerald-600" />
                      Amigos
                      <Badge className="bg-emerald-100 text-emerald-800 border-0">
                        {MockAmigos.length}
                      </Badge>
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                      <Search className="w-4 h-4 mr-1" />
                      Buscar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    <div className="space-y-2 p-4">
                      {MockAmigos.length > 0 ? (
                        MockAmigos.map((item, index) => (
                          <div
                            key={item.name}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-200 group cursor-pointer"
                          >
                            <div className="relative">
                              <Avatar className="w-12 h-12 border-2 border-white shadow-md group-hover:border-emerald-200 transition-colors">
                                <AvatarImage src={user.imageUrl ?? ""} alt={item.name} />
                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold">
                                  {item.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate text-sm">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-gray-600 truncate">@{item.username}</p>
                              </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-100"
                            >
                              <MessageCircle className="w-4 h-4 text-emerald-600" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">No tienes amigos aún</p>
                          <p className="text-sm text-gray-400 mt-1">Agrega amigos para comenzar</p>
                          <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Buscar Amigos
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {MockAmigos.length > 0 && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50/50 rounded-b-xl">
                      <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
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
                          {MockAmigos.length}
                        </Badge>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      <div className="space-y-3 p-4">
                        {MockAmigos.length > 0 ? (
                          MockAmigos.slice(0, 3).map((item) => (
                            <div
                              key={`request-${item.name}`}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-orange-200 transition-all duration-200"
                            >
                              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                <AvatarImage src={user.imageUrl || ""} alt={item.name} />
                                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white text-sm">
                                  {item.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate text-sm">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-gray-600 truncate">@{item.username}</p>
                                <p className="text-xs text-gray-500 mt-1">Hace 2 días</p>
                              </div>

                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6">
                            <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No hay solicitudes pendientes</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {MockAmigos.length > 3 && (
                      <div className="border-t border-gray-100 p-3 bg-gray-50/50 rounded-b-xl">
                        <Button variant="ghost" className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-sm">
                          Ver todas las solicitudes ({MockAmigos.length})
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

const MockAmigos = [
  {
    "name": "Samuel",
    "username": "sammas24",
  },
  {
    "name": "Andres",
    "username": "popoliku",
  },
  {
    "name": "Ivan",
    "username": "ICARA",
  },
  {
    "name": "messi",
    "username": "d10s",
  }
]

