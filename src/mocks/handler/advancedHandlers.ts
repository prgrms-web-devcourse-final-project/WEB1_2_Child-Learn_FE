import { http, HttpResponse } from 'msw';

const generateMockPrices = (basePrice: number, volatility: number = 0.02) => {
 const prices = [];
 let currentPrice = basePrice;
 
 // 9시부터 15시까지의 시간대별 가격 생성
 for (let hour = 9; hour <= 15; hour++) {
   const open = currentPrice;
   const high = open * (1 + Math.random() * volatility);
   const low = open * (1 - Math.random() * volatility);
   const close = (high + low) / 2;
   
   prices.push({
     timestamp: `2024-11-26T${hour.toString().padStart(2, '0')}:00:00`,
     open,
     high,
     low,
     close
   });
   
   currentPrice = close;
 }
 
 return prices;
};

export const advancedGameHandlers = [
 http.get('/api/v1/advanced-game/stocks', () => {
   return HttpResponse.json([
     { id: 1, symbol: 'SAMSUNG', name: '삼성전자', currentPrice: 70000 },
     { id: 2, symbol: 'HYUNDAI', name: '현대차', currentPrice: 120000 },
     { id: 3, symbol: 'KAKAO', name: '카카오', currentPrice: 50000 },
     { id: 4, symbol: 'NAVER', name: '네이버', currentPrice: 180000 }
   ]);
 }),

 http.get('/api/v1/advanced-game/stocks/:id/prices', ({ params }) => {
   const stockId = Number(params.id);
   const basePrices = {
     1: 70000,   // 삼성전자
     2: 120000,  // 현대차
     3: 50000,   // 카카오
     4: 180000   // 네이버
   };
   
   const prices = generateMockPrices(basePrices[stockId as keyof typeof basePrices]);
   return HttpResponse.json(prices);
 })
];