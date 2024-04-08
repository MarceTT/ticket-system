import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./schemas/login";
import { getUserByEmail } from "./lib/utils";
import { compare, compareSync } from "bcrypt";
import { databse } from "./lib/prismadb";

export default {
  callbacks: {
    async jwt({ token, user }) {
      //console.log({ token, user })
      if (user) {
        const existingAccount = await databse.account.findFirst({
          where: {
            userId: user.id,
          },
        });
        token.data = user;
        token.isOAuth = !!existingAccount;
      }
      return token;
    },
    session({ session, token, user }) {
      //console.log({ session, token, user })
      session.user = token.data as any;
      session.user.isOAuth = token.isOAuth as boolean;
      session.user.stateAccount = token.stateAccount as boolean;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      // Checking if the user is logged in
      const isLoggedIn = !!auth?.user;
      
      // Determining if the user is currently on the dashboard
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      // Handling authorization logic based on user status and location
      if (isOnDashboard) {
        // Redirecting unauthenticated users to the login page when attempting to access dashboard-related pages
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        // Redirecting authenticated users to the dashboard if they attempt to access authentication-related pages like login/signup
        const isOnAuth = nextUrl.pathname === '/login' || nextUrl.pathname === '/signup';
        if (isOnAuth) return Response.redirect(new URL('/dashboard', nextUrl));
        return true;
      }
      
      return true;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validateCredentials = LoginSchema.safeParse(credentials);
        if (!validateCredentials.success) {
          return null;
        }

        const { email, password } = validateCredentials.data;

        const user = await getUserByEmail(email);

        if (!user) {
          return null;
        }

        // if(!user.stateAccount){
        //   return null;
        // }

        const passwordMatch = compareSync(
          password || "",
          user.password as string
        );

        if (!passwordMatch) {
          return null;
        }
        const { password: _, ...rest } = user;
        return rest;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
} satisfies NextAuthConfig;
