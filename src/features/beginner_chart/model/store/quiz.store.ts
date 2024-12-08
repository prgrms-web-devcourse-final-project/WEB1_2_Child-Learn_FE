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

export const useQuizStore = create<QuizStore>((set, get) => ({
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
      const currentQuiz = get().currentQuiz;
      if (!currentQuiz) {
        throw new Error('퀴즈 데이터가 없습니다');
      }

      // 정답 체크 먼저 수행
      const isCorrect = answer === currentQuiz.answer;
      set({ selectedAnswer: answer });

      try {
        // 선택 제출
        await baseApi.post('/begin-stocks/submissions', {
          answer
        });

        // 정답인 경우에만 포인트 적립
        if (isCorrect) {
          const userId = Number(localStorage.getItem('userId'));
          if (userId) {
            await addStockPoints(userId);
          }
        }

        return {
          isCorrect,
          points: isCorrect ? 100 : 0
        };
      } catch (submitError) {
        console.error('Submission or points error:', submitError);
        // API 요청이 실패해도 사용자에게는 정답 결과는 보여줌
        return {
          isCorrect,
          points: 0
        };
      }
    } catch (error) {
      console.error('Answer process error:', error);
      return {
        isCorrect: false,
        points: 0
      };
    }
  }
}));