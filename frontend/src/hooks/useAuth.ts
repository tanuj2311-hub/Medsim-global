import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';
import type { User, LoginPayload, RegisterPayload } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) { setLoading(false); return; }
    authAPI.me().then(setUser).catch(() => Cookies.remove('access_token')).finally(() => setLoading(false));
  }, []);

  const login = async (payload: LoginPayload) => {
    await authAPI.login(payload);
    const u = await authAPI.me();
    setUser(u);
  };

  const register = async (payload: RegisterPayload) => {
    await authAPI.register(payload);
    const u = await authAPI.me();
    setUser(u);
  };

  const logout = () => { setUser(null); authAPI.logout(); };

  return { user, loading, login, register, logout, isAuthenticated: !!user };
};
