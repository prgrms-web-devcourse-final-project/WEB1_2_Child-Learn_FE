import { create } from 'zustand';
import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { MidStock, StockPrice, TradeDetail, StockWithDetails, TradeAvailability, TradeResponse } from '@/features/Intermediate_chart/model/types/stock';

interface StockStore {
  stocks: MidStock[];
  currentStockPrices: StockPrice[];
  tradeAvailability: TradeAvailability;
  stockDetails: StockWithDetails[];
  tradeDetails: TradeDetail[];
  isLoading: boolean;
  error: string | null;
  fetchStocks: () => Promise<void>;
  fetchStockPrices: (stockId: number) => Promise<void>;
  fetchStockDetails: (stockId: number) => Promise<void>;
  fetchAllStockDetails: () => Promise<void>;
  checkTradeAvailability: (stockId: number) => Promise<void>;
  executeTrade: (stockId: number, tradePoint: number, type: 'buy' | 'sell') => Promise<TradeResponse>;
}

export const useStockStore = create<StockStore>((set) => ({
  stocks: [],
  currentStockPrices: [],
  tradeAvailability: {
    isPossibleBuy: false,
    isPossibleSell: true
  },
  stockDetails: [],
  tradeDetails: [],
  isLoading: true,
  error: null,

  fetchStocks: async () => {
    try {
      set({ isLoading: true });
      const response = await baseApi.get('/mid-stocks/list');
      
      if (response.status === 200 && response.data) {
        set({ 
          stocks: response.data, 
          isLoading: false 
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      set({ 
        error: '주식 목록 로딩 실패', 
        isLoading: false,
        stocks: [] // 실패 시 빈 배열로 초기화
      });
      console.error('Failed to fetch stocks:', error);
    }
  },

  fetchStockPrices: async (stockId: number) => {
    try {
      set({ isLoading: true });
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

  fetchStockDetails: async (stockId: number) => {
    try {
      set({ isLoading: true });
      const response = await baseApi.get<StockWithDetails>(`/mid-stocks/${stockId}`);
      set(state => ({
        stockDetails: [...state.stockDetails.filter(s => s.midStockId !== stockId), response.data],
        isLoading: false
      }));
    } catch (error) {
      set({ error: '주식 상세 정보 로딩 실패', isLoading: false });
    }
  },

  fetchAllStockDetails: async () => {
    try {
      set({ isLoading: true });
      const response = await baseApi.get<StockWithDetails[]>('/mid-stocks');
      set({ stockDetails: response.data, isLoading: false });
    } catch (error) {
      set({ error: '전체 주식 상세 정보 로딩 실패', isLoading: false });
    }
  },

  checkTradeAvailability: async (stockId: number) => {
    try {
      const response = await baseApi.get<TradeAvailability>(
        `/mid-stocks/${stockId}/available`
      );
      set({ tradeAvailability: {
        isPossibleBuy: true,
        isPossibleSell: response.data.isPossibleSell
      }});
    } catch (error) {
      console.error('Trade availability check error:', error);
    }
  },

  executeTrade: async (stockId: number, tradePoint: number, type: 'buy' | 'sell') => {
    try {
      if (type === 'buy') {
        const response = await baseApi.post<TradeResponse>(`/mid-stocks/${stockId}/buy`, {
          tradePoint
        });
        return response.data;
      } else {
        const response = await baseApi.post<TradeResponse>(`/mid-stocks/${stockId}/sell`);
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        // 서버에서 오는 구체적인 에러 메시지를 전달
        throw new Error(error.response.data.message || '거래 처리 중 오류가 발생했습니다.');
      }
      throw error;
    }
  }
}));