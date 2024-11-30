// src/mocks/handler/advancedHandlers.ts

import { Server } from 'mock-socket';
import { http } from 'msw';

const INITIAL_STOCKS = [
  { symbol: 'SAMSUNG', basePrice: 70000, name: '삼성전자' },
  { symbol: 'HYUNDAI', basePrice: 120000, name: '현대차' },
  { symbol: 'KAKAO', basePrice: 50000, name: '카카오' },
  { symbol: 'NAVER', basePrice: 180000, name: '네이버' }
];

let gameStartTime: number | null = null;
const GAME_DURATION = 420; // 420초

const generateStockData = (elapsedSeconds: number) => {
  // 시간에 따라 변화하는 주식 데이터 생성
  const basePrice = 50000;
  const amplitude = 5000;
  const frequency = 0.01;
  
  return {
    price: basePrice + amplitude * Math.sin(frequency * elapsedSeconds),
    timestamp: new Date().getTime(),
    volume: Math.floor(Math.random() * 1000),
    change: Math.random() > 0.5 ? 1 : -1
  };
};

const mockServer = new Server('ws://localhost/api/v1/advanced-invest');

mockServer.on('connection', socket => {
  let intervalId: NodeJS.Timeout;

  socket.on('message', (data: string | Blob | ArrayBufferView | ArrayBuffer) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.action === 'START_GAME') {
        gameStartTime = Date.now();
        let elapsedSeconds = 0;

        intervalId = setInterval(() => {
          if (!gameStartTime) return;
          
          elapsedSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
          
          if (elapsedSeconds >= GAME_DURATION) {
            // 게임 종료
            clearInterval(intervalId);
            socket.send(JSON.stringify({
              type: 'END_GAME',
              data: { message: '게임 종료' }
            }));
            return;
          }

          const liveData = generateStockData(elapsedSeconds);
          socket.send(JSON.stringify({
            type: 'LIVE_DATA',
            data: liveData,
            elapsedTime: elapsedSeconds
          }));
        }, 1000); // 1초마다 데이터 업데이트
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  // 연결 종료 시 인터벌 정리
  socket.on('close', () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
});

export const advancedGameHandlers = [
  http.get('/advanced', () => {
    return new Response(null, { status: 200 });
  })
];