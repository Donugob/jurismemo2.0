import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { loginSchema } from "@/lib/zod";

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
        // Validate credentials using Zod
        const parsedCredentials = loginSchema.safeParse(credentials);
        
        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Fetch user from database
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: email },
              { username: email } // Allow login with username or email
            ]
          }
        });

        if (!user || !user.password) {
          return null;
        }

        // Verify password using modern bcryptjs
        // If legacy $2y$ is truly needed for existing DBs, keep it, but it's best to standardise on $2a$.
        let storedPassword = user.password;
        if (storedPassword.startsWith('$2y$')) {
          storedPassword = '$2a$' + storedPassword.substring(4);
        }

        const isValidPassword = await bcrypt.compare(password, storedPassword);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          level: user.level || "100L",
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.level = user.level;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.level = token.level as string;
      }
      return session;
    }
  },
});
