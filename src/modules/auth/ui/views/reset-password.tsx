'use client'
import { Card, CardContent } from "@/components/ui/card"

import { Beer, GraduationCap, OctagonAlertIcon } from "lucide-react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

const formSchema = z.object({
    password: z.string().min(1, { message: "Contraseña requerida" }),
    passwordVerify: z.string().min(1, { message: "Contraseña requerida" }),
})



export const ResetPasswordView = () => {


    const params = useSearchParams();
    const token = params.get('token') as string;

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            passwordVerify: "",
        }
    });


    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null)
        setPending(true)

        if(data.password !== data.passwordVerify){
            setPending(false);
            setError("Contraseñas no coinciden")
            return;
        }


        const { error } = await authClient.resetPassword({
            newPassword: data.password,
            token: token,
            
        });

        if(error){
            setError("Error, no intentes nada malo O_O")
        }else{
            toast.success("Contraseña cambiada!")
            router.push('/sign-in')
        }

        setPending(false)

       
    }

    







    return (


        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Restablecer contraseña
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Ingresa tu nueva contraseña
                                    </p>
                                </div>
                               
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Contraseña
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="***********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                 <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="passwordVerify"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Repite Contraseña
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="***********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}



                                <Button type="submit" className="w-full " disabled={pending}>
                                    Cambiar Contraseña
                                </Button>


                            </div>
                        </form>
                    </Form>

                    <div className="bg-radial from-green-500 to-green-800 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <p className="text-2xl font-semibold text-white">Alcoholismo en el aula</p>
                        <div className="flex items-center text-white">

                            <Beer className="size-10" />
                            <GraduationCap className="size-10" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            
        </div>
    )
}