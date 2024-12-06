
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

      // Submit quiz answer
      const quizResponse = await baseApi.post('/begin-stocks/submissions', { answer });

      set({ selectedAnswer: answer });

      if (quizResponse.data.isCorrect) {
        // Submit points if answer is correct
        const pointRequest = {
          memberId: userId ? parseInt(userId) : 0,
          points: 200,
          pointType: "GAME",
          gameType: "OX_QUIZ",
          isWin: true
        };

        await baseApi.post('/wallet/game', pointRequest);

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