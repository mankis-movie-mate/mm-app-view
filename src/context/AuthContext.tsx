'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserDetails } from '@/types/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserDetails | null;
  token: string | null;
  refreshToken: string | null;
  isInitialized: boolean;
  login: (token: string, refreshToken: string, user: UserDetails) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isInitialized, setInitialized] = useState(false);
  const router = useRouter();

  // On mount, try to load from localStorage
  useEffect(() => {
    const t = localStorage.getItem('accessToken');
    const rt = localStorage.getItem('refreshToken');
    const u = localStorage.getItem('user');
    if (t && u && rt) {
      setToken(t);
      setRefreshToken(rt);
      setUser(JSON.parse(u) as UserDetails);
    }

    setInitialized(true);
  }, []);

  const login = (token: string, refreshToken: string, user: UserDetails) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setUser(user);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, refreshToken, isInitialized, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useRequireUser() {
  const { user } = useAuth();
  return user;
}
