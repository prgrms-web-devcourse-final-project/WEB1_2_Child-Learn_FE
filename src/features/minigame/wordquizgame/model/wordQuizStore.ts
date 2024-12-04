import { create } from 'zustand';
import { Word } from '../types/wordTypes'; 

interface WordQuizState {
  difficulty: 'begin' | 'mid' | 'adv'; // 난이도
  memberId: number; // 회원 ID
  lives: number; // 남은 목숨
  lastPlayedDates: Record<'begin' | 'mid' | 'adv', string | null>; // 난이도별 마지막 플레이 날짜
  correctAnswers: number; // 맞춘 문제 수
  words: Word[]; // 퀴즈 문제 리스트
  currentQuestionIndex: number; // 현재 문제 인덱스
  setDifficulty: (difficulty: 'begin' | 'mid' | 'adv') => void; // 난이도 설정
  decrementLives: () => void; // 목숨 감소
  incrementCorrectAnswers: () => void; // 맞춘 문제 수 증가
  setWords: (words: Word[]) => void; // 퀴즈 문제 설정
  nextQuestion: () => void; // 다음 문제로 이동
  resetQuiz: () => void; // 퀴즈 초기화
  initializeQuiz: (memberId: number) => void; // 퀴즈 상태 초기화
  isPlayable: (difficulty: 'begin' | 'mid' | 'adv') => boolean; // 플레이 가능 여부 확인
  setLastPlayedDate: (difficulty: 'begin' | 'mid' | 'adv', date: string) => void; // 마지막 플레이 날짜 설정
}

export const useWordQuizStore = create<WordQuizState>((set, get) => ({
  difficulty: 'begin', // 기본 난이도
  memberId: 0, // 기본 회원 ID
  lives: 3, // 기본 목숨
  lastPlayedDates: {
    begin: null,
    mid: null,
    adv: null,
  },
  correctAnswers: 0, // 맞춘 문제 수
  words: [], // 기본 퀴즈 문제 리스트
  currentQuestionIndex: 0, // 기본 문제 인덱스
  setDifficulty: (difficulty) => set({ difficulty }), // level 업데이트
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
  initializeQuiz: (memberId) =>
    set({
      memberId,
    }),
  isPlayable: (difficulty) => {
    const lastPlayed = get().lastPlayedDates[difficulty];
    if (!lastPlayed) return true; // 이전에 플레이한 기록이 없으면 플레이 가능

    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD)
    return lastPlayed !== today; // 오늘 플레이한 기록이 있으면 false
  },
  setLastPlayedDate: (difficulty, date) =>
    set((state) => ({
      lastPlayedDates: { ...state.lastPlayedDates, [difficulty]: date },
    })),
}));

export default useWordQuizStore;
