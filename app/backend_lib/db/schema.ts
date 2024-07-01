import {
  index,
  int,
  sqliteTable,
  text,
  uniqueIndex,
  } from "drizzle-orm/sqlite-core"
import type { AdapterAccount } from "next-auth/adapters"
import { sql, relations } from "drizzle-orm"
  
  export const users = sqliteTable("user", {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: text("emailVerified").default(sql`now(3)`),
    image: text('image'),
    created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  user => ({
    emailIndex: uniqueIndex('users__email__idx').on(user.email),
  }))

export const usersRelations = relations(users, ({ many }) => ({
	schedules: many(schedules),
}));
  
  export const accounts = sqliteTable(
    "account",
    {
      userId: text("userId").notNull(),
      type: text("type")
        .$type<AdapterAccount["type"]>()
        .notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: int("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
      created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
      updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    },
    (account) => ({
      providerProviderAccountIdIndex: uniqueIndex(
        'accounts__provider__providerAccountId__idx'
      ).on(account.provider, account.providerAccountId),
      userIdIndex: index('accounts__userId__idx').on(account.userId),
    })
  )
  
  export const sessions = sqliteTable("session", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId").notNull(),
    expires: text("expires").notNull(),
  },
  session => ({
    sessionTokenIndex: uniqueIndex('sessions__sessionToken__idx').on(
      session.sessionToken
    ),
    userIdIndex: index('sessions__userId__idx').on(session.userId),
  }))
  
  export const verificationTokens = sqliteTable(
    "verificationToken",
    {
      identifier: text("identifier").notNull(),
      token: text("token").notNull(),
      expires: text("expires").notNull()
    },
    verificationToken => ({
      tokenIndex: uniqueIndex('verification_tokens__token__idx').on(
        verificationToken.token
      ),
    })
  )
  
  export const scheduledClasses = sqliteTable(
    "scheduledClass",
    {
      id: int("id").notNull().primaryKey(),
      scheduleID: text("scheduleID").notNull(),
      classNumber: int("classNumber").notNull()
    }
  )
  
  export const scheduledClassesRelations = relations(scheduledClasses, ({ one }) => ({
    schedule: one(schedules, {
      fields: [scheduledClasses.scheduleID],
      references: [schedules.id]
    })
  }));

  export const schedules = sqliteTable(
    "schedule",
    {
      id: text('id').primaryKey().notNull(),
      ownerID: text("ownerID").notNull(),
      name: text("name").notNull(),
      term: text("term").notNull()
    }
  )

  export const schedulesRelations = relations(schedules, ({ many, one }) => ({
    classes: many(scheduledClasses),
    owner: one(users, {
      fields: [schedules.ownerID],
      references: [users.id]
    })
  }));

  