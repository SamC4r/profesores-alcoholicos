import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { usersRouter } from "@/modules/users/server/procedures";
import { cervezaRouter } from "@/modules/cerveza/server/procedures";
import { degustacionRouter } from "@/modules/degustacion/server/procedures";

export const appRouter = createTRPCRouter({

    users: usersRouter,
    cerveza: cervezaRouter,
    degustacion: degustacionRouter,

    // hello: baseProcedure
    //   .input(
    //     z.object({
    //       text: z.string(),
    //     })
    //   )
    //   .query(async (opts) => {
    //     return {
    //       greeting: `hello ${opts.input.text}`,
    //     };
    //   }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
