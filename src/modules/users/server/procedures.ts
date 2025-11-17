import { db } from "@/db";
import { solicitudesAmistad, user } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import z from "zod";



const friendExists = async (userAId: string, userBId: string) => {
    const existing = await db
        .select()
        .from(solicitudesAmistad)
        .where(
            or(
                and(
                    eq(solicitudesAmistad.userA, userAId),
                    eq(solicitudesAmistad.userB, userBId),
                ),
                and(
                    eq(solicitudesAmistad.userA, userBId),
                    eq(solicitudesAmistad.userB, userAId),
                ),
            ),
        )

    return existing;
};

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

    getMany: baseProcedure
        .query(async () => {
            const users = await db
                .select()
                .from(user)

            return users;
        }),

    getFriends: baseProcedure
        .input(z.object({
            userId: z.string(),
        }))
        .query(async ({ input }) => {

            const { userId } = input;

            const userA = alias(user, "userA");
            const userB = alias(user, "userB");

            const friends = await db
                .select({
                    userA: { ...getTableColumns(userA) },
                    userB: { ...getTableColumns(userB) },
                })
                .from(solicitudesAmistad)
                .leftJoin(userA, eq(userA.id, solicitudesAmistad.userA))
                .leftJoin(userB, eq(userB.id, solicitudesAmistad.userB))
                .where(and(
                    eq(solicitudesAmistad.aceptada, true),
                    or(
                        eq(solicitudesAmistad.userA, userId),
                        eq(solicitudesAmistad.userB, userId)
                    )
                ))

            return friends;

        }),
    getPending: baseProcedure
        .input(z.object({
            userId: z.string(),
        }))
        .query(async ({ input }) => {

            const { userId } = input;

            const userA = alias(user, "userA");

            const friends = await db
                .select({
                    userA: { ...getTableColumns(userA) },
                })
                .from(solicitudesAmistad)
                .leftJoin(userA, eq(userA.id, solicitudesAmistad.userA))
                .where(and(
                    eq(solicitudesAmistad.aceptada, false),
                    eq(solicitudesAmistad.userB, userId),
                ))

            return friends;

        }),

    getFriendship: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { userId } = input;
            const { auth } = ctx;

            const sessionUser = auth.user.id;

            const friends = await db
                .select()
                .from(solicitudesAmistad)
                .where(
                    or(
                        and(eq(solicitudesAmistad.userA, userId), eq(solicitudesAmistad.userB, sessionUser)),
                        and(eq(solicitudesAmistad.userA, sessionUser), eq(solicitudesAmistad.userB, userId)),
                    )
                )

            return friends;

        }),

    sendRequest: protectedProcedure
        .input(z.object({
            toUserId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { toUserId } = input;
            const { auth } = ctx;


            const exists = await friendExists(auth.user.id, toUserId);
            if (exists.length > 0) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "La relación de amistad ya existe o está pendiente.",
                });
            }

            const req = await db
                .insert(solicitudesAmistad)
                .values({
                    userA: auth.user.id,
                    userB: toUserId,
                })

            return req;
        }),

    acceptRequest: protectedProcedure
        .input(z.object({
            fromUserId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const { fromUserId } = input;

            const { auth } = ctx;



            const exists = await friendExists(auth.user.id, fromUserId);

            if (exists.length > 0 && exists[0].aceptada) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "La relación de amistad ya existe o está pendiente.",
                });
            }

            const id = exists.at(0)?.id;

             if (!id) { // 
                throw new TRPCError({
                    code:"NOT_FOUND",
                    message:"No existe una amistad entre estos dos amigos",
                })
            }
            console.log(id)

            const upd = await db
                .update(solicitudesAmistad)
                .set({ aceptada: true, })
                .where(eq(solicitudesAmistad.id, id))

            return upd;
        }),

    rejectRequest: protectedProcedure
        .input(z.object({
            fromUserId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const { fromUserId } = input;

            const { auth } = ctx;



            const exists = await friendExists(auth.user.id, fromUserId);

            if (exists.length > 0 && exists[0].aceptada) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "La relación de amistad ya existe o está pendiente.",
                });
            }

            const id = exists.at(0)?.id;

            if (!id) { // 
                throw new TRPCError({
                    code:"NOT_FOUND",
                    message:"No existe una amistad entre estos dos amigos",
                })
            }
            console.log(id)

            const upd = await db
                .delete(solicitudesAmistad)
                .where(eq(solicitudesAmistad.id, id))

            return upd;
        }),
})