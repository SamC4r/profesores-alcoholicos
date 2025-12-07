import { db } from "@/db";
import { cervezas } from "@/db/schema";
import { DEFAULT_LIMIT } from "@/lib/utils";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { ilike } from "drizzle-orm";
import z from "zod";

export const cervezaRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(z.object({
            q: z.string()
        }))
        .query(async ({ input }) => {
            const { q } = input;


            const results = await db
                .select()
                .from(cervezas)
                .where(ilike(cervezas.nombre, q))
                .limit(DEFAULT_LIMIT)

            return results;




        }),

    create: baseProcedure
        .input(
            z.object({
                nombre: z.string().min(1),
                estilo: z.string().min(1),
                pais: z.string().min(1),
                tamano: z.string().min(1),
                formato: z.string().min(1),
                porcentaje_alcohol: z
                    .number()
                    .int()
                    .min(0)
                    .max(100),
                calificador_amargor: z.string().min(1),
                color: z.string().min(1),
            }))
        .mutation(async ({ input }) => {
            const { nombre, estilo, pais, tamano, formato, porcentaje_alcohol, calificador_amargor, color } = input;
            const result = await db.insert(cervezas).values({
                nombre,
                estilo,
                pais,
                tamano,
                formato,
                porcentaje_alcohol,
                calificador_amargor,
                color,
            }).returning()
            return result;
        }),
})
