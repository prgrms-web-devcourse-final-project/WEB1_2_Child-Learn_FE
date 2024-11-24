import { ChartData } from '../types/stock';

export const generateStockData = (stockId: number): ChartData[] => {
  // 각 주식의 기준가격 설정
  const basePrice = stockId === 1 ? 700 : stockId === 2 ? 12000 : 2500000;
  // 변동폭을 5%로 제한 (0.05)
  const maxVolatility = 0.025; // 상하 2.5%로 설정하여 전체 변동폭이 5% 되도록
  const data: ChartData[] = [];

  let prevClose = basePrice; // 이전 종가를 기준으로 변동

  for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (14 - i));
      
      // 변동폭을 제한하여 가격 계산
      const volatility = (Math.random() - 0.5) * maxVolatility * 2;
      const openPrice = Math.round(prevClose * (1 + (Math.random() - 0.5) * maxVolatility));
      const closePrice = Math.round(prevClose * (1 + volatility));
      
      // 고가와 저가도 변동폭 내에서 제한
      const maxChange = prevClose * maxVolatility;
      const highPrice = Math.min(
          Math.max(openPrice, closePrice) + Math.round(Math.random() * maxChange),
          prevClose * (1 + maxVolatility)
      );
      const lowPrice = Math.max(
          Math.min(openPrice, closePrice) - Math.round(Math.random() * maxChange),
          prevClose * (1 - maxVolatility)
      );

      data.push({
          x: date.getTime(),
          y: [openPrice, highPrice, lowPrice, closePrice]
      });

      prevClose = closePrice; // 다음 봉의 기준가격으로 현재 종가 사용
  }
  return data;
};