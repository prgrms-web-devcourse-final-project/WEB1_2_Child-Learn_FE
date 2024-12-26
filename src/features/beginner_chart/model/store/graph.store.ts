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
      const response = await baseApi.get<BeginStockResponse>('/begin-stocks');
      
      if (response.data.stockData) {
        const today = new Date().getDay();
        const daysOrder = ['월', '화', '수', '목', '금', '토', '일'];
        const adjustedToday = today === 0 ? 6 : today - 1;
        
        const reorderedData = [...response.data.stockData];
        const halfLength = Math.floor(daysOrder.length / 2);
        const startIdx = (adjustedToday - halfLength + 7) % 7;
        
        const orderedData = new Array(7);
        for (let i = 0; i < 7; i++) {
          const dataIdx = (startIdx + i) % 7;
          const dayData = reorderedData.find(d => d.tradeDay === daysOrder[dataIdx]);
          if (dayData) {
            orderedData[i] = {
              value: dayData.price,
              date: dayData.tradeDay
            };
          }
        }
        
        set({ stockData: orderedData, isLoading: false });
      }
    } catch (error) {
      set({ error: '데이터 로딩 실패', isLoading: false });
      console.error('Stock data fetch error:', error);
    }
  }
}));