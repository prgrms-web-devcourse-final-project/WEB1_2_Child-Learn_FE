import { baseApi } from '@/shared/api/base';

interface StockPointResponse {
    memberId: number;
    currentPoints: number;
    currentCoins: number;
  }
  
  export const addStockPoints = async (userId: number): Promise<StockPointResponse> => {
    const response = await baseApi.post('/api/v1/wallet/invest', {
      memberId: userId,
      transactionType: 'EARN',
      points: 100,
      pointType: 'STOCK',
      stockType: 'BEGIN',
      stockName: '초급 주식 퀴즈'
    });
  
    return response.data;
  };