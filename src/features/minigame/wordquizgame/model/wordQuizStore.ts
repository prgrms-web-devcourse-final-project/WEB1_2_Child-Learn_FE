import { create } from 'zustand';
import { Word } from '../types/wordTypes'; // Word 타입 import

interface WordQuizState {
  level: 'beginner' | 'medium' | 'advanced'; // 난이도
  memberId: number; // 회원 ID
  lives: number; // 남은 목숨
  lastPlayedDate: string | null; // 마지막 플레이 날짜
  correctAnswers: number; // 맞춘 문제 수
  words: Word[]; // 퀴즈 문제 리스트
  currentQuestionIndex: number; // 현재 문제 인덱스
  setLevel: (level: 'beginner' | 'medium' | 'advanced') => void; // 난이도 설정
  decrementLives: () => void; // 목숨 감소
  incrementCorrectAnswers: () => void; // 맞춘 문제 수 증가
  setWords: (words: Word[]) => void; // 퀴즈 문제 설정
  nextQuestion: () => void; // 다음 문제로 이동
  resetQuiz: () => void; // 퀴즈 초기화
  initializeQuiz: (memberId: number, lastPlayedDate: string | null, lives: number) => void; // 퀴즈 상태 초기화
}

export const useWordQuizStore = create<WordQuizState>((set) => ({
  level: 'beginner', // 기본 난이도
  memberId: 0, // 기본 회원 ID
  lives: 3, // 기본 목숨
  lastPlayedDate: null, // 마지막 플레이 날짜
  correctAnswers: 0, // 맞춘 문제 수
  words: [], // 기본 퀴즈 문제 리스트
  currentQuestionIndex: 0, // 기본 문제 인덱스
  setLevel: (level) => set({ level }), // level 업데이트
  decrementLives: () =>
    set((state) => ({
      lives: state.lives > 0 ? state.lives - 1 : 0,
    })),
  incrementCorrectAnswers: () =>
    set((state) => ({ correctAnswers: state.correctAnswers + 1 })),
  setWords: (words) => set({ words }), // 문제 리스트 설정
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),
  resetQuiz: () =>
    set({
      lives: 3,
      correctAnswers: 0,
      currentQuestionIndex: 0,
      words: [],
    }),
  initializeQuiz: (memberId, lastPlayedDate, lives) =>
    set({
      memberId,
      lastPlayedDate,
      lives,
    }),
}));

export default useWordQuizStore;
