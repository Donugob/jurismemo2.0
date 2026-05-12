import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtectedRoute = ["/dashboard", "/admin"].some((route) =>
        nextUrl.pathname.startsWith(route)
      )

      if (isProtectedRoute) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
  providers: [], // Add empty providers array for compatibility
} satisfies NextAuthConfig
