// quiz.store.ts
import { create } from 'zustand';
import { graphApi } from '@/features/beginner_chart/model/api/graph.api'; // graphApi 가져오기
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
      const response = await graphApi.get('/begin-stocks');
      
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
      // 1. 퀴즈 답변 제출
      const quizResponse = await graphApi.post('/begin-stocks/submissions', {
        answer: answer
      });

      set({ selectedAnswer: answer });

      if (quizResponse.data.isCorrect) {
        // 2. 정답인 경우 포인트 적립 요청
        const pointResponse = await graphApi.post('/wallet/stock', {
          transactionType: "BEGIN",
          points: 200, // 고정 포인트값
          pointType: "STOCK",
          stockType: "BEGIN",
          stockName: "초급주식퀴즈"
        });

        // 3. 포인트 적립 성공시 결과 반환
        return {
          isCorrect: true,
          points: pointResponse.data.currentPoints
        };
      }

      // 오답인 경우
      return {
        isCorrect: false
      };

    } catch (error) {
      console.error('Answer submission error:', error);
      throw error;
    }
  }
}));