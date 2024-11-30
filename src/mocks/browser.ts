import { setupWorker } from 'msw/browser';
import { handlers } from './handler/index';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);


// MSW 설정
const startWorker = async () => {
    await worker.start({
      onUnhandledRequest(request, print) {
        // 무시할 요청 패턴 목록
        const ignoredPatterns = [
          '/img/',
          '/font/',
          '.png',
          '.jpg',
          '.jpeg',
          '.gif',
          '.svg',
          '.woff',
          '.woff2',
          'node_modules/.vite',
          '.tsx',
          '.ts',
          '.js',
          '.css',
          'chrome-extension',
          'favicon.ico'
        ];
  
        // 위 패턴에 해당하는 요청은 무시
        if (ignoredPatterns.some(pattern => request.url.includes(pattern))) {
          return;
        }
  
        // API 요청이 아닌 경우는 무시
        if (!request.url.includes('/api/')) {
          return;
        }
  
        // 그 외의 미처리 요청만 경고로 출력
        print.warning();
      },
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: {
          scope: '/'
        }
      }
    });
  }
  
  startWorker();