"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Loader2Icon, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CervezaForm } from "../../cerveza/sections/crear-cerveza";
import { trpc } from "@/trpc/client";
import { degustacionInsertSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";

type DegustacionFormValues = z.infer<typeof degustacionInsertSchema>;

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DegustacionForm({ setOpen }: Props) {
    // steps
    const [step, setStep] = useState(0);
    const [showNewBeer, setShowNewBeer] = useState(false);

    const next = () => setStep((s) => Math.min(s + 1, 2));
    const back = () => setStep((s) => Math.max(s - 1, 0));

    // search for beer
    const [search, setSearch] = useState("");
    const [selectedBeer, setSelectedBeer] = useState("");

    //local

    const [selectedLocal, setSelectedLocal] = useState("");


    //TODO: optimize?
    const cervezasQuery = trpc.cerveza.getMany.useQuery({
        q: "%" + search + "%",
    });

    const createDegustacion = trpc.degustacion.create.useMutation({
        onSuccess: () => {
            toast.success("Degustación creada");
            form.reset();
            setStep(0);
            setSelectedBeer("")
            setSelectedLocal("")
            setOpen(false);
        },
        onError: () => {
            toast.error("No se pudo crear la degustación");
        },
    });

    // FORM
    const form = useForm<DegustacionFormValues>({
        resolver: zodResolver(degustacionInsertSchema),
        defaultValues: {
            cervezaId: "",
            local: "",
            calificacion: 3,
            comentario: "",
        },
    });

    const { control, setValue, watch } = form;

    const handleSelectBeer = (id: string) => {
        setSelectedBeer(id);
        setValue("cervezaId", id, { shouldDirty: true, shouldValidate: true });
    };

    const handleSelectLocal = (local: string) => {
        setSelectedLocal(local);
        setValue("local", local, { shouldDirty: true, shouldValidate: true });

    }

    const rating = watch("calificacion");
    const local = watch("local")
    const cerveza = watch("cervezaId")
    const comentario = watch("comentario")


    console.log("rating", rating)
    const onSubmit = (values: DegustacionFormValues) => {
        createDegustacion.mutate(values);
    };

    console.log("step", step);
    const handleNext = async (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        e?.stopPropagation();

        console.log("step dentro", step);
        if (step === 0) {
            const ok = await form.trigger("cervezaId");
            const cerveza = watch("cervezaId")
            if (!ok || !cerveza) {
                toast.warning("Seleccione una cerveza")
                return;
            }
        } else if (step === 1) {
            const ok = await form.trigger("local");

            const local = watch("local")
            if (!ok || !local) {
                toast.warning("Seleccione un local")
                return;
            }
        } else if (step === 2) {
            const ok = await form.trigger("calificacion");

            const rating = watch("calificacion");
            if (!ok || !rating) {
                toast.warning("Asigne una calificación")
                return;
            }
        }
        next();
    };

    //menus
    const labels = ["Cerveza", "Lugar", "Valoración"];
    const StepIndicator = () => {
        return (
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 ">
                <div className="flex gap-2">
                    {labels.map((label, i) => (
                        <div key={i} className="flex items-center gap-1">
                            <div
                                className={cn(
                                    "h-6 w-6 rounded-full border flex items-center justify-center text-[10px]",
                                    i === step && "bg-green-600 text-white border-green-600",
                                    i < step && "bg-green-200 text-green-700 border-green-600"
                                )}
                            >
                                {i + 1}
                            </div>
                            <span
                                className={cn(
                                    "hidden sm:inline",
                                    i === step && "font-medium text-foreground",
                                    i < step && "text-green-700"
                                )}
                            >
                                {label}
                            </span>
                            {i < labels.length - 1 && (
                                <div className="hidden sm:block w-4 h-px bg-border" />
                            )}
                        </div>
                    ))}
                </div>
                <span>
                    Paso {step + 1} de {labels.length}
                </span>
            </div>
        );
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-2 overflow-auto"
            >
                <StepIndicator />

                {/* STEP 1: Seleccionar cerveza */}
                {step === 0 && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Buscar cerveza</label>
                                <Input
                                    placeholder="Escribe el nombre..."
                                    className="mt-1"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* loading */}
                            {cervezasQuery.isLoading && search.length > 1 && (
                                <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
                                    <Loader2Icon className="h-4 w-4 animate-spin" />
                                    Buscando cervezas…
                                </div>
                            )}

                            {/* error */}
                            {cervezasQuery.isError && (
                                <div className="p-3 text-xs text-red-500">
                                    Error al cargar las cervezas.
                                </div>
                            )}

                            {cervezasQuery.data &&
                                cervezasQuery.data.length === 0 &&
                                search.length > 1 &&
                                !cervezasQuery.isLoading && (
                                    <div className="p-3 text-xs text-muted-foreground">
                                        No se encontraron cervezas con ese término.
                                    </div>
                                )}

                            {/* results */}
                            {cervezasQuery.data &&
                                cervezasQuery.data.map((cerveza) => (
                                    <button
                                        key={cerveza.id}
                                        type="button"
                                        onClick={() => handleSelectBeer(cerveza.id)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 hover:bg-muted/70 border-2 flex flex-col gap-0.5 rounded-xl hover:cursor-pointer",
                                            selectedBeer === cerveza.id &&
                                            "bg-green-50 hover:bg-green-50 border-green-600"
                                        )}
                                    >
                                        <span className="font-medium">{cerveza.nombre}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {cerveza.estilo}
                                        </span>
                                    </button>
                                ))}

                            <FormField
                                control={control}
                                name="cervezaId"
                                render={({ field, fieldState }) => (
                                    <FormItem className="hidden">
                                        <FormControl>
                                            <input type="hidden" {...field} />
                                        </FormControl>
                                        {fieldState.error && (
                                            <p className="mt-1 text-xs text-red-500">
                                                Debes seleccionar una cerveza.
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* añadir cerveza */}
                        <div className="pt-2 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    ¿No encuentras la cerveza?
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowNewBeer(true)}
                                >
                                    Añadir cerveza
                                </Button>
                            </div>

                            <ResponsiveModal
                                open={showNewBeer}
                                title="Añadir cerveza"
                                onOpenChange={setShowNewBeer}
                            >
                                <CervezaForm />
                            </ResponsiveModal>
                        </div>
                    </div>
                )}

                {/* STEP 2: Lugar */}
                {step === 1 && (
                    <div className="space-y-4">
                        {/*
                        <FormField
                            control={control}
                            name="local"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-sm font-medium">
                                        Nombre del local
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ej. Bar Central"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        */}

                        <div className="w-full h-48 rounded-md border bg-muted flex items-center justify-center">
                            <div className="text-muted-foreground flex flex-col items-center">
                                <MapPin className="mb-1" />
                                <span>Mapa interactivo</span>
                                <span className="text-xs"></span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">Locales cercanos</div>
                            <div className="space-y-2">
                                {["Cervecería DATSI", "Cervecería ETSIINF", "Cervecería Boadilla"].map(
                                    (local, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleSelectLocal(local)}
                                            className={cn("w-full flex flex-col items-start gap-0.5 p-3 border rounded-md hover:bg-muted", selectedLocal === local && 'bg-green-50 border-green-600')}
                                        >
                                            <div className="text-sm font-medium">{local}</div>
                                            <div className="text-xs text-muted-foreground">
                                                A {Math.floor(200 + (i + 1) * (68.3 + i * i * i * i * i * i * i))} metros
                                            </div>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Valoración */}
                {step === 2 && (
                    <div className="space-y-6">
                        <FormField
                            control={control}
                            name="calificacion"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Valoración
                                    </FormLabel>
                                    <FormControl className="flex justify-center">
                                        <div>
                                            <Rating
                                                defaultValue={3}
                                                onValueChange={(value) => setValue("calificacion", value, { shouldDirty: true, shouldValidate: true })}

                                            >
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <RatingButton key={index} className="text-yellow-500" type="button" />
                                                ))}
                                            </Rating>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="comentario"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Comentario
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="mt-1"
                                            placeholder="Añade tus impresiones sobre la cerveza..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                {/* Nav buttons */}
                <div className="flex justify-between pt-2 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={step === 0}
                        onClick={back}
                    >
                        Atrás
                    </Button>

                    {step < 2 ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Siguiente
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 hover:cursor-pointer"
                            disabled={createDegustacion.isPending || !rating || !cerveza || !comentario || !local}
                        >
                            {createDegustacion.isPending && (
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Guardar degustación
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}

