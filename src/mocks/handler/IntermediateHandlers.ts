// mocks/handlers/intermediateHandlers.ts
import { http, HttpResponse } from 'msw';
import { MidStock } from '@/features/Intermediate_chat/types/stock';

const mockStocks: MidStock[] = [
 { midStockId: 1, midName: "삼성전자" },
 { midStockId: 2, midName: "현대자동차" },
 { midStockId: 3, midName: "카카오" }
];

const samsungPrices = [
 { highPrice: 730, lowPrice: 680, avgPrice: 700, priceDate: "2024-11-26" },
 { highPrice: 730, lowPrice: 680, avgPrice: 700, priceDate: "2024-11-25" },
 { highPrice: 720, lowPrice: 680, avgPrice: 700, priceDate: "2024-11-24" },
 { highPrice: 710, lowPrice: 670, avgPrice: 690, priceDate: "2024-11-23" },
 { highPrice: 730, lowPrice: 690, avgPrice: 710, priceDate: "2024-11-22" },
 { highPrice: 740, lowPrice: 700, avgPrice: 720, priceDate: "2024-11-21" },
 { highPrice: 700, lowPrice: 660, avgPrice: 680, priceDate: "2024-11-20" },
 { highPrice: 690, lowPrice: 650, avgPrice: 670, priceDate: "2024-11-17" },
 { highPrice: 720, lowPrice: 680, avgPrice: 700, priceDate: "2024-11-16" },
 { highPrice: 730, lowPrice: 690, avgPrice: 710, priceDate: "2024-11-15" },
 { highPrice: 710, lowPrice: 670, avgPrice: 690, priceDate: "2024-11-14" },
 { highPrice: 700, lowPrice: 660, avgPrice: 680, priceDate: "2024-11-13" },
 { highPrice: 720, lowPrice: 680, avgPrice: 700, priceDate: "2024-11-12" },
 { highPrice: 740, lowPrice: 700, avgPrice: 720, priceDate: "2024-11-11" }
];

const hyundaiPrices = [
 { highPrice: 12400, lowPrice: 12000, avgPrice: 12000, priceDate: "2024-11-26" },  
{ highPrice: 12300, lowPrice: 11900, avgPrice: 12000, priceDate: "2024-11-25" },
 { highPrice: 12200, lowPrice: 11800, avgPrice: 12000, priceDate: "2024-11-24" },
 { highPrice: 12100, lowPrice: 11700, avgPrice: 11900, priceDate: "2024-11-23" },
 { highPrice: 12300, lowPrice: 11900, avgPrice: 12100, priceDate: "2024-11-22" },
 { highPrice: 12400, lowPrice: 12000, avgPrice: 12200, priceDate: "2024-11-21" },
 { highPrice: 12000, lowPrice: 11600, avgPrice: 11800, priceDate: "2024-11-20" },
 { highPrice: 11900, lowPrice: 11500, avgPrice: 11700, priceDate: "2024-11-17" },
 { highPrice: 12200, lowPrice: 11800, avgPrice: 12000, priceDate: "2024-11-16" },
 { highPrice: 12300, lowPrice: 11900, avgPrice: 12100, priceDate: "2024-11-15" },
 { highPrice: 12100, lowPrice: 11700, avgPrice: 11900, priceDate: "2024-11-14" },
 { highPrice: 12000, lowPrice: 11600, avgPrice: 11800, priceDate: "2024-11-13" },
 { highPrice: 12200, lowPrice: 11800, avgPrice: 12000, priceDate: "2024-11-12" },
 { highPrice: 12400, lowPrice: 12000, avgPrice: 12200, priceDate: "2024-11-11" }
];

const kakaoPrices = [
 { highPrice: 2540000, lowPrice: 2500000, avgPrice: 2500000, priceDate: "2024-11-26" },
 { highPrice: 2530000, lowPrice: 2490000, avgPrice: 2490000, priceDate: "2024-11-25" },   
 { highPrice: 2520000, lowPrice: 2480000, avgPrice: 2500000, priceDate: "2024-11-24" },
 { highPrice: 2510000, lowPrice: 2470000, avgPrice: 2490000, priceDate: "2024-11-23" },
 { highPrice: 2530000, lowPrice: 2490000, avgPrice: 2510000, priceDate: "2024-11-22" },
 { highPrice: 2540000, lowPrice: 2500000, avgPrice: 2520000, priceDate: "2024-11-21" },
 { highPrice: 2500000, lowPrice: 2460000, avgPrice: 2480000, priceDate: "2024-11-20" },
 { highPrice: 2490000, lowPrice: 2450000, avgPrice: 2470000, priceDate: "2024-11-17" },
 { highPrice: 2520000, lowPrice: 2480000, avgPrice: 2500000, priceDate: "2024-11-16" },
 { highPrice: 2530000, lowPrice: 2490000, avgPrice: 2510000, priceDate: "2024-11-15" },
 { highPrice: 2510000, lowPrice: 2470000, avgPrice: 2490000, priceDate: "2024-11-14" },
 { highPrice: 2500000, lowPrice: 2460000, avgPrice: 2480000, priceDate: "2024-11-13" },
 { highPrice: 2520000, lowPrice: 2480000, avgPrice: 2500000, priceDate: "2024-11-12" },
 { highPrice: 2540000, lowPrice: 2500000, avgPrice: 2520000, priceDate: "2024-11-11" }
];

export const intermediateHandlers = [
 // 중급 종목 리스트
 http.get('/api/v1/mid-stocks/list', () => {
   return new HttpResponse(
     JSON.stringify({ data: mockStocks }), 
     {
       status: 200,
       headers: {
         'Content-Type': 'application/json'
       }
     }
   );
 }),
 
 // 차트 정보
 http.get('/api/v1/mid-stocks/:id/price', ({ params }) => {
   const stockId = Number(params.id);
   let prices;
   
   switch(stockId) {
     case 1: // 삼성전자 (백원대)
       prices = samsungPrices;
       break;
     case 2: // 현대자동차 (만원대)
       prices = hyundaiPrices;
       break;
     case 3: // 카카오 (백만원대)
       prices = kakaoPrices;
       break;
     default:
       prices = samsungPrices;
   }
   
   console.log('MSW returning price data:', prices);
   
   return HttpResponse.json(
     prices,
     {
       status: 200,
       headers: {
         'Content-Type': 'application/json'
       }
     }
   );
 }),

 // 거래 가능 여부
 http.get('/api/v1/mid-stocks/:id/available', () => {
    console.log('MSW returning available data');
   return HttpResponse.json({
     isPossibleBuy: true,
     isPossibleSell: true
   });
 }),
// 매수 주문 핸들러 수정
http.post('/api/v1/mid-stocks/:id/buy', async ({ request }) => {
  const body = await request.json() as { tradePoint: number };
  console.log('Buy request:', body);
  
  if (body.tradePoint > 10000000) {
    return new HttpResponse(null, { status: 400 });
  }
  
  return HttpResponse.json({ 
    warning: false,
    tradePoint: body.tradePoint  // 실제 거래 금액 반환
  });
}),

// 매도 주문 핸들러 수정
http.post('/api/v1/mid-stocks/:id/sell', async ({ request }) => {
  const body = await request.json() as { tradePoint: number };
  console.log('Sell request:', body);
  
  return HttpResponse.json({ 
    earnedPoints: body.tradePoint  // 실제 거래 금액을 포인트로 반환
  });
})

];