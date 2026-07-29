import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/Auth';
import { authService } from '../services/auth.service';

const TOKEN_KEY = 'auth_token';

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
}

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(base64UrlDecode(payload)) as AuthUser;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(base64UrlDecode(payload));
    if (!decoded.exp) return false;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

function getValidStoredToken(): string | null {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored) return null;
  if (isTokenExpired(stored)) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return stored;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getValidStoredToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const user: AuthUser | null = token ? decodeToken(token) : null;

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    navigate('/');
  };

  useEffect(() => {
    if (!token) return;

    const check = () => {
      if (isTokenExpired(token)) {
        logout();
      }
    };

    check();
    const interval = setInterval(check, 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  const login = async (payload: LoginPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(payload);
      localStorage.setItem(TOKEN_KEY, res.data);
      setToken(res.data);

      const decoded = decodeToken(res.data);
      if (decoded?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(payload);
      const res = await authService.login({ email: payload.email, password: payload.password });
      localStorage.setItem(TOKEN_KEY, res.data);
      setToken(res.data);
      navigate('/');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Register failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      loading,
      error,
      login,
      register,
      logout,
      clearError: () => setError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}