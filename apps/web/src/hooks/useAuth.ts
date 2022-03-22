'use client';
import { useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'inspector' | 'garage' | 'customer';
  organizationId: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('autoinspect.auth') : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { user: AuthUser; token: string };
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem('autoinspect.auth');
      }
    }
    setLoading(false);
  }, []);

  const login = (next: { user: AuthUser; token: string }) => {
    localStorage.setItem('autoinspect.auth', JSON.stringify(next));
    setUser(next.user);
    setToken(next.token);
  };

  const logout = () => {
    localStorage.removeItem('autoinspect.auth');
    setUser(null);
    setToken(null);
  };

  return { user, token, loading, login, logout };
}
