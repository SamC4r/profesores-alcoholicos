import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { username } from "better-auth/plugins"

import { Resend } from 'resend';


import * as schema from "@/db/schema"
import { birthdayPlugin } from "@/db/birthday";
import EmailVerification from "@/modules/emails/email-verification";
import ForgotPasswordEmail from "@/modules/emails/email-forgot-password";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    baseURL:process.env.BETTER_AUTH_URL!,
    trustHost: true, // This is essential for Vercel

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url}, request) => {
            const { data, error } = await resend.emails.send({
                from: 'Booster <booster@boostervideos.net>', // Use the exact domain Resend provides
                to: user.email,
                subject: 'Restablecer contraseña - BeerSP',
                react: ForgotPasswordEmail({ username:user.name, resetUrl: url, userEmail:user.email }),
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
            console.log('Attempting to send verification email to:', user.email);

            try {
                // Use a domain that doesn't require verification for testing
                const { data, error } = await resend.emails.send({
                    from: 'BeerSP <booster@boostervideos.net>', // Use the exact domain Resend provides
                    to: user.email,
                    subject: 'Verifica tu correo - BeerSP',
                    react: EmailVerification({ username: user.name, verifyurl: url }),
                });

                if (error) {
                    console.error('Resend API Error:', error);
                    // Don't throw error - just log it for now during testing
                    console.log('Would have sent email to:', user.email, 'with URL:', url);
                }

                console.log('Email sent successfully, ID:', data?.id);
            } catch (error) {
                console.error('Email sending failed:', error);
                // Don't throw during testing so user can still sign up
                console.log('Would have sent email to:', user.email, 'with URL:', url);
            }
        },
        sendOnSignUp: true,
    },

    plugins: [
        username(),
        birthdayPlugin(),
    ]
});


