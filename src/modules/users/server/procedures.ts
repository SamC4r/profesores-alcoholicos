import { db } from "@/db";
import { user } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import z from "zod";

export const usersRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({
            userId: z.string(),
        }))
        .query(async ({ input }) => {

            const { userId } = input
            const [u] = await db
                .select()
                .from(user)
                .where(eq(user.id, userId))

            return {
                user: u
            };
        }),
  
})