import { create } from 'zustand';

interface FlipCardState {
    cards: {
        beginner: Array<{ cardTitle: string; cardContent: string; category: string }>;
        medium: Array<{ cardTitle: string; cardContent: string; category: string }>;
        advanced: Array<{ cardTitle: string; cardContent: string; category:                                string }>;
      };
      setCards: (level: 'beginner' | 'medium' | 'advanced', cards: Array<{ cardTitle: string; cardContent: string; category: string }>) => void;
  lastPlayed: { beginner: Date | null; medium: Date | null; advanced: Date | null };
  setLastPlayed: (level: 'beginner' | 'medium' | 'advanced', date: Date) => void;
  isPlayable: (level: 'beginner' | 'medium' | 'advanced') => boolean;
}

export const useFlipCardStore = create<FlipCardState>((set, get) => ({
    cards: { beginner: [], medium: [], advanced: [] },
  lastPlayed: { beginner: null, medium: null, advanced: null },
  setCards: (level, cards) => set((state) => ({ cards: { ...state.cards, [level]: cards } })),
  setLastPlayed: (level, date) => set((state) => ({ lastPlayed: { ...state.lastPlayed, [level]: date } })),
  isPlayable: (level) => {
    const lastPlayedDate = get().lastPlayed[level];
    if (!lastPlayedDate) return true;
    const now = new Date();
    return now.toDateString() !== lastPlayedDate.toDateString(); // 같은 날짜인지 확인
  },
}));
