import { create } from 'zustand';
import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { MidStock, StockPrice, TradeDetail, StockWithDetails, TradeAvailability, TradeResponse } from '@/features/Intermediate_chart/model/types/stock';

interface StockStore {
 stocks: MidStock[];
 currentStockPrices: StockPrice[];
 tradeAvailability: TradeAvailability;
 stockDetails: StockWithDetails[];
 isLoading: boolean;
 error: string | null;
 fetchStocks: () => Promise<void>;
 fetchStockPrices: (stockId: number) => Promise<void>;
 fetchStockDetails: (stockId: number) => Promise<void>;
 fetchAllStockDetails: () => Promise<void>;
 checkTradeAvailability: (stockId: number) => Promise<void>;
 fetchStockHoldings: (stockId: number) => Promise<TradeDetail[]>;
 executeTrade: (stockId: number, tradePoint: number, type: 'buy' | 'sell') => Promise<TradeResponse>;
 getStockDetails: (stockId: number) => Promise<TradeDetail[]>;
 getTradeDetails: (stockId: number) => Promise<TradeDetail[]>;
}



export const useStockStore = create<StockStore>((set, get) => ({
 stocks: [],
 currentStockPrices: [],
 tradeAvailability: {
   isPossibleBuy: false,
   isPossibleSell: false
 },
 stockDetails: [],
 isLoading: false,
 error: null,

 fetchStockHoldings: async (stockId: number) => {
  try {
    // 특정 종목의 매수 내역만 조회
    const response = await baseApi.get<TradeDetail[]>(`/mid-stocks/${stockId}`);
    return response.data;
  } catch (error) {
    console.error('Stock holdings fetch error:', error);
    return [];
  }
},
 fetchStockPrices: async (stockId: number) => {
   try {
     set({ isLoading: true, error: null });
     const response = await baseApi.get<StockPrice[]>(`/mid-stocks/${stockId}/price`);
     
     const formattedPrices = response.data.map(price => ({
       ...price,
       priceDate: new Date(price.priceDate).toLocaleDateString()
     }));
     
     set({ currentStockPrices: formattedPrices, isLoading: false });
   } catch (error) {
     set({ error: '주가 데이터 로딩 실패', isLoading: false });
     console.error('Stock prices fetch error:', error);
   }
 },

 getStockDetails: async (stockId: number) => {
  try {
    const response = await baseApi.get<TradeDetail[]>(`/mid-stocks/${stockId}`);
    return response.data;
  } catch (error) {
    console.error('주식 상세 정보 조회 실패:', error);
    return [];
  }
},

 fetchStockDetails: async (stockId: number) => {
   try {
     set({ isLoading: true, error: null });
     const [stocksResponse, detailsResponse] = await Promise.all([
       baseApi.get<MidStock[]>('/mid-stocks'),
       baseApi.get<TradeDetail[]>(`/mid-stocks/${stockId}`)
     ]);
     
     const currentStock = stocksResponse.data.find(stock => stock.midStockId === stockId);
     
     if (currentStock) {
       const stockWithDetails: StockWithDetails = {
         ...currentStock,
         details: detailsResponse.data
       };
       set(state => ({
         stockDetails: [...state.stockDetails.filter(s => s.midStockId !== stockId), stockWithDetails],
         isLoading: false
       }));
     }
   } catch (error) {
     set({ error: '주식 상세 정보 로딩 실패', isLoading: false });
     console.error('Stock details fetch error:', error);
   }
 },

 fetchAllStockDetails: async () => {
   try {
     set({ isLoading: true, error: null });
     const response = await baseApi.get<StockWithDetails[]>('/mid-stocks');
     set({ stockDetails: response.data, isLoading: false });
   } catch (error) {
     set({ error: '전체 주식 상세 정보 로딩 실패', isLoading: false });
     console.error('All stock details fetch error:', error);
   }
 },

 checkTradeAvailability: async (stockId: number) => {
   try {
     const response = await baseApi.get<TradeAvailability>(
       `/mid-stocks/${stockId}/available`
     );
     set({ tradeAvailability: response.data });
   } catch (error) {
     set({ error: '거래 가능 여부 확인 실패' });
     console.error('Trade availability check error:', error);
   }
 },

 executeTrade: async (stockId: number, tradePoint: number, type: 'buy' | 'sell') => {
    try {
      if (type === 'sell') {
        const response = await baseApi.post<TradeResponse>(`/mid-stocks/${stockId}/sell`);
        return response.data;
      } else {
        const response = await baseApi.post<TradeResponse>(`/mid-stocks/${stockId}/buy`, {
          tradePoint
        });
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  fetchStocks: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await baseApi.get<MidStock[]>('/mid-stocks');
      set({ stocks: response.data, isLoading: false });
    } catch (error) {
      set({ error: '주식 목록 로딩 실패', isLoading: false });
      console.error('Stocks fetch error:', error);
    }
  },

  getTradeDetails: async (stockId: number) => {
    try {
      const response = await baseApi.get(`/trades/${stockId}`);
      return response.data;
    } catch (error) {
      console.error('거래 내역 조회 실패:', error);
      return [];
    }
  }
}));
