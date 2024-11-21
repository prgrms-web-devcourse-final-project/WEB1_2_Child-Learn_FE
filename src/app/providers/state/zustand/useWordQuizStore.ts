import { create } from 'zustand';

interface WordQuizState {
  words: Array<{ word: string; explanation: string; hint: string }>;
  lastPlayed: { beginner: Date | null; medium: Date | null; advanced: Date | null };
  setWords: (
    level: 'beginner' | 'medium' | 'advanced',
    words: Array<{ word: string; explanation: string; hint: string }>
  ) => void;
  setLastPlayed: (level: 'beginner' | 'medium' | 'advanced', date: Date) => void;
  isPlayable: (level: 'beginner' | 'medium' | 'advanced') => boolean;
}

export const useWordQuizStore = create<WordQuizState>((set, get) => ({
  words: [],
  lastPlayed: { beginner: null, medium: null, advanced: null },
  setWords: (level, words) =>
    set((state) => ({
      words: { ...state.words, [level]: words },
    })),
  setLastPlayed: (level, date) =>
    set((state) => ({
      lastPlayed: { ...state.lastPlayed, [level]: date },
    })),
  isPlayable: (level) => {
    const lastPlayedDate = get().lastPlayed[level];
    if (!lastPlayedDate) return true;
    const now = new Date();
    return now.toDateString() !== lastPlayedDate.toDateString(); // 같은 날짜인지 확인
  },
}));
