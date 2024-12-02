import { create } from 'zustand';
import { BeginStockResponse } from '../types/stock';
import { FastGraphData } from '../types/graph';
import { baseApi } from '@/shared/api/base';
import { BeginStock } from '../types/stock';

interface GraphStore {
  stockData: FastGraphData[];
  isLoading: boolean;
  error: string | null;
  fetchStockData: () => Promise<void>;
}

export const useGraphStore = create<GraphStore>((set) => ({
  stockData: [],
  isLoading: false,
  error: null,
  fetchStockData: async () => {
    try {
      set({ isLoading: true });
      const response = await baseApi.get<BeginStockResponse>('/begin-stocks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data.data) {
        const formattedData: FastGraphData[] = response.data.data.map(stock => ({
          value: stock.price,
          date: stock.trade_day
        }));
        set({ stockData: formattedData, isLoading: false });
      }
    } catch (error) {
      set({ error: '데이터 로딩 실패', isLoading: false });
      console.error('Stock data fetch error:', error);
    }
  }
}));