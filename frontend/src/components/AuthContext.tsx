"use client";

import React, { createContext, useContext } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthInternalProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  
  const user = session?.user ?? null;
  const loading = status === "loading";

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  const refreshProfile = async () => {
    // NextAuth handles session refreshing automatically or via useSession update
    return;
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children, session }: { children: React.ReactNode, session: any }) {
  return (
    <SessionProvider session={session}>
      <AuthInternalProvider>
        {children}
      </AuthInternalProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
