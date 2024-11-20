import { create } from 'zustand';

interface OXQuizState {
  quizzes: Array<{ quizId: string; content: string; answer: boolean; difficulty: 'easy' | 'medium' | 'hard' }>;
  progress: Array<{ isCorrect: boolean; priority: 'LOW' | 'HIGH'; attemptDate: Date }>;
  setQuizzes: (quizzes: Array<{ quizId: string; content: string; answer: boolean; difficulty: 'easy' | 'medium' | 'hard' }>) => void;
  addProgress: (progress: { isCorrect: boolean; priority: 'LOW' | 'HIGH'; attemptDate: Date }) => void;
}

export const useOXQuizStore = create<OXQuizState>((set) => ({
  quizzes: [],
  progress: [],
  setQuizzes: (quizzes) => set({ quizzes }),
  addProgress: (progress) => set((state) => ({ progress: [...state.progress, progress] })),
}));
