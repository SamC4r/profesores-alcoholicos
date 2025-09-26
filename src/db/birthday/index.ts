import { createAuthClient } from "better-auth/client";
import { APIError, type BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/plugins";

//...
export const birthdayPlugin = () =>
  ({
    id: "birthdayPlugin",
    schema: {
      user: {
        fields: {
          birthday: {
            type: "date", // string, number, boolean, date
            required: false, // if the field should be required on a new record. (default: false)
            unique: false, // if the field should be unique. (default: false)
          },
        },
      },
    },
    hooks: {
      before: [
        {
          matcher: (context) => context.path.startsWith("/sign-up/email"),
          handler: createAuthMiddleware(async (ctx) => {
              const { birthday } = ctx.body;
              console.log(birthday, new Date(birthday))
           
              const today = new Date();
              const _18YearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));
            //   console.log(_18YearsAgo,birthday, _18YearsAgo >= new Date(birthday))
              if (new Date(birthday) >= _18YearsAgo) {
                  throw new APIError("BAD_REQUEST", { message: "Debes ser mayor de edad para ingresar." });
              }
              return { context: ctx };
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin);