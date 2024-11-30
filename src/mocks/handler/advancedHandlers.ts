import { WebSocket } from 'ws';

export const advancedGameHandlers = [
  {
    url: 'ws://localhost:5173/api/v1/advanced-game/stocks',
    handler: (socket: WebSocket) => {
      const stockData = {
        'SAMSUNG': { basePrice: 70000, name: '삼성전자' },
        'HYUNDAI': { basePrice: 120000, name: '현대차' },
        'KAKAO': { basePrice: 50000, name: '카카오' },
        'NAVER': { basePrice: 180000, name: '네이버' }
      };

      let interval: NodeJS.Timeout;

      const generatePrice = (basePrice: number) => {
        const variation = basePrice * 0.02;
        return basePrice + (Math.random() - 0.5) * variation;
      };

      const generateStockData = () => {
        return Object.entries(stockData).map(([symbol, info]) => {
          const basePrice = generatePrice(info.basePrice);
          return {
            symbol,
            name: info.name,
            openPrice: basePrice,
            highPrice: basePrice * (1 + Math.random() * 0.01),
            lowPrice: basePrice * (1 - Math.random() * 0.01),
            closePrice: generatePrice(basePrice),
            timestamp: Date.now() / 1000,
            dataType: 'LIVE'
          };
        });
      };

      socket.on('message', (message) => {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'START_GAME':
            interval = setInterval(() => {
              socket.send(JSON.stringify({
                type: 'LIVE_DATA',
                data: generateStockData()
              }));
            }, 1000);
            break;

          case 'PAUSE_GAME':
            if (interval) {
              clearInterval(interval);
            }
            break;
        }
      });

      socket.on('close', () => {
        if (interval) {
          clearInterval(interval);
        }
      });
    }
  }
];
