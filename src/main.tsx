import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import './index.css';
import App from './app/App.tsx';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </StrictMode>
  );
});

import * as msw from 'msw';
console.log(msw);
