export const generateMockStockData = (basePrice: number) => {
  const timestamps = [];
  const openPrices = [];
  const highPrices = [];
  const lowPrices = [];
  const closePrices = [];
  
  let currentPrice = basePrice;
  const now = new Date();
  
  for (let hour = 9; hour <= 15; hour++) {
    const timestamp = new Date(now);
    timestamp.setHours(hour, 0, 0, 0);
    
    const volatility = 0.02;
    const open = currentPrice;
    const high = open * (1 + Math.random() * volatility);
    const low = open * (1 - Math.random() * volatility);
    const close = (high + low) / 2;
    
    timestamps.push(timestamp.getTime());
    openPrices.push(open);
    highPrices.push(high);
    lowPrices.push(low);
    closePrices.push(close);
    
    currentPrice = close;
  }
  
  return {
    timestamps,
    openPrices,
    highPrices,
    lowPrices,
    closePrices
  };
};


// 백에서 데이터 정확하게 나오면 실행
// export const advancedGameHandlers = [
//   http.get('/api/v1/advanced-game/stocks/:symbol', ({ params }) => {
//     const { symbol } = params;
//     const stockData = {
//       'SAMSUNG': { basePrice: 70000, name: '삼성전자' },
//       'HYUNDAI': { basePrice: 120000, name: '현대차' },
//       'KAKAO': { basePrice: 50000, name: '카카오' },
//       'NAVER': { basePrice: 180000, name: '네이버' }
//     };

//     const stock = stockData[symbol as keyof typeof stockData];
//     if (!stock) {
//       return new HttpResponse(null, { status: 404 });
//     }

//     const priceData = generateMockStockData(stock.basePrice);

//     return HttpResponse.json({
//       symbol,
//       name: stock.name,
//       ...priceData
//     });
//   })
// ];
