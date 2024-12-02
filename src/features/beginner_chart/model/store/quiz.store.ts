import { create } from 'zustand';
import { BeginQuiz } from '../types/quiz';
import { baseApi } from '@/shared/api/base';

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

export const useQuizStore = create<QuizStore>((set) => ({
  quizzes: [],
  currentQuiz: null,
  selectedAnswer: null,
  isLoading: false,
  error: null,

  fetchQuizzes: async () => {
    try {
      set({ isLoading: true });
      const response = await baseApi.get('/begin-stocks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data.quiz && response.data.quiz.length > 0) {
        set({
          quizzes: response.data.quiz,
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
      await baseApi.post('/begin-stocks/submissions', 
        { answer },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      set({ selectedAnswer: answer });
      return Promise.resolve();
    } catch (error) {
      console.error('Answer submission error:', error);
      return Promise.reject(error);
    }
  },

  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  setAnswer: (answer) => set({ selectedAnswer: answer }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));