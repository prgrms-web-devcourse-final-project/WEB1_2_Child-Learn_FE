// mocks/handlers/intermediateHandlers.ts
import { http, HttpResponse } from 'msw';
import { MidStock } from '@/features/Intermediate_chart/model/types/stock';

const mockStocks: MidStock[] = [
  { midStockId: 1, midName: "Samsung" },
  { midStockId: 2, midName: "Hyundai" },
  { midStockId: 3, midName: "Kakao" }
];

// Mock holdings data
const mockHoldings = {
  1: [  // Samsung
    { stockId: 1, quantity: 10, purchasePrice: 100 }
  ],
  2: [  // Hyundai
    { stockId: 2, quantity: 5, purchasePrice: 9000 }
  ],
  3: [  // Kakao
    { stockId: 3, quantity: 2, purchasePrice: 1000000 }
  ]
};

// 백엔드 데이터 변환 함수
const convertBackendData = (data: any[]) => {
  return data.map(item => ({
    highPrice: Math.round(item.highPrice * 7),
    lowPrice: Math.round(item.lowPrice * 7),
    avgPrice: Math.round(item.avgPrice * 7),
    priceDate: item.priceDate.split('T')[0]
  })).reverse();
};

const backendSamsungData = [
  {
    "highPrice": 104,
    "lowPrice": 91,
    "avgPrice": 97,
    "priceDate": "2024-11-11T00:31:25.245316"
  },
  {
    "highPrice": 101,
    "lowPrice": 92,
    "avgPrice": 96,
    "priceDate": "2024-11-12T00:31:25.245316"
  },
  {
    "highPrice": 103,
    "lowPrice": 91,
    "avgPrice": 97,
    "priceDate": "2024-11-13T00:31:25.245316"
  },
  {
    "highPrice": 108,
    "lowPrice": 94,
    "avgPrice": 101,
    "priceDate": "2024-11-14T00:31:25.245316"
  },
  {
    "highPrice": 108,
    "lowPrice": 99,
    "avgPrice": 103,
    "priceDate": "2024-11-15T00:31:25.245316"
  },
  {
    "highPrice": 107,
    "lowPrice": 93,
    "avgPrice": 100,
    "priceDate": "2024-11-16T00:31:25.245316"
  },
  {
    "highPrice": 113,
    "lowPrice": 97,
    "avgPrice": 105,
    "priceDate": "2024-11-17T00:31:25.245316"
  },
  {
    "highPrice": 107,
    "lowPrice": 104,
    "avgPrice": 105,
    "priceDate": "2024-11-18T00:31:25.246315"
  },
  {
    "highPrice": 114,
    "lowPrice": 98,
    "avgPrice": 106,
    "priceDate": "2024-11-19T00:31:25.246315"
  },
  {
    "highPrice": 109,
    "lowPrice": 105,
    "avgPrice": 107,
    "priceDate": "2024-11-20T00:31:25.246315"
  },
  {
    "highPrice": 108,
    "lowPrice": 104,
    "avgPrice": 106,
    "priceDate": "2024-11-21T00:31:25.246315"
  },
  {
    "highPrice": 114,
    "lowPrice": 106,
    "avgPrice": 110,
    "priceDate": "2024-11-22T00:31:25.246315"
  },
  {
    "highPrice": 121,
    "lowPrice": 108,
    "avgPrice": 114,
    "priceDate": "2024-11-23T00:31:25.246315"
  },
  {
    "highPrice": 113,
    "lowPrice": 112,
    "avgPrice": 112,
    "priceDate": "2024-11-24T00:31:25.246315"
  },
  {
    "highPrice": 123,
    "lowPrice": 110,
    "avgPrice": 116,
    "priceDate": "2024-11-25T00:31:25.246315"
  },
  {
    "highPrice": 124,
    "lowPrice": 109,
    "avgPrice": 116,
    "priceDate": "2024-11-26T00:31:25.246315"
  }
];

const samsungPrices = convertBackendData(backendSamsungData);

const hyundaiPrices = [
 {
   "highPrice": 10062,
   "lowPrice": 9794,
   "avgPrice": 9928,
   "priceDate": "2024-11-11T16:00:44.875599"
 },
 {
   "highPrice": 10255,
   "lowPrice": 9227,
   "avgPrice": 9741,
   "priceDate": "2024-11-12T16:00:44.875599"
 },
 {
   "highPrice": 10744,
   "lowPrice": 9174,
   "avgPrice": 9959,
   "priceDate": "2024-11-13T16:00:44.875599"
 },
 {
   "highPrice": 10680,
   "lowPrice": 9244,
   "avgPrice": 9962,
   "priceDate": "2024-11-14T16:00:44.875599"
 },
 {
   "highPrice": 10751,
   "lowPrice": 9250,
   "avgPrice": 10000,
   "priceDate": "2024-11-15T16:00:44.875599"
 },
 {
   "highPrice": 10885,
   "lowPrice": 9264,
   "avgPrice": 10074,
   "priceDate": "2024-11-16T16:00:44.875599"
 },
 {
   "highPrice": 9949,
   "lowPrice": 9272,
   "avgPrice": 9610,
   "priceDate": "2024-11-17T16:00:44.875599"
 },
 {
   "highPrice": 10698,
   "lowPrice": 9364,
   "avgPrice": 10031,
   "priceDate": "2024-11-18T16:00:44.875599"
 },
 {
   "highPrice": 9879,
   "lowPrice": 9771,
   "avgPrice": 9825,
   "priceDate": "2024-11-19T16:00:44.875599"
 },
 {
   "highPrice": 9899,
   "lowPrice": 9631,
   "avgPrice": 9765,
   "priceDate": "2024-11-20T16:00:44.876606"
 },
 {
   "highPrice": 9898,
   "lowPrice": 9841,
   "avgPrice": 9869,
   "priceDate": "2024-11-21T16:00:44.876606"
 },
 {
   "highPrice": 9950,
   "lowPrice": 9696,
   "avgPrice": 9823,
   "priceDate": "2024-11-22T16:00:44.876606"
 },
 {
   "highPrice": 10401,
   "lowPrice": 8814,
   "avgPrice": 9607,
   "priceDate": "2024-11-23T16:00:44.876606"
 },
 {
   "highPrice": 10196,
   "lowPrice": 8626,
   "avgPrice": 9411,
   "priceDate": "2024-11-24T16:00:44.876606"
 },
 {
   "highPrice": 9740,
   "lowPrice": 8852,
   "avgPrice": 9296,
   "priceDate": "2024-11-25T16:00:44.876606"
 },
 {
   "highPrice": 9087,
   "lowPrice": 8880,
   "avgPrice": 8983,
   "priceDate": "2024-11-26T16:00:44.876606"
 }
];
const kakaoCorpPrices = [  
  {
    "highPrice": 1125065,
    "lowPrice": 945000,
    "avgPrice": 1035032,
    "priceDate": "2024-11-11T16:00:44.895646"
  },
  {
    "highPrice": 1067433,
    "lowPrice": 998541,
    "avgPrice": 1032987,
    "priceDate": "2024-11-12T16:00:44.895646"
  },
  {
    "highPrice": 1076013,
    "lowPrice": 949856,
    "avgPrice": 1012934,
    "priceDate": "2024-11-13T16:00:44.896653"
  },
  {
    "highPrice": 1045461,
    "lowPrice": 988078,
    "avgPrice": 1016769,
    "priceDate": "2024-11-14T16:00:44.896653"
  },
  {
    "highPrice": 1036008,
    "lowPrice": 1032932,
    "avgPrice": 1034470,
    "priceDate": "2024-11-15T16:00:44.896653"
  },
  {
    "highPrice": 1137820,
    "lowPrice": 965678,
    "avgPrice": 1051749,
    "priceDate": "2024-11-16T16:00:44.896653"
  },
  {
    "highPrice": 1132439,
    "lowPrice": 1075431,
    "avgPrice": 1103935,
    "priceDate": "2024-11-17T16:00:44.896653"
  },
  {
    "highPrice": 1165490,
    "lowPrice": 1057665,
    "avgPrice": 1111577,
    "priceDate": "2024-11-18T16:00:44.896653"
  },
  {
    "highPrice": 1152515,
    "lowPrice": 1152163,
    "avgPrice": 1152339,
    "priceDate": "2024-11-19T16:00:44.896653"
  },
  {
    "highPrice": 1286501,
    "lowPrice": 1123293,
    "avgPrice": 1204897,
    "priceDate": "2024-11-20T16:00:44.896653"
  },
  {
    "highPrice": 1319476,
    "lowPrice": 1150953,
    "avgPrice": 1235214,
    "priceDate": "2024-11-21T16:00:44.896653"
  },
  {
    "highPrice": 1304596,
    "lowPrice": 1115673,
    "avgPrice": 1210134,
    "priceDate": "2024-11-22T16:00:44.896653"
  },
  {
    "highPrice": 1225795,
    "lowPrice": 1120670,
    "avgPrice": 1173232,
    "priceDate": "2024-11-23T16:00:44.896653"
  },
  {
    "highPrice": 1265084,
    "lowPrice": 1195146,
    "avgPrice": 1230115,
    "priceDate": "2024-11-24T16:00:44.896653"
  },
  {
    "highPrice": 1286722,
    "lowPrice": 1276937,
    "avgPrice": 1281829,
    "priceDate": "2024-11-25T16:00:44.896653"
  },
  {
    "highPrice": 1383226,
    "lowPrice": 1187009,
    "avgPrice": 1285117,
    "priceDate": "2024-11-26T16:00:44.896653"
  }
 ];
 
 export const intermediateHandlers = [
  // 주식 목록 조회
  http.get('/api/v1/mid-stocks/list', () => {
    console.log('MSW: Stock list request received');
    console.log('Mock stocks available:', mockStocks);
    return HttpResponse.json(mockStocks);
  }),

  // 주가 데이터 조회
  http.get('/api/v1/mid-stocks/:id/price', ({ params }) => {
    const stockId = Number(params.id);
    console.log(`MSW: Price request received for stock ID: ${stockId}`);
    
    let prices;
    let stockName = '';
    
    switch(stockId) {
      case 1:
        prices = samsungPrices;
        stockName = 'Samsung';
        break;
      case 2:
        prices = hyundaiPrices;
        stockName = 'Hyundai';
        break;
      case 3:
        prices = kakaoCorpPrices;
        stockName = 'Kakao';
        break;
      default:
        console.warn(`MSW: Unknown stock ID ${stockId}`);
        return new HttpResponse(null, { status: 404 });
    }
    
    console.log(`MSW: Returning ${stockName} prices:`, prices.length, 'data points');
    return HttpResponse.json(prices);
  }),

  // 거래 가능 여부 체크
  http.get('/api/v1/mid-stocks/:id/available', ({ params }) => {
    const stockId = Number(params.id);
    const holdings = mockHoldings[stockId as keyof typeof mockHoldings] || [];
    
    console.log('MSW: Checking availability for stockId:', stockId);
    console.log('Holdings:', holdings);
    
    return HttpResponse.json({
      isPossibleBuy: true,
      isPossibleSell: holdings.length > 0
    });
  }),

  // 매수 주문 처리
  http.post('/api/v1/mid-stocks/:id/buy', async ({ params, request }) => {
    const stockId = Number(params.id);
    const body = await request.json() as { tradePoint: number };
    console.log('Buy request:', { stockId, ...body });
    
    if (body.tradePoint > 10000000) {
      return new HttpResponse(
        JSON.stringify({ message: '거래 한도를 초과했습니다.' }), 
        { status: 400 }
      );
    }

    const currentPrice = 
      stockId === 1 ? samsungPrices[0].avgPrice :
      stockId === 2 ? hyundaiPrices[0].avgPrice :
      kakaoCorpPrices[0].avgPrice;

    const quantity = Math.floor(body.tradePoint / currentPrice);
    
    // 매수 후 holdings 업데이트
    if (!mockHoldings[stockId as keyof typeof mockHoldings]) {
      mockHoldings[stockId as keyof typeof mockHoldings] = [];
    }
    
    mockHoldings[stockId as keyof typeof mockHoldings].push({
      stockId,
      quantity,
      purchasePrice: currentPrice
    });
    
    return HttpResponse.json({ 
      warning: false,
      tradePoint: body.tradePoint,
      quantity
    });
  }),
// 매도 주문 처리
http.post('/api/v1/mid-stocks/:id/sell', async ({ params }) => {
  const stockId = Number(params.id);
  const holdings = mockHoldings[stockId as keyof typeof mockHoldings] || [];
  
  console.log('Sell request for stockId:', stockId);
  console.log('Current holdings:', holdings);

  if (holdings.length === 0) {
    return new HttpResponse(
      JSON.stringify({ message: '매도할 주식이 없습니다.' }), 
      { status: 400 }
    );
  }

  const holding = holdings[0];  // 첫 번째 보유 주식 정보 사용
  const currentPrice = 
    stockId === 1 ? samsungPrices[0].avgPrice :
    stockId === 2 ? hyundaiPrices[0].avgPrice :
    kakaoCorpPrices[0].avgPrice;

  const earnedPoints = holding.quantity * currentPrice;
  
  // 매도 후 holdings 업데이트 - 첫 번째 항목 제거
  mockHoldings[stockId as keyof typeof mockHoldings] = holdings.slice(1);
  
  // 매도 응답
  return HttpResponse.json({ 
    earnedPoints,
    quantity: holding.quantity,
    price: currentPrice,
    tradePoint: earnedPoints
  });
}),

http.post('/api/v1/wallet/invest', async ({ request }) => {
  const body = await request.json() as { points: number };
  console.log('Wallet invest request:', body);
  
  return HttpResponse.json({
    currentPoints: body.points,
    currentCoins: 0
  });
}),

// 보유 주식 조회 핸들러 추가
http.get('/api/v1/mid-stocks/:id/holding', ({ params }) => {
  const stockId = Number(params.id);
  const holdings = mockHoldings[stockId as keyof typeof mockHoldings] || [];
  
  return HttpResponse.json(holdings);
})
];  