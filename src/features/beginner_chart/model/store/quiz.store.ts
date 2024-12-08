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
// quiz.store.ts
submitAnswer: async (answer: string) => {
  try {
    const quizResponse = await baseApi.post('/begin-stocks/submissions', {
      answer  // 단순화된 요청
    });

    set({ selectedAnswer: answer });

    if (quizResponse.data.correct) {  // 'correct' 키로 변경
      // 포인트 적립 요청 수정
      await baseApi.post('/wallet/stock', {
        points: 100,
        pointType: "STOCK",
        stockType: "BEGIN",
        isWin: true
      });

      return {
        isCorrect: true,
        points: 100 // 고정값 사용
      };
    }

    return {
      isCorrect: false
    };
  } catch (error) {
    console.error('Answer submission error:', error);
    // 에러를 throw하지 않고 기본값 반환
    return {
      isCorrect: false
    };
    }
  }
}));
