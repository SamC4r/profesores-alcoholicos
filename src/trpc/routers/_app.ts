import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { usersRouter } from "@/modules/users/server/procedures";

export const appRouter = createTRPCRouter({

  users:usersRouter,

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
