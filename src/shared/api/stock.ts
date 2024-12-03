import { baseApi } from '@/shared/api/base';
import { MidStock, StockPrice, TradeAvailability, TradeResponse } from '@/features/Intermediate_chart/model/types/stock';

const getAuthHeader = () => {
 const token = localStorage.getItem('accessToken');
 if (!token) {
   throw new Error('인증 토큰이 없습니다');
 }
 return { Authorization: `Bearer ${token}` };
};

export const stockApi = {
 getStockList: async () => {
   const response = await baseApi.get<MidStock[]>('/mid-stocks/list', {
     headers: getAuthHeader()
   });
   return response.data;
 },

 getStockPrices: async (stockId: number) => {
   const response = await baseApi.get<StockPrice[]>(`/mid-stocks/${stockId}/price`, {
     headers: getAuthHeader()
   });
   return response.data;
 },

 checkTradeAvailability: async (stockId: number) => {
   const response = await baseApi.get<TradeAvailability>(
     `/mid-stocks/${stockId}/available`,
     {
       headers: getAuthHeader()
     }
   );
   return response.data;
 },

 buyStock: async (stockId: number, tradePoint: number) => {
   const response = await baseApi.post<TradeResponse>(
     `/mid-stocks/${stockId}/buy`,
     { tradePoint },
     {
       headers: getAuthHeader()
     }
   );
   return response.data;
 },

 sellStock: async (stockId: number, tradePoint: number) => {
   const response = await baseApi.post<TradeResponse>(
     `/mid-stocks/${stockId}/sell`,
     { tradePoint },
     {
       headers: getAuthHeader()
     }
   );
   return response.data;
 }
};