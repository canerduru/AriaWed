import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '../types';
import { authApi, ApiUser, isApiConfigured } from '../api/client';

const tokenKey = 'ariawed_token';
const userKey = 'ariawed_user';

function apiUserToUser(u: ApiUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role as User['role'],
    weddingId: u.weddingId,
    vendorId: u.vendorId,
    status: u.status as User['status'],
  };
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: User['role']) => Promise<void>;
  logout: () => void;
  setUser: (u: User | null) => void;
  useApi: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(userKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(tokenKey));
  const [isLoading, setIsLoading] = useState(false);
  const useApi = isApiConfigured();

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem(userKey, JSON.stringify(u));
    else localStorage.removeItem(userKey);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!useApi) throw new Error('API not configured');
    setIsLoading(true);
    try {
      const { user: u, token: t } = await authApi.login(email, password);
      setToken(t);
      setUserState(apiUserToUser(u));
      localStorage.setItem(tokenKey, t);
      localStorage.setItem(userKey, JSON.stringify(apiUserToUser(u)));
    } finally {
      setIsLoading(false);
    }
  }, [useApi]);

  const register = useCallback(async (email: string, password: string, name: string, role?: User['role']) => {
    if (!useApi) throw new Error('API not configured');
    setIsLoading(true);
    try {
      const { user: u, token: t } = await authApi.register({ email, password, name, role: role || 'bride' });
      setToken(t);
      setUserState(apiUserToUser(u));
      localStorage.setItem(tokenKey, t);
      localStorage.setItem(userKey, JSON.stringify(apiUserToUser(u)));
    } finally {
      setIsLoading(false);
    }
  }, [useApi]);

  const logout = useCallback(() => {
    setToken(null);
    setUserState(null);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    setUser,
    useApi,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
