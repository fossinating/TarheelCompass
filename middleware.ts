import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    //console.log("auth", req.nextauth)
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
)
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/((?!onboarding|api|_next/static|_next/image|favicon.ico).*)',
    ],
};