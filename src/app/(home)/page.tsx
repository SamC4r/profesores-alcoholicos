'use client'
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { HomeView } from "@/modules/home/ui/components/home-view";

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const {data: session} = authClient.useSession();

  const goToSignIn = () => {
    router.push('/sign-in')
  }

  const goToSignUp = () => {
    router.push('/sign-up')
  }

  if(session){
    return (
      <HomeView name={session.user.name} />
    )
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
}
