'use client';

import { trpc } from "@/trpc/client";
import { UploadDropzone } from "@/lib/uploadthing";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { UsuarioNamesSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect } from "react";

export type UsuarioFormValues = z.infer<typeof UsuarioNamesSchema>;

interface ThumbnailUploadModalProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
    userId,
    open,
    onOpenChange,
}: ThumbnailUploadModalProps) => {
    const utils = trpc.useUtils();

    const { data: user, isLoading } = trpc.users.getOne.useQuery({ userId });

    const update = trpc.users.updateNames.useMutation({
        onSuccess: () => {
            utils.users.getOne.invalidate({ userId });
            onOpenChange(false);
        },
    });

    const onUploadComplete = () => {
        utils.users.getOne.invalidate({ userId });
        onOpenChange(false);
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UsuarioFormValues>({
        resolver: zodResolver(UsuarioNamesSchema),
        defaultValues: {
            username: "",
            name: "",
        },
    });

    // When user data arrives, fill the form
    useEffect(() => {
        if (!user) return;
        reset({
            username: user.user.username ?? "",
            name: user.user.name ?? "",
        });
    }, [user, reset]);

    const onSubmit = (data: UsuarioFormValues) => {
        update.mutate({
            username: data.username || "",
            name: data.name || "",
        });
    };

    if (isLoading) {
        return (
            <ResponsiveModal
                title="Ajustes de perfil"
                open={open}
                onOpenChange={onOpenChange}
            >
                <div className="p-4">Cargando…</div>
            </ResponsiveModal>
        );
    }

    return (
        <ResponsiveModal
            title="Ajustes de perfil"
            open={open}
            onOpenChange={onOpenChange}
        >
            <div className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nombre */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Nombre</label>
                        <Input
                            placeholder="Tu nombre"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name.message as string}
                            </p>
                        )}
                    </div>

                    {/* Nombre de usuario */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Nombre de usuario</label>
                        <Input
                            placeholder="@usuario"
                            {...register("username")}
                        />
                        {errors.username && (
                            <p className="text-sm text-destructive">
                                {errors.username.message as string}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={update.isPending}>
                            {update.isPending ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </div>
                </form>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Foto de perfil</label>
                    <UploadDropzone
                        endpoint="imageUploader"
                        input={{ userId }}
                        onClientUploadComplete={onUploadComplete}
                        onUploadError={(error: Error) => {
                            alert(`ERROR! ${error.message}`);
                        }}
                    />
                </div>
            </div>
        </ResponsiveModal>
    );
};

