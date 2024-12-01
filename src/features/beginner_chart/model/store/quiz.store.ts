import { create } from 'zustand';
import { BeginQuiz } from '@/features/beginner_chart/model/types/quiz';
import axios from 'axios';

interface QuizStore {
  quizzes: BeginQuiz[];
  currentQuiz: BeginQuiz | null;
  selectedAnswer: string | null;
  isLoading: boolean;
  error: string | null;
  fetchQuizzes: () => Promise<void>;
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
      const token = localStorage.getItem('token');
      console.log('토큰:', token);

      const response = await axios.get('/api/v1/begin-stocks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('퀴즈 응답:', response.data);

      if (response.data.quiz && response.data.quiz.length > 0) {
        set({
          quizzes: response.data.quiz,
          currentQuiz: response.data.quiz[0],
          isLoading: false
        });
      }
    } catch (error: any) {
      console.log('에러 상세:', error.response);
      set({ error: '퀴즈 데이터 로딩 실패', isLoading: false });
    }
  },

  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  setAnswer: (answer) => set({ selectedAnswer: answer }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));