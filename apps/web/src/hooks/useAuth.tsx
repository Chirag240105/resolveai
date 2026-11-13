'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, businessName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for sandbox/demo mode when backend is unavailable
const DEMO_USER: User = {
  id: 'usr-demo',
  name: 'Elena Rostova',
  email: 'merchant@resolveai.test',
  role: 'MERCHANT',
  merchantId: 'merch-1',
  businessName: 'Apex Electronics Lab',
};

const STORAGE_TOKEN_KEY = 'resolveai_token';
const STORAGE_USER_KEY = 'resolveai_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);

      if (savedToken && savedUser) {
        const parsed = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsed);
      }
      // If no saved session, user remains null — they need to log in or register
    } catch {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const persistSession = useCallback((jwtToken: string, authUser: User) => {
    setToken(jwtToken);
    setUser(authUser);
    localStorage.setItem(STORAGE_TOKEN_KEY, jwtToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(authUser));
  }, []);

  const login = async (email: string, pass: string) => {
    let backendReached = false;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      backendReached = true;

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.error?.message || body?.message || 'Invalid email or password';
        throw new Error(message);
      }

      const json = await res.json();
      const { token: jwtToken, user: authUser } = json.data;
      persistSession(jwtToken, authUser);
      router.push('/dashboard');
      return;
    } catch (err: any) {
      // If backend was reached and returned an error, throw it
      if (backendReached) {
        throw err;
      }

      // Backend unreachable — allow demo login with demo credentials only
      if (
        email === 'merchant@resolveai.test' &&
        (pass === 'DemoPassword123!' || pass === 'AdminPassword123!')
      ) {
        persistSession('demo-sandbox-token', { ...DEMO_USER, email });
        router.push('/dashboard');
        return;
      }

      throw new Error(
        'Unable to connect to authentication server. Please try again, or use demo credentials to explore the sandbox.'
      );
    }
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    businessName?: string
  ) => {
    let backendReached = false;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, businessName }),
      });

      backendReached = true;

      if (!res.ok) {
        const body = await res.json().catch(() => null);

        // Handle specific error codes
        if (res.status === 409) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        if (res.status === 400) {
          const validationMsg =
            body?.error?.details?.[0]?.message ||
            body?.error?.message ||
            body?.message ||
            'Please check your input and try again.';
          throw new Error(validationMsg);
        }

        throw new Error(body?.error?.message || body?.message || 'Registration failed. Please try again.');
      }

      const json = await res.json();
      const { token: jwtToken, user: authUser } = json.data;
      persistSession(jwtToken, authUser);
      router.push('/dashboard');
    } catch (err: any) {
      if (backendReached) {
        throw err;
      }

      // Backend unreachable — create a local demo session
      const demoUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role: 'MERCHANT',
        merchantId: `merch-${Date.now()}`,
        businessName: businessName || `${name}'s Store`,
      };
      persistSession('demo-sandbox-token', demoUser);
      router.push('/dashboard');
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
