import { create } from 'zustand';
import { baseApi } from '@/shared/api/base';
import { BeginQuiz } from '@/features/beginner_chart/model/types/quiz';
import { addStockPoints } from '@/features/beginner_chart/model/types/wallet';

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
      await baseApi.post('/begin-stocks/submissions', {
        answer
      });

      set({ selectedAnswer: answer });

      // 정답일 경우 (currentQuiz의 answer와 비교)
      if (answer === useQuizStore.getState().currentQuiz?.answer) {
        try {
          // 포인트 적립
          const userId = Number(localStorage.getItem('userId')); // 또는 다른 방식으로 userId 가져오기
          await addStockPoints(userId);
          
          return {
            isCorrect: true,
            points: 100
          };
        } catch (error) {
          console.error('Points allocation error:', error);
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