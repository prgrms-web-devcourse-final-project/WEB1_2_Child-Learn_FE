
import { baseApi } from '@/shared/api/base';

interface ReferenceData {
  // 전체 Reference Data 타입 정의
  [key: string]: any;  // 구체적인 데이터 구조가 문서에 없어서 any로 처리
}

interface LiveData {
  // 전체 Live Data 타입 정의
  [key: string]: any;
}

interface TradeHistory {
  tradeId: number;
  stockSymbol: string;
  tradeType: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  tradeDate: string;
}

interface StockQuantity {
  stockSymbol: string;
  quantity: number;
}

interface StockQuantities {
  [symbol: string]: number;
}

export const stockApi = {
  getReferenceData: async (): Promise<ReferenceData> => {
    const response = await baseApi.get('/adv-stocks/reference');
    return response.data;
  },

  getLiveData: async (): Promise<LiveData> => {
    const response = await baseApi.get('/adv-stocks/live');
    return response.data;
  },

  getTradeHistory: async (memberId: number): Promise<TradeHistory[]> => {
    const response = await baseApi.get(`/stock-records/${memberId}`);
    return response.data;
  },

  getStockQuantity: async (memberId: number, stockSymbol: string): Promise<StockQuantity[]> => {
    const response = await baseApi.get(`/stock-records/${memberId}/${stockSymbol}/quantity`);
    return response.data;
  },

  getAllStockQuantities: async (memberId: number): Promise<StockQuantities> => {
    const response = await baseApi.get(`/stock-records/${memberId}/quantities`);
    return response.data;
  }
};