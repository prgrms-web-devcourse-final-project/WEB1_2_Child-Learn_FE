import { baseApi } from '@/shared/api/base';
import { create } from 'zustand';
import { BeginQuiz } from '@/features/beginner_chart/model/types/quiz';

interface QuizStore {
 quizzes: BeginQuiz[];
 currentQuiz: BeginQuiz | null;
 selectedAnswer: string | null;
 isLoading: boolean;
 error: string | null;
 fetchQuizzes: () => Promise<void>;
 submitAnswer: (answer: string) => Promise<{ isCorrect: boolean; points?: number }>;
 setCurrentQuiz: (quiz: BeginQuiz) => void;
 setAnswer: (answer: string) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
}

interface QuizResponse {
 quiz: BeginQuiz[];
 isCorrect: boolean;
}

interface PointRequest {
 memberId: number;
 transactionType: 'BEGIN' | 'MID' | 'ADVANCE';
 points: number;
 pointType: 'STOCK';
 stockType: 'BEGIN';
 stockName: string;
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
     
     if (response.data.quiz && response.data.quiz.length > 0) {
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
     const quizResponse = await baseApi.post<QuizResponse>('/begin-stocks/submissions', { answer });
     set({ selectedAnswer: answer });

     if (quizResponse.data.isCorrect) {
       const pointRequest: PointRequest = {
         memberId: 1, // TODO: 실제 memberId로 교체 필요
         transactionType: 'BEGIN',
         points: 200,
         pointType: 'STOCK',
         stockType: 'BEGIN',
         stockName: '초급 주식'
       };

       await baseApi.post<PointResponse>(
         '/api/v1/wallet/invest', 
         pointRequest
       );

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
 },

 setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
 setAnswer: (answer) => set({ selectedAnswer: answer }),
 setLoading: (loading) => set({ isLoading: loading }),
 setError: (error) => set({ error })
}));