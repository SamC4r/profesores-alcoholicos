import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UsuarioDescriptionUpdateSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner";
import z from "zod"

type UsuarioDescriptionType = z.infer<typeof UsuarioDescriptionUpdateSchema>;

interface Props {
    userId: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DescriptionForm = ({ userId, setOpen }: Props) => {

    const { data: user } = trpc.users.getOne.useQuery({ userId })

    const { handleSubmit, register, formState: { errors } } = useForm<UsuarioDescriptionType>({
        resolver: zodResolver(UsuarioDescriptionUpdateSchema),
        defaultValues: { bio: user?.user.bio || "" }
    });

    const utils = trpc.useUtils();
    const updateBio = trpc.users.updateBio.useMutation({
        onSuccess: () => {
            toast.success("Se han guardado los cambios");
            setOpen(false);
            utils.users.getOne.invalidate({ userId });
        }
    });

    const onSubmit = (data: { bio: string }) => {
        updateBio.mutate({ bio: data.bio });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
                <label className="text-sm font-medium">Nombre</label>
                <Textarea
                    placeholder="Tu nombre"
                    {...register("bio")}
                />
                {errors.bio && (
                    <p className="text-sm text-destructive">
                        {errors.bio.message as string}
                    </p>
                )}
                <div className="relative right-0 mt-2">
                    <Button
                        type="submit"
                        disabled={updateBio.isPending}
                    >
                        {updateBio.isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </div>

        </form>
    )
}
