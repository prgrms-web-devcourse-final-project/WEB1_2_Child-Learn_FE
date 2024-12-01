
import { create } from 'zustand';
import { GameState } from '../../types/game';
import { Stock, StockPrice } from '../../types/stock';

interface AdvancedGameStore {
  gameState: GameState;
  selectedStock: Stock | null;
  stockPrices: Record<string, StockPrice[]>;
  isLoading: boolean;
  error: string | null;

  // actions
  setGameState: (state: Partial<GameState>) => void;
  setSelectedStock: (stock: Stock | null) => void;
  setStockPrices: (symbol: string, prices: StockPrice[]) => void;
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
}

export const useAdvancedGameStore = create<AdvancedGameStore>((set) => ({
  gameState: {
    phase: 'BEFORE',
    isPlaying: false,
    elapsedTime: 0,
    playedToday: false
  },
  selectedStock: null,
  stockPrices: {},
  isLoading: false,
  error: null,

  setGameState: (state) => 
    set((prev) => ({ 
      gameState: { ...prev.gameState, ...state } 
    })),

  setSelectedStock: (stock) => set({ selectedStock: stock }),
  
  setStockPrices: (symbol, prices) =>
    set((prev) => ({
      stockPrices: { ...prev.stockPrices, [symbol]: prices }
    })),

  startGame: () => set((prev: AdvancedGameStore) => ({
    gameState: { ...prev.gameState, isPlaying: true, phase: 'TRADING' }
  })),

  pauseGame: () => set((prev) => ({
    gameState: { ...prev.gameState, isPlaying: false }
  })),

  resetGame: () => set(() => ({
    gameState: {
      phase: 'BEFORE',
      isPlaying: false,
      elapsedTime: 0,
      playedToday: true
    }
  }))
}));