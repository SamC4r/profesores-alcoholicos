import { BetterAuthClientPlugin } from "better-auth";
import type { birthdayPlugin } from "./index"; // make sure to import the server plugin as a type

type BirthdayPlugin = typeof birthdayPlugin;

export const birthdayClientPlugin = () => {
  return {
    id: "birthdayPlugin",
    $InferServerPlugin: {} as ReturnType<BirthdayPlugin>,
  } satisfies BetterAuthClientPlugin;
};