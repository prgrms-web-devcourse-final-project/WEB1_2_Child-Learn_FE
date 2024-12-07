import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import showToast from '@/shared/lib/toast';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    showToast.error('로그인이 필요한 서비스입니다.');
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};