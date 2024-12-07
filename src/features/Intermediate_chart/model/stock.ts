import { create } from 'zustand';
import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { MidStock, StockPrice, TradeDetail, StockWithDetails, TradeAvailability, TradeResponse } from '@/features/Intermediate_chart/model/types/stock';

interface WalletResponse {
  currentPoints: number;
  currentCoins: number;
}

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
  executeTrade: (
    stockId: number, 
    tradePoint: number, 
    type: 'buy' | 'sell', 
    stockName: string,
    quantity?: number
  ) => Promise<TradeResponse>;
  fetchCurrentPoints: () => Promise<number>;
}

export const useStockStore = create<StockStore>((set, get) => ({
  stocks: [],
  currentStockPrices: [],
  tradeAvailability: {
    isPossibleBuy: true,
    isPossibleSell: true
  },
  stockDetails: [],
  tradeDetails: [],
  isLoading: true,
  error: null,

  fetchStocks: async () => {
    try {
      set({ isLoading: true });
      const response = await baseApi.get<MidStock[]>('/mid-stocks/list');
      
      if (Array.isArray(response.data)) {
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
        stocks: []
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
      const response = await baseApi.get<TradeAvailability>(`/mid-stocks/${stockId}/available`);
      set({ tradeAvailability: response.data });
    } catch (error) {
      console.error('Trade availability check error:', error);
      // 에러 시에도 거래는 가능하도록 설정
      set({ tradeAvailability: {
        isPossibleBuy: true,
        isPossibleSell: true
      }});
    }
  },

  executeTrade: async (
    stockId: number, 
    tradePoint: number, 
    type: 'buy' | 'sell', 
    stockName: string,
    quantity?: number
  ) => {
    try {
      if (type === 'buy') {
        // 매수 거래 실행
        const tradeResponse = await baseApi.post<TradeResponse>(`/mid-stocks/${stockId}/buy`, {
          tradePoint: Number(tradePoint),
          quantity: quantity || Math.floor(tradePoint / (get().currentStockPrices[0]?.avgPrice || 1))
        });

        // 매수 성공 시 거래 가능 여부 재확인
        await get().checkTradeAvailability(stockId);
        await get().fetchStockDetails(stockId);
        
        return tradeResponse.data;

      } else {
        // 매도 거래 실행
        const tradeResponse = await baseApi.post<TradeResponse>(`/mid-stocks/${stockId}/sell`);

        // 매도 성공 시 거래 가능 여부 재확인
        await get().checkTradeAvailability(stockId);
        await get().fetchStockDetails(stockId);
        
        return tradeResponse.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('매도할 주식을 찾을 수 없습니다.');
        } else if (error.response?.status === 400) {
          const errorMessage = error.response.data.message || '거래 처리 중 오류가 발생했습니다.';
          console.error('거래 실패:', errorMessage);
          throw new Error(errorMessage);
        }
      }
      console.error('예상치 못한 오류:', error);
      throw error;
    }
  },

  fetchCurrentPoints: async () => {
    try {
      const response = await baseApi.get<WalletResponse>('/wallet/current');
      return response.data.currentPoints;
    } catch (error) {
      console.error('포인트 조회 실패:', error);
      throw error;
    }
  }
}));