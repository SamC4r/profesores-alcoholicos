import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"
import { birthdayClientPlugin } from "@/db/birthday/client"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL!,
    plugins: [ 
        usernameClient(),
        birthdayClientPlugin()
    ] 
})

export const { useSession, signIn, signOut, signUp } = authClient
