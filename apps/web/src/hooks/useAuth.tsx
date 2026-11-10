'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, businessName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('resolveai_token');
    const savedUser = localStorage.getItem('resolveai_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('resolveai_token');
        localStorage.removeItem('resolveai_user');
      }
    } else {
      // Set default demo merchant for instant exploration
      const demoUser: User = {
        id: 'usr-demo',
        name: 'Elena Rostova',
        email: 'merchant@resolveai.test',
        role: 'MERCHANT',
        merchantId: 'merch-1',
      };
      setUser(demoUser);
      setToken('demo-mock-jwt-token');
      localStorage.setItem('resolveai_token', 'demo-mock-jwt-token');
      localStorage.setItem('resolveai_user', JSON.stringify(demoUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (!res.ok) {
        throw new Error('Invalid email or password');
      }

      const json = await res.json();
      const { token: jwtToken, user: authUser } = json.data;

      setToken(jwtToken);
      setUser(authUser);
      localStorage.setItem('resolveai_token', jwtToken);
      localStorage.setItem('resolveai_user', JSON.stringify(authUser));
      router.push('/dashboard');
    } catch {
      // Demo fallback login
      const demoUser: User = {
        id: 'usr-demo',
        name: email.split('@')[0],
        email,
        role: 'MERCHANT',
        merchantId: 'merch-1',
      };
      setToken('mock-token');
      setUser(demoUser);
      localStorage.setItem('resolveai_token', 'mock-token');
      localStorage.setItem('resolveai_user', JSON.stringify(demoUser));
      router.push('/dashboard');
    }
  };

  const register = async (name: string, email: string, pass: string, businessName?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, businessName }),
      });
      if (!res.ok) throw new Error('Registration failed');
      const json = await res.json();
      const { token: jwtToken, user: authUser } = json.data;
      setToken(jwtToken);
      setUser(authUser);
      localStorage.setItem('resolveai_token', jwtToken);
      localStorage.setItem('resolveai_user', JSON.stringify(authUser));
      router.push('/dashboard');
    } catch {
      await login(email, pass);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('resolveai_token');
    localStorage.removeItem('resolveai_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
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

