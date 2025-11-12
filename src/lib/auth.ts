import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { username } from "better-auth/plugins"

import { Resend } from 'resend';


import * as schema from "@/db/schema"
import { birthdayPlugin } from "@/db/birthday";
import EmailVerification from "@/modules/emails/email-verification";
import ForgotPasswordEmail from "@/modules/emails/email-forgot-password";
import { FunctionComponentElement } from "react";
import { render } from "@react-email/components";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL!,
    trustHost: true, // This is essential for Vercel

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }, request) => {

            const { default: ForgotPasswordEmail } =
                await import("../modules/emails/email-forgot-password");

            const html = await render(
                React.createElement(ForgotPasswordEmail, {
                    username: user?.name ?? "",
                    resetUrl: url,
                    userEmail: user.email,
                })
            );


            const { data, error } = await resend.emails.send({
                from: 'BeerSP <booster@boostervideos.net>', // Use the exact domain Resend provides
                to: user.email,
                subject: 'Restablecer contraseña - BeerSP',
                html,
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
        autoVerify: false,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            const u = new URL(url);
            const token = u.searchParams.get("token")!;
            const email = user.email;

            const verifyPage = `${process.env.BETTER_AUTH_URL}/verify#token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

            const { default: EmailVerification } = await import("../modules/emails/email-verification");
            const html = await render(
                React.createElement(EmailVerification, {
                    username: user?.name ?? "",
                    verifyurl: verifyPage, 
                })
            );

            await resend.emails.send({
                from: 'BeerSP <booster@boostervideos.net>',
                to: email,
                subject: 'Verifica tu correo - BeerSP',
                html,
            });
        },
    },

    plugins: [
        username(),
        birthdayPlugin(),
    ]
});



