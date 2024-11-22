import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['msw'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // 폰트를 위한 설정 추가
  server: {
    fs: {
      strict: true,
    },
  },
  // public 디렉토리 설정
  publicDir: 'public',
});
