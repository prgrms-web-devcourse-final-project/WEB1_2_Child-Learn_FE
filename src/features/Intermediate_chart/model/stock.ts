import { create } from 'zustand';
import axios from 'axios';
import { baseApi } from '@/shared/api/base';
import { MidStock, StockPrice, TradeDetail, StockWithDetails, TradeAvailability, TradeResponse } from '@/features/Intermediate_chart/model/types/stock';

export interface WalletTransactionRequest {
  memberId: number;  
  transactionType: 'BEGIN' | 'MID' | 'ADDVANCE';
  points: number;
  pointType: 'STOCK';
  stockType: 'BEGIN' | 'MID' | 'ADDVANCE';
  stockName: string;
}

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
  executeTrade: (stockId: number, tradePoint: number, type: 'buy' | 'sell', stockName: string, memberId: number) => Promise<TradeResponse>;  // memberId 파라미터 추가
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
      set({ tradeAvailability: {
        isPossibleBuy: true,
        isPossibleSell: true  
      }});
      console.log('Trade availability response:', response.data); // 응답 확인용
    } catch (error) {
      console.error('Trade availability check error:', error);
      // 에러 시에도 매도 가능하도록
      set({ tradeAvailability: {
        isPossibleBuy: true,
        isPossibleSell: true
      }});
    }
  },

  executeTrade: async (stockId: number, tradePoint: number, type: 'buy' | 'sell', stockName: string, memberId: number) => {
    try {
      if (type === 'buy') {
        // 매수 로직은 동일하게 유지
        const tradeResponse = await baseApi.post<TradeResponse>(`/mid-stocks/${stockId}/buy`, {
          tradePoint: Number(tradePoint)
        });

        try {
          const walletResponse = await baseApi.post<WalletResponse>('/wallet/stock', {
            memberId,
            transactionType: 'MID',
            points: -tradePoint,
            pointType: 'STOCK',
            stockType: 'MID',
            stockName: stockName
          });
          
          console.log('매수 지갑 업데이트 응답:', walletResponse.data);
        } catch (walletError) {
          console.error('매수 지갑 업데이트 실패:', walletError);
          throw new Error('지갑 업데이트에 실패했습니다.');
        }

        await get().checkTradeAvailability(stockId);
        return tradeResponse.data;

      } else {
        // 매도 로직 수정
        console.log('매도 요청:', { stockId, tradePoint });
        
        const tradeResponse = await baseApi.post<TradeResponse>(`/mid-stocks/${stockId}/sell`, {
          tradePoint: Number(tradePoint)  // 매도 시에도 tradePoint 전달
        });

        console.log('매도 응답:', tradeResponse.data);

        // earnedPoints가 0이어도 지갑 업데이트 실행
        const earnedPoints = tradeResponse.data.earnedPoints ?? tradePoint;
        
        try {
          const walletResponse = await baseApi.post<WalletResponse>('/wallet/stock', {
            memberId,
            transactionType: 'MID',
            points: earnedPoints, 
            pointType: 'STOCK',
            stockType: 'MID',
            stockName: stockName
          });
          
          console.log('매도 지갑 업데이트 응답:', walletResponse.data);
        } catch (walletError) {
          console.error('매도 지갑 업데이트 실패:', walletError);
          throw new Error('지갑 업데이트에 실패했습니다.');
        }

        await get().checkTradeAvailability(stockId);
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
  }
}));