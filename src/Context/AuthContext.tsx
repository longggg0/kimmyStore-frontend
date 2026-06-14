import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 add this
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/Auth';
import { authService } from '../services/auth.service';

const TOKEN_KEY = 'auth_token';

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)) as AuthUser;
  } catch {
    return null;
  }
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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // 👈 add this

  const user: AuthUser | null = token ? decodeToken(token) : null;

  const login = async (payload: LoginPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(payload);
      localStorage.setItem(TOKEN_KEY, res.data);
      setToken(res.data);

      // 👇 decode role and redirect
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
      navigate('/'); // 👈 after register always go home
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Register failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    navigate('/'); // 👈 after logout go home
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