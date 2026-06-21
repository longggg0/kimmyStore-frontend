import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hook/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" />;

  return <>{children}</>;
}