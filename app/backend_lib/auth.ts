import { Theme } from '@auth/core/types';
import NextAuth from 'next-auth';
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/backend_lib/db/drizzle"
import Google from "@auth/core/providers/google"
import { env } from 'process';

export const runtime = 'edge';

export const { handlers: {GET, POST}, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET })
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      //console.log("\nsession", session, "\nuser", user)
      if (session && session.user) {
        session.user.id = user.id;
      }

      return session
    }
  },
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "database",
  
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },  
});
