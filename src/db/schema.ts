import { boolean, date, integer, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import {
    createInsertSchema,
    createUpdateSchema,
} from "drizzle-zod"
import z from "zod";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    username: text("username").unique(),
    displayUsername: text("display_username"),
    birthday: date("birthday"),
    bio: text("bio"),
    imageUrl: text("imageUrl"),
});


export const UsuarioNamesSchema = z.object({
    username: z.string(),
    name: z.string(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});


export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});


export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});



export const solicitudesAmistad = pgTable("solicitudes_amistad", {
    id: uuid("id").primaryKey().defaultRandom(),
    userA: text("userA").references(() => user.id, { onDelete: "cascade" }).notNull(), //userA sends the friend request
    userB: text("userB").references(() => user.id, { onDelete: "cascade" }).notNull(), //userB receives the friend request
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    aceptada: boolean().default(false),
}, (t) => ({
    uniquePair: uniqueIndex("solicitudes_unique_pair").on(t.userA, t.userB),
}));


export const cervezas = pgTable("cervezas", {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: text("nombre").notNull(),
    estilo: text("estilo").notNull(),
    pais: text("pais").notNull(),
    tamano: text("tamaño").notNull(),
    formato: text("formato").notNull(),
    porcentaje_alcohol: integer("porcentaje_alcohol").notNull(),
    calificador_amargor: text("calificador_amargor").notNull(),
    color: text("color").notNull(),
})

export const cervezaInsertSchema = createInsertSchema(cervezas)



export const degustaciones = pgTable("degustacion", {
    id: uuid("id").primaryKey().defaultRandom(),
    cervezaId: uuid("cerveza_id").references(() => cervezas.id, { onDelete: "cascade" }).notNull(),
    autor: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    local: text("local").notNull(),
    calificacion: integer("calificacion").notNull(),
    comentario: text("comentario").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
})

export const degustacionInsertSchema = createInsertSchema(degustaciones)

