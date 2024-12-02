// shared/api/stock.ts
import { baseApi } from '@/shared/api/base';
import { MidStock, StockPrice, TradeResponse, TradeAvailability } from '@/features/Intermediate_chart/model/types/stock';

export const stockApi = {
  getStockList: async () => {
    const response = await baseApi.get<MidStock[]>('/mid-stocks/list');
    return response.data;
  },

  getStockPrices: async (stockId: number) => {
    const response = await baseApi.get<StockPrice[]>(`/mid-stocks/${stockId}/price`);
    return response.data;
  },

  checkTradeAvailability: async (stockId: number) => {
    const response = await baseApi.get<TradeAvailability>(
      `/mid-stocks/${stockId}/available`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      }
    );
    return response.data;
  },

  buyStock: async (stockId: number, tradePoint: number) => {
    const response = await baseApi.post<TradeResponse>(
      `/mid-stocks/${stockId}/buy`,
      { tradePoint },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      }
    );
    return response.data;
  },

  sellStock: async (stockId: number, tradePoint: number) => {
    const response = await baseApi.post<TradeResponse>(
      `/mid-stocks/${stockId}/sell`,
      { tradePoint },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      }
    );
    return response.data;
  }
};