import { create } from 'zustand';
import axios from 'axios';
import { BeginStock, BeginStockResponse } from '@/features/beginner_chart/model/types/stock';
import { FastGraphData } from '@/features/beginner_chart/model/types/graph';
import { Quiz } from '@/features/beginner_chart/model/types/stock';

interface GraphStore {
  stockData: FastGraphData[];
  quiz: Quiz[];
  isLoading: boolean;
  error: string | null;
  fetchStockData: () => Promise<void>;
}

export const useGraphStore = create<GraphStore>((set) => ({
  stockData: [],
  quiz: [],
  isLoading: false,
  error: null,
  fetchStockData: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ error: '로그인이 필요합니다', isLoading: false });
        return;
      }

      set({ isLoading: true });
      const response = await axios.get<BeginStockResponse>('/api/v1/begin-stocks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        const formattedData: FastGraphData[] = response.data.stockData.map(stock => ({
          value: stock.price,
          date: stock.trade_day
        }));
        set({ 
          stockData: formattedData, 
          quiz: response.data.quiz,
          isLoading: false 
        });
      }
    } catch (error: any) {
      console.log('에러 상세:', error.response);
      set({ error: '데이터 로딩 실패', isLoading: false });
    }
  }
}));