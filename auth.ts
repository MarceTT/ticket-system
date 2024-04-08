import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { databse } from "./lib/prismadb"


export const { 
    handlers: { GET, POST},
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
        verifyRequest: "/auth/verify-request",
        newUser: "/auth/new-user",
    },
    ...authConfig,
    session: {
        strategy: "jwt",
    },
    adapter: PrismaAdapter(databse),
})