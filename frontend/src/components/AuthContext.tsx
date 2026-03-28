"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  level: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  preferredCourses?: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshProfile = async () => {
    try {
      const fullUser = await authApi.getProfile();
      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  useEffect(() => {
    // Load auth state from localStorage on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // Refresh background profile to get latest data
      const fetchFullProfile = async () => {
        try {
          const fullUser = await authApi.getProfile();
          setUser(fullUser);
          localStorage.setItem('user', JSON.stringify(fullUser));
        } catch (e) {
          console.error("Session expired or invalid");
          logout();
        }
      };
      fetchFullProfile();
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    const data = await authApi.login(credentials);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    
    // Fetch full profile immediately after login to get all fields
    try {
      const fullUser = await authApi.getProfile();
      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
    } catch (e) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    router.push('/dashboard');
  };

  const register = async (userData: any) => {
    await authApi.register(userData);
    router.push('/login');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, refreshProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
