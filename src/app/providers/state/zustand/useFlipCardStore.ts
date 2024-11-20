import { create } from 'zustand';

interface FlipCardState {
  cards: Array<{ cardId: string; cardTitle: string; cardContent: string; category: string }>;
  lastPlayed: { beginner: Date | null; medium: Date | null; advanced: Date | null };
  setCards: (cards: Array<{ cardId: string; cardTitle: string; cardContent: string; category: string }>) => void;
  setLastPlayed: (level: 'beginner' | 'medium' | 'advanced', date: Date) => void;
}

export const useFlipCardStore = create<FlipCardState>((set) => ({
  cards: [],
  lastPlayed: { beginner: null, medium: null, advanced: null },
  setCards: (cards) => set({ cards }),
  setLastPlayed: (level, date) => set((state) => ({ lastPlayed: { ...state.lastPlayed, [level]: date } })),
}));
