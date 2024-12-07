import { useEffect } from 'react';
import {
  setupAuthInterceptors,
  silentRefresh,
} from '@/features/auth/login/lib/setupInterceptors';
import { useAuthStore } from '@/entities/User/model/store/authStore';

export const withAuth = (Component: React.ComponentType) => {
  return function WithAuthComponent(props: any) {
    useEffect(() => {
      setupAuthInterceptors();
      // 인증 상태일 때만 refresh 시도
      if (useAuthStore.getState().isAuthenticated) {
        silentRefresh();
      }
    }, []);

    return <Component {...props} />;
  };
};
