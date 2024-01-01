import {
  datetime,
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  } from "drizzle-orm/mysql-core"
  import type { AdapterAccount } from "@auth/core/adapters"
import { sql, relations } from "drizzle-orm"
  
  export const users = mysqlTable("user", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", {
      mode: "date",
      fsp: 3
    }).default(sql`now(3)`),
    image: varchar('image', { length: 191 }),
    created_at: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
  },
  user => ({
    emailIndex: uniqueIndex('users__email__idx').on(user.email),
  }))

export const usersRelations = relations(users, ({ many }) => ({
	schedules: many(schedules),
}));
  
  export const accounts = mysqlTable(
    "account",
    {
      userId: varchar("userId", { length: 255 }).notNull(),
      type: varchar("type", { length: 255 })
        .$type<AdapterAccount["type"]>()
        .notNull(),
      provider: varchar("provider", { length: 255 }).notNull(),
      providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
      refresh_token: varchar("refresh_token", { length: 255 }),
      access_token: varchar("access_token", { length: 255 }),
      expires_at: int("expires_at"),
      token_type: varchar("token_type", { length: 255 }),
      scope: varchar("scope", { length: 255 }),
      id_token: text("id_token"),
      session_state: varchar("session_state", { length: 255 }),
      created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
      updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(),
    },
    (account) => ({
      providerProviderAccountIdIndex: uniqueIndex(
        'accounts__provider__providerAccountId__idx'
      ).on(account.provider, account.providerAccountId),
      userIdIndex: index('accounts__userId__idx').on(account.userId),
    })
  )
  
  export const sessions = mysqlTable("session", {
    sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  session => ({
    sessionTokenIndex: uniqueIndex('sessions__sessionToken__idx').on(
      session.sessionToken
    ),
    userIdIndex: index('sessions__userId__idx').on(session.userId),
  }))
  
  export const verificationTokens = mysqlTable(
    "verificationToken",
    {
      identifier: varchar("identifier", { length: 255 }).notNull(),
      token: varchar("token", { length: 255 }).notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull()
    },
    verificationToken => ({
      tokenIndex: uniqueIndex('verification_tokens__token__idx').on(
        verificationToken.token
      ),
    })
  )
  
  export const scheduledClasses = mysqlTable(
    "scheduledClass",
    {
      id: int("id").notNull().primaryKey().autoincrement(),
      scheduleID: varchar("scheduleID", { length: 255 }).notNull(),
      classNumber: int("classNumber").notNull()
    }
  )
  
  export const scheduledClassesRelations = relations(scheduledClasses, ({ one }) => ({
    schedule: one(schedules, {
      fields: [scheduledClasses.scheduleID],
      references: [schedules.id]
    })
  }));

  export const schedules = mysqlTable(
    "schedule",
    {
      id: varchar('id', { length: 255 }).primaryKey().notNull(),
      ownerID: varchar("ownerID", { length: 255 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      term: varchar("term", { length: 16 }).notNull()
    }
  )

  export const schedulesRelations = relations(schedules, ({ many, one }) => ({
    classes: many(scheduledClasses),
    owner: one(users, {
      fields: [schedules.ownerID],
      references: [users.id]
    })
  }));

  