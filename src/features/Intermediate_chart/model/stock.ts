import { create } from 'zustand';
import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { 
  MidStock, 
  StockPrice, 
  TradeDetail, 
  StockWithDetails, 
  TradeAvailability 
} from './types/stock';

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
  executeTrade: (stockId: number, tradePoint: number, type: 'buy' | 'sell') => Promise<any>;
}

export const useStockStore = create<StockStore>((set) => ({
  stocks: [],
  currentStockPrices: [],
  tradeAvailability: {
    isPossibleBuy: false,
    isPossibleSell: false
  },
  stockDetails: [],
  isLoading: false,
  error: null,

  fetchStocks: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('accessToken');
      if (!token) {
        
        const response = await fetch('/api/token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('accessToken', data.accessToken);
        } else {
          throw new Error(data.message || 'Failed to fetch access token');
        }
      }

      
      const response = await baseApi.get<MidStock[]>('/mid-stocks/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ stocks: response.data, isLoading: false });
    } catch (error) {
      let errorMessage = '주식 데이터 로딩 실패';
      if (error instanceof Error) errorMessage = error.message;
      set({ error: errorMessage, isLoading: false });
      console.error('Stock fetch error:', error);
    }
  },

  fetchStockPrices: async (stockId: number) => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다');
      }

      const response = await baseApi.get<StockPrice[]>(`/mid-stocks/${stockId}/price`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ currentStockPrices: response.data, isLoading: false });
    } catch (error) {
      let errorMessage = '주가 데이터 로딩 실패';
      if (error instanceof Error) errorMessage = error.message;
      set({ error: errorMessage, isLoading: false });
      console.error('Stock prices fetch error:', error);
    }
  },

  fetchStockDetails: async (stockId: number) => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다');
      }

      const [detailsResponse, stocksResponse] = await Promise.all([
        baseApi.get<TradeDetail[]>(`/mid-stocks/${stockId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        baseApi.get<MidStock[]>('/mid-stocks/list', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
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
      let errorMessage = '주식 상세 정보 로딩 실패';
      if (error instanceof Error) errorMessage = error.message;
      set({ error: errorMessage, isLoading: false });
      console.error('Stock details fetch error:', error);
    }
  },

  fetchAllStockDetails: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다');
      }

      const response = await baseApi.get<StockWithDetails[]>('/mid-stocks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ stockDetails: response.data, isLoading: false });
    } catch (error) {
      let errorMessage = '전체 주식 상세 정보 로딩 실패';
      if (error instanceof Error) errorMessage = error.message;
      set({ error: errorMessage, isLoading: false });
      console.error('All stock details fetch error:', error);
    }
  },

  checkTradeAvailability: async (stockId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다');
      }

      const response = await baseApi.get<TradeAvailability>(
        `/mid-stocks/${stockId}/available`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      set({ tradeAvailability: response.data });
    } catch (error) {
      let errorMessage = '거래 가능 여부 확인 실패';
      if (error instanceof Error) errorMessage = error.message;
      set({ error: errorMessage });
      console.error('Trade availability check error:', error);
    }
  },

  executeTrade: async (stockId: number, tradePoint: number, type: 'buy' | 'sell') => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다');
      }

      const endpoint = type === 'buy' ? 'buy' : 'sell';
      const response = await baseApi.post(
        `/mid-stocks/${stockId}/${endpoint}`,
        { tradePoint },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // 거래 후 상세 정보 갱신
      await Promise.all([
        useStockStore.getState().fetchStockDetails(stockId),
        useStockStore.getState().checkTradeAvailability(stockId)
      ]);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        throw new Error(error.response.data.message);
      }
      console.error('Trade execution error:', error);
      throw error;
    }
  }
}));