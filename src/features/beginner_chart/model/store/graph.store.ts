import { create } from 'zustand';
import { baseApi } from '@/shared/api/base';
import { BeginStockResponse } from '@/features/beginner_chart/model/types/stock';
import { FastGraphData } from '@/features/beginner_chart/model/types/graph';

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
      const token = localStorage.getItem('accessToken');
      const response = await baseApi.get<BeginStockResponse>('/api/v1/begin-stocks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.stockData) {
        const mappedData: FastGraphData[] = response.data.stockData.map(stock => ({
          value: stock.price,
          date: stock.tradeDay,
        }));
        set({ stockData: mappedData, isLoading: false });
      }
    } catch (error) {
      set({ error: '데이터 로딩 실패', isLoading: false });
      console.error('Stock data fetch error:', error);
    }
  }
}));
