import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/User/model/store/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

export const PublicRoute = ({ children, restricted = false }: PublicRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated && restricted) {
    return <Navigate to="/main" replace />;
  }

  return <>{children}</>;
};