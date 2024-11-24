import { create } from 'zustand';

interface WordQuizState {
  totalQuestions: number; // 총 문제 수
  correctAnswers: number; // 맞춘 문제 수
  lives: number; // 남은 목숨
  setTotalQuestions: (count: number) => void;
  incrementCorrectAnswers: () => void;
  decrementLives: () => void;
  resetQuiz: () => void;
}

const useWordQuizStore = create<WordQuizState>((set) => ({
  totalQuestions: 3, // 기본값: 3문제
  correctAnswers: 0, // 기본값: 0개 맞춤
  lives: 3, // 기본 목숨
  setTotalQuestions: (count) => set({ totalQuestions: count }),
  incrementCorrectAnswers: () =>
    set((state) => ({ correctAnswers: state.correctAnswers + 1 })),
  decrementLives: () =>
    set((state) => ({
      lives: state.lives > 0 ? state.lives - 1 : 0,
    })),
  resetQuiz: () =>
    set({
      correctAnswers: 0,
      lives: 3,
    }), // 맞춘 문제 및 목숨 초기화
}));

export default useWordQuizStore;
