// mocks/handlers/intermediateHandlers.ts
import { http, HttpResponse } from 'msw';
import { MidStock } from '@/features/Intermediate_chat/types/stock';

const mockStocks: MidStock[] = [
  { midStockId: 1, midName: "삼성전자" },
  { midStockId: 2, midName: "현대자동차" },
  { midStockId: 3, midName: "카카오" }
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
  http.get('/api/v1/mid-stocks/:id/price', () => {
    const today = new Date();
    const prices = Array(14).fill(null).map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        highPrice: Math.round(1500 + Math.random() * 100),
        lowPrice: Math.round(1200 + Math.random() * 100),
        avgPrice: Math.round(1350 + Math.random() * 100),
        priceDate: date.toISOString().split('T')[0]
      };
    }).reverse();

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
    return HttpResponse.json({
      isPossibleBuy: true,
      isPossibleSell: true
    });
  }),

  // 매수 주문
  http.post('/api/v1/mid-stocks/:id/buy', async ({ request }) => {
    const body = await request.json() as { tradePoint: number };
    if (body.tradePoint > 10000000) {
      return new HttpResponse(null, { status: 400 });
    }
    return HttpResponse.json({ warning: false });
  }),

  // 매도 주문
  http.post('/api/v1/mid-stocks/:id/sell', () => {
    return HttpResponse.json({ earnedPoints: 1000 });
  })
];