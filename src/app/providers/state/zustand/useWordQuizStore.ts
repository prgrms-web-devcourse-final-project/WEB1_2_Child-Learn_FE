import { create } from 'zustand';

interface WordQuizState {
  words: {
    beginner: Array<{ word: string; explanation: string; hint: string; difficulty: 'beginner' }>;
    medium: Array<{ word: string; explanation: string; hint: string; difficulty: 'medium' }>;
    advanced: Array<{ word: string; explanation: string; hint: string; difficulty: 'advanced' }>;
  };
  lastPlayed: { beginner: Date | null; medium: Date | null; advanced: Date | null };
  setWords: (
    level: 'beginner' | 'medium' | 'advanced',
    words: Array<{ word: string; explanation: string; hint: string; difficulty: 'beginner' | 'medium' | 'advanced' }>
  ) => void;
  setLastPlayed: (level: 'beginner' | 'medium' | 'advanced', date: Date) => void;
  isPlayable: (level: 'beginner' | 'medium' | 'advanced') => boolean;
}

export const useWordQuizStore = create<WordQuizState>((set, get) => ({
  words: { beginner: [], medium: [], advanced: [] },
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
