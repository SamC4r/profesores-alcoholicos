// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import z from "zod";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { user } from "@/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        userId: z.string(), 
      }))
    .middleware(async ({ input }) => {

      const session = await auth.api.getSession({
        headers: await headers(),
      });


      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      // Send only what you need forward
      return {
        userId: input.userId,     // profile being edited
        authUserId: session.user.id, // logged-in user
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("ON UPLOAD COMPLETE", metadata, file.url);

      const { userId, authUserId } = metadata;

      // only allow self-edit; adapt if admin is allowed
      if (userId !== authUserId) {
        throw new UploadThingError("Unauthorized");
      }

      await db
        .update(user)
        .set({ imageUrl: file.url })
        .where(eq(user.id, userId));

      return { uploadedBy: authUserId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
