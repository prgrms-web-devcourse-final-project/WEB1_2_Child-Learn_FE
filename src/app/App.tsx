import { BrowserRouter } from 'react-router-dom';
import { StyleSheetManager } from 'styled-components';
import { Layout } from '../app/layout/Layout';
import Router from './router/Router';
import { withAuth } from './providers/withAuth';
import { CookiesProvider } from 'react-cookie';

function App() {
  return (
    <CookiesProvider>
      <StyleSheetManager shouldForwardProp={(prop) => prop !== 'isSelected'}>
        <BrowserRouter>
          <Layout>
            <Router />
          </Layout>
        </BrowserRouter>
      </StyleSheetManager>
    </CookiesProvider>
  );
}

export default withAuth(App);
