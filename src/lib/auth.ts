import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { username } from "better-auth/plugins"

import { Resend } from 'resend';


import * as schema from "@/db/schema"
import { birthdayPlugin } from "@/db/birthday";
import EmailVerification from "@/modules/emails/email-verification";
import ForgotPasswordEmail from "@/modules/emails/email-forgot-password";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL!,
    trustHost: true, // This is essential for Vercel

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }, request) => {
            const { data, error } = await resend.emails.send({
                from: 'Booster <booster@boostervideos.net>', // Use the exact domain Resend provides
                to: user.email,
                subject: 'Restablecer contraseña - BeerSP',
                react: ForgotPasswordEmail({ username: user.name, resetUrl: url, userEmail: user.email }),
            });
        },
        onPasswordReset: async ({ user }, request) => {

            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
        }
    }),

    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
      const m = await import("../modules/emails/email-verification"); // <-- adjust if your path differs
      console.log("typeof EmailVerification:", typeof m.default); // should be "function"

      if (typeof m.default !== "function") {
        // fallback so users aren’t blocked
        const { error } = await resend.emails.send({
          from: "BeerSP <booster@boostervideos.net>",
          to: user.email,
          subject: "Verifica tu correo - BeerSP",
          text: `Hola ${user?.name ?? ""}\n\nVerifica tu correo:\n${url}\n`,
        });
        if (error) throw error;
        return;
      }

      const element = React.createElement(m.default, {
        username: user?.name ?? "",
        verifyurl: url,
      });

      const { error } = await resend.emails.send({
        from: "BeerSP <booster@boostervideos.net>",
        to: user.email,
        subject: "Verifica tu correo - BeerSP",
        react: element,
        text: `Hola ${user?.name ?? ""}\n\nVerifica tu correo:\n${url}\n`,
      });
      if (error) throw error;
    },
        sendOnSignUp: true,
    },

    plugins: [
        username(),
        birthdayPlugin(),
    ]
});


