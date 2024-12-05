import { create } from 'zustand';

interface GameState {
  phase: 'BEFORE' | 'TRADING' | 'AFTER';
  isPlaying: boolean;
  elapsedTime: number;
  playedToday: boolean;
  advId?: number;
  memberId?: number;
}

interface StockPrice {
  price: number;
  timestamp: number;
}

interface AdvancedGameStore {
  gameState: GameState;
  stockPrices: Record<string, StockPrice[]>;
  setGameState: (state: Partial<GameState>) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

const WebSocketActions = {
  START_GAME: 'START_GAME',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME'
} as const;

// WebSocket 객체를 생성합니다.
const webSocket = new WebSocket('ws://3.35.242.1:8080');

export const useAdvancedGameStore = create<AdvancedGameStore>((set) => ({
  gameState: {
    phase: 'BEFORE',
    isPlaying: false,
    elapsedTime: 0,
    playedToday: false
  },
  stockPrices: {},

  setGameState: (state) => set(prev => ({
    gameState: { ...prev.gameState, ...state }
  })),

  startGame: () => {
    webSocket.send(WebSocketActions.START_GAME);
    set(state => ({
      gameState: { ...state.gameState, isPlaying: true, phase: 'TRADING' }
    }));
  },

  pauseGame: () => {
    webSocket.send(WebSocketActions.PAUSE_GAME);
    set(state => ({
      gameState: { ...state.gameState, isPlaying: false }
    }));
  },

  resumeGame: () => {
    webSocket.send(WebSocketActions.RESUME_GAME);
    set(state => ({
      gameState: { ...state.gameState, isPlaying: true }
    }));
  }
}));