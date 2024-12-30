// features/beginner_chart/model/store/quiz.store.ts
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

export const useQuizStore = create<QuizStore>((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  selectedAnswer: null,
  isLoading: false,
  error: null,

  fetchQuizzes: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await baseApi.get('/begin-stocks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const { quiz } = response.data;
      if (quiz?.[0]) {
        set({
          quizzes: quiz,
          currentQuiz: quiz[0],
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
          error: '퀴즈 데이터가 비어 있습니다.',
        });
      }
    } catch (error: unknown) {
      set({
        isLoading: false,
        error: 
          typeof error === 'object' && error !== null && 'data' in error
            ? (error.data as { message: string }).message 
            : '퀴즈 데이터 로딩 실패',
      });
      console.error('Quiz fetch error:', error);
    }
  },

  submitAnswer: async (answer: string) => {
    const currentQuiz = get().currentQuiz;
    if (!currentQuiz) {
      set({ error: '퀴즈 데이터가 없습니다' });
      return { isCorrect: false, points: 0 };
    }

    const isCorrect = answer === currentQuiz.answer;
    set({ selectedAnswer: answer });

    try {
      const submitResponse = await baseApi.post(
        '/begin-stocks/submissions',
        { answer },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (isCorrect) {
        const memberId = Number(localStorage.getItem('memberId'));
        const points = await updateUserPoints(100, memberId);
        return { isCorrect: true, points };
      }

      return { isCorrect: false, points: 0 };
    } catch (error) {
      console.error('Submission error:', error);
      set({ error: '정답 제출 중 오류가 발생했습니다.' });
      return { isCorrect: false, points: 0 };
    }
  },
}));

const updateUserPoints = async (additionalPoints: number, memberId: number): Promise<number> => {
  try {
    const response = await baseApi.post(
      '/wallet/stock',
      {
        memberId,
        transactionType: 'ADD',
        points: additionalPoints,
        pointType: 'STOCK',
        stockType: 'BONUS',
        stockName: 'QUIZ_REWARD',
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.currentPoints;
  } catch (error) {
    console.error('포인트 업데이트 실패:', error);
    return 0;
  }
};