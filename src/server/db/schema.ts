import {
  index,
  int,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex
  } from "drizzle-orm/sqlite-core"
import type { AdapterAccount, AdapterAccountType } from "next-auth/adapters"
import { sql, relations } from "drizzle-orm"
  
  export const userTable = sqliteTable("user", {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: int("emailVerified", { mode: "timestamp_ms" }),
    image: text("image"),
    created_at: int('created_at', { mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: int('updated_at', { mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  user => ({
    emailIndex: uniqueIndex('users__email__idx').on(user.email),
  }))

export const userRelations = relations(userTable, ({ many }) => ({
	schedules: many(scheduleTable),
}));
  
  export const accountTable = sqliteTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccountType>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: int("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
      created_at: int('created_at', { mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
      updated_at: int('updated_at', { mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
    },
    (account) => ({
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    })
  )
  
  export const sessionTable = sqliteTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    expires: int("expires", { mode: "timestamp_ms" }).notNull(),
  })
  
  export const verificationTokenTable = sqliteTable(
    "verificationToken",
    {
      identifier: text("identifier").notNull(),
      token: text("token").notNull(),
      expires: int("expires", { mode: "timestamp_ms" }).notNull(),
    },
    (verificationToken) => ({
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    })
  )
  
  export const scheduledClassTable = sqliteTable(
    "scheduledClass",
    {
      id: int("id").notNull().primaryKey(),
      scheduleID: text("scheduleID").notNull(),
      classNumber: int("classNumber").notNull()
    }
  )
  
  export const scheduledClassRelations = relations(scheduledClassTable, ({ one }) => ({
    schedule: one(scheduleTable, {
      fields: [scheduledClassTable.scheduleID],
      references: [scheduleTable.id]
    })
  }));

  export const scheduleTable = sqliteTable(
    "schedule",
    {
      id: text('id').primaryKey().notNull(),
      ownerID: text("ownerID").notNull(),
      name: text("name").notNull(),
      term: text("term").notNull()
    }
  )

  export const scheduleRelations = relations(scheduleTable, ({ many, one }) => ({
    classes: many(scheduledClassTable),
    owner: one(userTable, {
      fields: [scheduleTable.ownerID],
      references: [userTable.id]
    })
  }));

  