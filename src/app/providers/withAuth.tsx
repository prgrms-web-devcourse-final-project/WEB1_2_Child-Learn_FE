import { useEffect } from 'react';
import { setupAuthInterceptors } from '@/features/auth/login/lib/setupInterceptors';
import { silentRefresh } from '@/features/auth/login/lib/setupInterceptors';

export const withAuth = (Component: React.ComponentType) => {
  return function WithAuthComponent(props: any) {
    useEffect(() => {
      setupAuthInterceptors();
      silentRefresh();
    }, []);

    return <Component {...props} />;
  };
};
