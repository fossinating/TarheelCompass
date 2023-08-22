import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      //console.log("\nsession", session, "\nuser", user)
      
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
