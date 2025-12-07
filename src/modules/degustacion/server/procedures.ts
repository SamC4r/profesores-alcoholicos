import { db } from "@/db";
import { degustaciones } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

export const degustacionRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            cervezaId: z.string().uuid(),
            local: z.string().min(1),
            calificacion: z.number().min(1).max(5),
            comentario: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { cervezaId, local, calificacion, comentario } = input;

            const user = ctx.auth.user;

            const result = await db
                .insert(degustaciones).values({
                    cervezaId,
                    local,
                    calificacion,
                    comentario,
                    autor: user.id
                })
                .returning()

            return result;
        })
})
