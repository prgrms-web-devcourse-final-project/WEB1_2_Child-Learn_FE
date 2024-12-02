import { create } from 'zustand';
import { baseApi } from '@/shared/api/base';
import { BeginStock, BeginStockResponse } from '../types/stock';
import { FastGraphData } from '../types/graph';

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
      // 토큰 키를 'jwt'로 변경
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('인증 토큰이 없습니다');
      }

      const response = await baseApi.get<BeginStockResponse>('/begin-stocks', {
        headers: {
          Authorization: `Bearer ${token}`
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