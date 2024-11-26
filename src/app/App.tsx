import { BrowserRouter } from 'react-router-dom';
import { StyleSheetManager } from 'styled-components';
import { Layout } from '../app/layout/Layout';
import Router from './router/Router';
import { withAuth } from './providers/withAuth';
import { withCookie } from './providers/withCookie';
import { useEffect } from 'react';
import { silentRefresh } from '@/features/auth/login/lib/setupInterceptors';

function App() {
  useEffect(() => {
    silentRefresh();
  }, []);
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

export default withAuth(withCookie(App)); // withCookie 추가
