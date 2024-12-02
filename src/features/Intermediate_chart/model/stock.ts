import { create } from 'zustand';
import axios from 'axios';
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
      set({ isLoading: true });
      const response = await axios.get<MidStock[]>('/api/v1/mid-stocks/list');
      set({ stocks: response.data, isLoading: false });
    } catch (error) {
      set({ error: '주식 데이터 로딩 실패', isLoading: false });
      console.error('Stock fetch error:', error);
    }
  },

  fetchStockPrices: async (stockId: number) => {
    try {
      set({ isLoading: true });
      const response = await axios.get<StockPrice[]>(`/api/v1/mid-stocks/${stockId}/price`);
      set({ currentStockPrices: response.data, isLoading: false });
    } catch (error) {
      set({ error: '주가 데이터 로딩 실패', isLoading: false });
      console.error('Stock prices fetch error:', error);
    }
  },

  fetchStockDetails: async (stockId: number) => {
    try {
      set({ isLoading: true });
      const response = await axios.get<TradeDetail[]>(
        `/api/v1/mid-stocks/${stockId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      const currentStock = (await axios.get<MidStock[]>('/api/v1/mid-stocks/list')).data
        .find(stock => stock.midStockId === stockId);
      
      if (currentStock) {
        const stockWithDetails: StockWithDetails = {
          ...currentStock,
          details: response.data
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
      set({ isLoading: true });
      const response = await axios.get<StockWithDetails[]>(
        '/api/v1/mid-stocks',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      set({ stockDetails: response.data, isLoading: false });
    } catch (error) {
      set({ error: '전체 주식 상세 정보 로딩 실패', isLoading: false });
      console.error('All stock details fetch error:', error);
    }
  },

  checkTradeAvailability: async (stockId: number) => {
    try {
      const response = await axios.get<TradeAvailability>(
        `/api/v1/mid-stocks/${stockId}/available`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      set({ tradeAvailability: response.data });
    } catch (error) {
      console.error('Trade availability check error:', error);
      set({ error: '거래 가능 여부 확인 실패' });
    }
  },

  executeTrade: async (stockId: number, tradePoint: number, type: 'buy' | 'sell') => {
    try {
      const endpoint = type === 'buy' ? 'buy' : 'sell';
      const response = await axios.post(
        `/api/v1/mid-stocks/${stockId}/${endpoint}`,
        { tradePoint },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      // 거래 후 상세 정보 갱신
      await Promise.all([
        (async () => await useStockStore.getState().fetchStockDetails(stockId))(),
        (async () => await useStockStore.getState().checkTradeAvailability(stockId))()
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