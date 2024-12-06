
// quiz.store.ts
import { create } from 'zustand';
import { baseApi } from '@/shared/api/base';
import { BeginQuiz } from '@/features/beginner_chart/model/types/quiz';

interface QuizStore {
  quizzes: BeginQuiz[];
  currentQuiz: BeginQuiz | null;
  selectedAnswer: string | null;
  isLoading: boolean;
  error: string | null;
  fetchQuizzes: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<{ isCorrect: boolean; points?: number }>;
}

interface QuizResponse {
  quiz: BeginQuiz[];
  isCorrect: boolean;
}

interface PointRequest {
  memberId: number;
  points: number;
  pointType: string;
  gameType: string;
  isWin: boolean;
}

interface PointResponse {
  memberId: number;
  currentPoints: number;
  currentCoins: number;
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

  submitAnswer: async (answer: string) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      const quizResponse = await baseApi.post<QuizResponse>('/begin-stocks/submissions', {
        memberId: parseInt(userId),
        answer: answer
      });

      set({ selectedAnswer: answer });

      if (quizResponse.data.isCorrect) {
     
        const pointRequest: PointRequest = {
          memberId: parseInt(userId),
          points: 200,
          pointType: "GAME",
          gameType: "OX_QUIZ",
          isWin: true
        };

        const pointResponse = await baseApi.post<PointResponse>('/wallet/game', pointRequest);

        return {
          isCorrect: true,
          points: 200
        };
      }

      return {
        isCorrect: false
      };
    } catch (error) {
      console.error('Answer submission error:', error);
      throw error;
    }
  }
}));