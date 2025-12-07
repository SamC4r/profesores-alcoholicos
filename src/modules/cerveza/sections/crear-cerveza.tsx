"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cervezaInsertSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

type CervezaFormValues = z.infer<typeof cervezaInsertSchema>;

export const CervezaForm = () => {
    const utils = trpc.useUtils();
    const insert = trpc.cerveza.create.useMutation({
        onSuccess: () => {
            utils.cerveza.getMany.invalidate();
            toast.success("Cerveza creada");
            form.reset();
        },
        onError: () => {
            toast.error("No se pudo crear la cerveza");
        },
    });

    const form = useForm<CervezaFormValues>({
        resolver: zodResolver(cervezaInsertSchema),
        defaultValues: {
            nombre: "",
            estilo: "",
            pais: "",
            tamano: "",
            formato: "",
            porcentaje_alcohol: 5,
            calificador_amargor: "30",
            color: "",
        },
    });

    const { handleSubmit, setValue, watch } = form;

    const amargorValue = Number(watch("calificador_amargor") || 30);

    const onSubmit = (data: CervezaFormValues) => {
        insert.mutate(data);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4 space-y-4 rounded-lg border bg-muted/40 p-4 overflow-auto"
            >
                <div className="text-sm font-semibold">Nueva cerveza</div>

                {/* Nombre */}
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">
                                Nombre de la cerveza
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Nombre comercial" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Estilo */}
                <FormField
                    control={form.control}
                    name="estilo"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">
                                Estilo de cerveza
                            </FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un estilo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ipa">IPA</SelectItem>
                                        <SelectItem value="stout">Stout</SelectItem>
                                        <SelectItem value="lager">Lager</SelectItem>
                                        <SelectItem value="ale">Ale</SelectItem>
                                        <SelectItem value="otros">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* País de procedencia */}
                <FormField
                    control={form.control}
                    name="pais"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">
                                País de procedencia
                            </FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona país de origen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="España">España</SelectItem>
                                        <SelectItem value="Alemania">Alemania</SelectItem>
                                        <SelectItem value="Belgica">Bélgica</SelectItem>
                                        <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tamano"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">
                                Tamaño
                            </FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona país de origen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pinta">Pinta</SelectItem>
                                        <SelectItem value="Media Pinta">Media Pinta</SelectItem>
                                        <SelectItem value="Tercio">Tercio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Formato */}
                <FormField
                    control={form.control}
                    name="formato"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">Formato</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona formato" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="barril">Barril</SelectItem>
                                        <SelectItem value="botella">Botella</SelectItem>
                                        <SelectItem value="lata">Lata</SelectItem>
                                        <SelectItem value="otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Porcentaje alcohol */}
                <FormField
                    control={form.control}
                    name="porcentaje_alcohol"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">
                                Porcentaje de alcohol (% ABV)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="1"
                                    min={0}
                                    max={100}
                                    placeholder="Ej. 5"
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === "" ? undefined : Number(e.target.value)
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Calificador de amargor (slider -> string) */}
                <FormField
                    control={form.control}
                    name="calificador_amargor"
                    render={() => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium justify-between">
                                <span>
                                    Amargor
                                </span>
                                <span>
                                    {amargorValue} %
                                </span>
                            </FormLabel>
                            <FormControl>
                                <>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={5}
                                        value={[amargorValue]}
                                        onValueChange={(vals) =>
                                            setValue("calificador_amargor", String(vals[0]), {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            })
                                        }
                                    />
                                    <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                                        <span>Suave</span>
                                        <span>Medio</span>
                                        <span>Muy amargo</span>
                                    </div>
                                </>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Color */}
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">Color</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rubia">Rubia</SelectItem>
                                        <SelectItem value="ambar">Ámbar</SelectItem>
                                        <SelectItem value="tostada">Tostada</SelectItem>
                                        <SelectItem value="negra">Negra</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* País donde se ha consumido */}
                {/* Ahora mismo tu tabla no tiene esta columna; esto es solo UI.
            Si luego la añades al esquema, la conectamos también. */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">
                        País donde se ha consumido (opcional)
                    </label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona país de consumo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="es">España</SelectItem>
                            <SelectItem value="pt">Portugal</SelectItem>
                            <SelectItem value="fr">Francia</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        type="submit"
                        disabled={insert.isPending}
                    >
                        {insert.isPending && (
                            <span className="mr-2 inline-block h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        )}
                        Añadir cerveza
                    </Button>
                </div>
            </form>
        </Form>
    );
};

