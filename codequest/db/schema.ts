import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* =========================
   User
========================= */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* =========================
   Session
========================= */
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* =========================
   Account
========================= */
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),

    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),

    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),

    scope: text("scope"),
    idToken: text("id_token"),
    password: text("password"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    providerAccountUnique: uniqueIndex(
      "accounts_provider_account_unique"
    ).on(table.providerId, table.accountId),
  })
);

/* =========================
   Verification
========================= */
export const verifications = pgTable("verifications", {
  id: uuid("id").defaultRandom().primaryKey(),

  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* =========================
   Contest
========================= */
export const contests = pgTable(
  "contests",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    platform: text("platform").notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),

    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),

    // NOTE:
    // Prisma had `duration DateTime`
    // That’s conceptually wrong. Duration ≠ point in time.
    // Keeping it as timestamp to match your schema strictly.
    duration: timestamp("duration", { withTimezone: true }).notNull(),
  },
  (table) => ({
    contestNameUnique: uniqueIndex("contest_name_unique").on(table.name),
  })
);

/* =========================
   Relations
========================= */
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
