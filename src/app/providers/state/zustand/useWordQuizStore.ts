import { create } from 'zustand';

interface WordQuizState {
  words: Array<{ wordId: string; word: string; explanation: string; hint: string; difficulty: 'easy' | 'medium' | 'hard' }>;
  lastPlayed: Date | null;
  setWords: (words: Array<{ wordId: string; word: string; explanation: string; hint: string; difficulty: 'easy' | 'medium' | 'hard' }>) => void;
  setLastPlayed: (date: Date) => void;
}

export const useWordQuizStore = create<WordQuizState>((set) => ({
  words: [],
  lastPlayed: null,
  setWords: (words) => set({ words }),
  setLastPlayed: (date) => set({ lastPlayed: date }),
}));
