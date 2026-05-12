import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "./lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const identifier = credentials.email as string

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { username: identifier }
            ]
          }
        })

        if (!user || !user.password) {
          return null
        }

        // Support for legacy $2y$ hashes (PHP-style) by treating them as $2a$ for bcryptjs
        let storedPassword = user.password
        if (storedPassword.startsWith('$2y$')) {
          storedPassword = '$2a$' + storedPassword.substring(4)
        }

        const isValidPassword = await bcrypt.compare(credentials.password as string, storedPassword)

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
          level: user.level,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.name
        token.level = (user as any).level
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        (session.user as any).username = token.username as string
        (session.user as any).level = token.level as string
      }
      return session
    }
  },
  secret: process.env.AUTH_SECRET || "fallback_secret_key_123",
})
