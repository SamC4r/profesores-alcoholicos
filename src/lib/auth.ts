import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { username } from "better-auth/plugins"


import * as schema from "@/db/schema"
import { birthdayPlugin } from "@/db/birthday";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    }, 
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema: {
            ...schema,
        }
    }),
    plugins: [
        username(),
        birthdayPlugin(),
    ]
});