import { create } from 'zustand';
import { baseApi } from '@/shared/api/base';
import { BeginQuiz } from '../types/quiz';
import { StockType, TransactionType, WalletRequest, WalletResponse } from '../types/wallet';

interface QuizStore {
  quizzes: BeginQuiz[];
  currentQuiz: BeginQuiz | null;
  selectedAnswer: string | null;
  isLoading: boolean;
  error: string | null;
  fetchQuizzes: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<{ 
    isCorrect: boolean; 
    points: number;
    currentPoints?: number;
    currentCoins?: number;
  }>;
  updateWallet: (points: number) => Promise<WalletResponse>;
}

export const useQuizStore = create<QuizStore>((set) => ({
  quizzes: [],
  currentQuiz: null,
  selectedAnswer: null,
  isLoading: false,
  error: null,

  fetchQuizzes: async () => {
    try {
      set({ isLoading: true });
      const response = await baseApi.get('/begin-stocks');
      
      if (response.data.quiz?.[0]) {
        set({
          currentQuiz: response.data.quiz[0],
          isLoading: false
        });
      }
    } catch (error) {
      set({ error: '퀴즈 데이터 로딩 실패', isLoading: false });
      console.error('Quiz fetch error:', error);
    }
  },

  updateWallet: async (points: number) => {
    const walletRequest: WalletRequest = {
      memberId: Number(localStorage.getItem('memberId')), // memberId를 localStorage나 다른 상태 관리에서 가져옴
      transactionType: TransactionType.EARN,
      points: points,
      pointType: 'STOCK',
      stockType: StockType.BEGIN,
      stockName: '초급 주식 퀴즈' // 필요에 따라 수정
    };

    const response = await baseApi.post<WalletResponse>('/wallet/stock', walletRequest);
    return response.data;
  },

  submitAnswer: async (answer: string): Promise<{ 
    isCorrect: boolean; 
    points: number;
    currentPoints?: number;
    currentCoins?: number;
  }> => {
    try {
      const quizResponse = await baseApi.post('/begin-stocks/submissions', {
        answer
      });

      set({ selectedAnswer: answer });

      if (quizResponse.data.correct) {
        try {
          // 정답인 경우 포인트 적립
          const walletResponse = await useQuizStore.getState().updateWallet(100);
          
          return {
            isCorrect: true,
            points: 100,
            currentPoints: walletResponse.currentPoints,
            currentCoins: walletResponse.currentCoins
          };
        } catch (walletError) {
          console.error('Wallet update error:', walletError);
          return {
            isCorrect: true,
            points: 0
          };
        }
      }

      return {
        isCorrect: false,
        points: 0
      };
    } catch (error) {
      console.error('Answer submission error:', error);
      return {
        isCorrect: false,
        points: 0
      };
    }
  }
}));