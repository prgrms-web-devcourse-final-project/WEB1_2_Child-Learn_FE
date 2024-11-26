import { create } from 'zustand';
import { BeginQuiz } from '../types/quiz';

interface QuizStore {
  quizzes: BeginQuiz[];
  currentQuiz: BeginQuiz | null;
  selectedAnswer: string | null;
  isLoading: boolean;
  error: string | null;
  setQuizzes: (quizzes: BeginQuiz[]) => void;
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
  setQuizzes: (quizzes) => set({ quizzes }),
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  setAnswer: (answer) => set({ selectedAnswer: answer }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));