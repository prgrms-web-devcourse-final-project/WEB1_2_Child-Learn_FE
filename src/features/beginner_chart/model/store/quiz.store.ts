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
 submitAnswer: (answer: string) => Promise<void>;
 setCurrentQuiz: (quiz: BeginQuiz) => void;
 setAnswer: (answer: string) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
}

interface QuizResponse {
 points?: number;
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
     await baseApi.post<QuizResponse>('/begin-stocks/submissions', { answer });
     set({ selectedAnswer: answer });
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