import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { User } from "./types"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // You can add custom logic here to save user to database
      // For now, we'll just allow all Google sign-ins
      return true
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and user info to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.id = profile?.sub
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = "user" // Default role, can be customized
      }
      return session
    }
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt"
  }
})
