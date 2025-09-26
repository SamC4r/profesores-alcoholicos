'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import { useState } from "react"
import { authClient } from "@/lib/auth-client";

export default function Home() {

  const {
    data:session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

 

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      name,
      password,
    },{
      onError: (e) => {
        window.alert(e.error.message)
      },
      onSuccess: () => {
        window.alert('exito')
      }
    })
  }

   const onLogin = () => {
    authClient.signIn.email({
      email,
      password,
    },{
      onError: (e) => {
        window.alert(e.error.message)
      },
      onSuccess: () => {
        window.alert('exito')
      }
    })
  }

  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (

    <div className="flex flex-col gap-y-10">

      <div className="p4 flex flex-col gap-y-4">
        <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onSubmit}>
          Create user
        </Button>
      </div>

       <div className="p4 flex flex-col gap-y-4">
        {/* <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} /> */}
        <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onLogin}>
          Login
        </Button>
      </div>

    </div>
  );
}
