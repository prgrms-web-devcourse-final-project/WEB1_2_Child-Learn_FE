import { BrowserRouter } from 'react-router-dom';
import { StyleSheetManager } from 'styled-components';
import { Layout } from '../app/layout/Layout';
import Router from './router/Router';

function App() {
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

export default App;