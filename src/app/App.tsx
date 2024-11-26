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
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (isAuthenticated && !accessToken) {
      silentRefresh();
    }
  }, [isAuthenticated, accessToken]);

  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== 'isSelected'}>
      <BrowserRouter>
        <ToastContainer // 👈 Layout 밖으로 이동
          position="top-center"
          autoClose={4000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          closeButton={false}
          transition={Slide}
        />
        <Layout>
          <Router />
        </Layout>
      </BrowserRouter>
    </StyleSheetManager>
  );
}

export default withQuery(withAuth(withCookie(App)));
