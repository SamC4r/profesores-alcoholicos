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
import { useRouter } from "next/navigation"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"

const formSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(1, { message: "Contraseña requerida" }),
    confirmPassword: z.string().min(1, { message: "Contraseña requerida" }),
    
}).refine((data) => data.password === data.confirmPassword, { 
    // in case of error
    message: "Contraseñas no son iguales",
    path: ["confirmPassword"], //what field shows the error
})


export const SignUpView = () => {


    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending,setPending] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    });


    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null)
        setPending(true)

        authClient.signUp.email(
            {
                name: data.name,
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: () => {
                    setPending(false)
                    router.push("/")
                },
                onError: ({ error }) => {
                    setPending(false)
                    setError(error.message)
                }
            }
        )
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
                                        Bienvenido
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Crea una cuenta
                                    </p>
                                </div>
                                 <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Nombre
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Goblin"
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
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Correo
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="nombre.apellido@upm.es"
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
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Contrasena
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
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Confirmar Contraseña
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
                                    Crear cuenta
                                </Button>


                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className='bg-card text-muted-foreground relative z-10 px-2'>
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant='outline'
                                        type='button'
                                        className="w-full"
                                    >
                                        Google

                                    </Button>
                                    <Button
                                        variant='outline'
                                        type='button'
                                        className="w-full"
                                    >
                                        Github

                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    No tienes usuario? {" "}
                                    <Link href="/sign-up" className="underline underline-offset-4">
                                        Crear una cuenta
                                    </Link>
                                </div>
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
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                Al iniciar sesión seras un profesor alcohólico
            </div>
        </div>
    )
}