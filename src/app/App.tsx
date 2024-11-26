import { BrowserRouter } from 'react-router-dom';
import { StyleSheetManager } from 'styled-components';
import { Layout } from '../app/layout/Layout';
import Router from './router/Router';
import { withAuth } from './providers/withAuth';
import { withCookie } from './providers/withCookie';
import { withQuery } from './providers/withQuery';
import { useEffect } from 'react';
import { silentRefresh } from '@/features/auth/login/lib/setupInterceptors';
import { useAuthStore } from '@/entities/User/model/store/authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken); // 👈 추가

  useEffect(() => {
    // 인증은 됐지만 accessToken이 없을 때만 refresh
    if (isAuthenticated && !accessToken) {
      silentRefresh();
    }
  }, [isAuthenticated, accessToken]);

  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== 'isSelected'}>
      <BrowserRouter>
        <Layout>
          <Router />
        </Layout>
      </BrowserRouter>
    </StyleSheetManager>
  );
}

export default withQuery(withAuth(withCookie(App)));
