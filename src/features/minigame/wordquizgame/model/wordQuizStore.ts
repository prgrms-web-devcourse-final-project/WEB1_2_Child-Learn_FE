import { create } from 'zustand';
import { Word } from '../types/wordTypes'; 

interface WordQuizState {
  difficulty: 'begin' | 'mid' | 'adv'; // 난이도
  lives: number; // 남은 목숨
  correctAnswers: number; // 맞춘 문제 수
  currentWord: Word | null; // 현재 문제
  currentPhase: number; // 현재 문제 단계 (currentPhase)
  setDifficulty: (difficulty: 'begin' | 'mid' | 'adv') => void; // 난이도 설정
  decrementLives: () => void; // 목숨 감소
  incrementCorrectAnswers: () => void; // 맞춘 문제 수 증가
  setCurrentWord: (word: Word | null) => void; // 현재 문제 설정
  setPhase: (phase: number) => void; // 단계 설정
  resetQuiz: () => void; // 퀴즈 초기화
  setLives: (lives: number) => void; // 목숨 설정
}

export const useWordQuizStore = create<WordQuizState>((set) => ({
  difficulty: 'begin',
  lives: 3,
  correctAnswers: 0,
  currentWord: null,
  currentPhase: 1, // 초기 단계는 1
  setDifficulty: (difficulty) => set({ difficulty }),
  decrementLives: () =>
    set((state) => ({
      lives: state.lives > 0 ? state.lives - 1 : 0,
    })),
  incrementCorrectAnswers: () =>
    set((state) => ({ correctAnswers: state.correctAnswers + 1 })),
  setCurrentWord: (word) => set({ currentWord: word }),
  setPhase: (phase) => set({ currentPhase: phase }),
  resetQuiz: () =>
    set({
      lives: 3,
      correctAnswers: 0,
      currentPhase: 1,
      currentWord: null,
    }),
  setLives: (lives) => set({ lives }),
}));

export default useWordQuizStore;
