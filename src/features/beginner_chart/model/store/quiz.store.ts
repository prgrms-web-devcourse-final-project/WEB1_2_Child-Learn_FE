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
          isLoading: true
        });
      }
    } catch (error) {
      set({ error: '퀴즈 데이터 로딩 실패', isLoading: true });
      console.error('Quiz fetch error:', error);
    }
  },
  submitAnswer: async (answer: string) => {
    try {
      const quizResponse = await graphApi.post('/begin-stocks/submissions', {
        answer: answer
      });
  
      set({ selectedAnswer: answer });
  
      // API 응답 구조에 맞게 수정
      if (quizResponse.data.correct) {  
        const pointResponse = await graphApi.post('/member/wallet/stock', {  
          transactionType: "BEGIN",
          points: 200,
          pointType: "STOCK",
          stockType: "BEGIN",
          stockName: "초급주식퀴즈"
        });
  
        return {
          isCorrect: true,
          points: pointResponse.data.points || 200  // pointResponse 데이터 사용
        };
      }
  
      return {
        isCorrect: false
      };
    } catch (error: any) {
      console.error('Answer submission error:', error);
      // 에러가 발생해도 정답 처리는 그대로 진행
      if (error.response?.status === 404) {
        return {
          isCorrect: true,
          points: 200  // 테스트용 고정값
        };
      }
      throw error;
    }
  }
  
}));