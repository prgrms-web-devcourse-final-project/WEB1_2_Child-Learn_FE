// src/mocks/handler/advancedHandlers.ts

import { Server } from 'mock-socket';
import { http } from 'msw';

const INITIAL_STOCKS = [
  { symbol: 'SAMSUNG', basePrice: 70000, name: '삼성전자' },
  { symbol: 'HYUNDAI', basePrice: 120000, name: '현대차' },
  { symbol: 'KAKAO', basePrice: 50000, name: '카카오' },
  { symbol: 'NAVER', basePrice: 180000, name: '네이버' }
];

const generateStockData = () => {
  return INITIAL_STOCKS.map(stock => {
    const basePrice = stock.basePrice;
    const variance = basePrice * 0.02;
    const currentPrice = basePrice + (Math.random() - 0.5) * variance;

    return {
      symbol: stock.symbol,
      name: stock.name,
      timestamp: Math.floor(Date.now() / 1000),
      openPrice: currentPrice,
      highPrice: currentPrice * 1.01,
      lowPrice: currentPrice * 0.99,
      closePrice: currentPrice + (Math.random() - 0.5) * variance * 0.5,
      volume: Math.floor(Math.random() * 10000)
    };
  });
};

// Mock WebSocket 서버 설정
const mockServer = new Server('ws://localhost/api/v1/advanced-invest');

let gameInterval: NodeJS.Timeout | null = null;
let isPaused = false;

mockServer.on('connection', socket => {
  console.log('클라이언트 연결됨');
  
  // 연결 즉시 초기 데이터 전송
  socket.send(JSON.stringify({
    type: 'REFERENCE_DATA',
    data: generateStockData()
  }));

  socket.on('message', (data: string) => {
    try {
      const message = JSON.parse(data);
      console.log('Received message from client:', message); // 디버깅 로그 추가

      switch (message.action) {
        case 'START_GAME':
          console.log('Starting game...'); // 디버깅 로그 추가
          if (gameInterval) clearInterval(gameInterval);
          
          gameInterval = setInterval(() => {
            if (!isPaused) {
              const liveData = generateStockData();
              console.log('Sending live data:', liveData); // 디버깅 로그 추가
              socket.send(JSON.stringify({
                type: 'LIVE_DATA',
                data: liveData
              }));
            }
          }, 1000);
          break;

        case 'PAUSE_GAME':
          console.log('Pausing game...'); // 디버깅 로그 추가
          isPaused = true;
          socket.send(JSON.stringify({
            type: 'PAUSE_GAME',
            message: '게임이 일시정지되었습니다.'
          }));
          break;

        case 'RESUME_GAME':
          console.log('Resuming game...'); // 디버깅 로그 추가
          isPaused = false;
          socket.send(JSON.stringify({
            type: 'RESUME_GAME',
            message: '게임이 재개되었습니다.'
          }));
          break;

        case 'END_GAME':
          console.log('Ending game...'); // 디버깅 로그 추가
          if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
          }
          socket.send(JSON.stringify({
            type: 'END_GAME',
            message: '게임이 종료되었습니다.'
          }));
          socket.close();
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected'); // 디버깅 로그 추가
    if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = null;
    }
  });
});

export const advancedGameHandlers = [
  http.get('/advanced', () => {
    return new Response(null, { status: 200 });
  }),
];