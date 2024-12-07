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

let websocket: WebSocket | null = null;

const initializeWebSocket = async () => {
  const token = getAuthToken(); // 토큰 가져오기 함수 구현 필요
  
  if (!token) {
    console.error('Authentication token not found');
    return null;
  }

  const url = `ws://43.202.106.45/api/v1/advanced-invest?authorization=Bearer ${token}`;

  if (!websocket || websocket.readyState === WebSocket.CLOSED) {
    websocket = new WebSocket(url);
    await new Promise(resolve => {
      websocket!.onopen = () => resolve(true);
    });
  }
  return websocket;
};

// 토큰 가져오기 함수
const getAuthToken = (): string | null => {
  try {
    // 세션 스토리지에서 먼저 확인
    let token = sessionStorage.getItem('accessToken');
    if (!token) {
      // 로컬 스토리지 확인
      token = localStorage.getItem('accessToken');
    }
    if (!token) {
      // 쿠키에서 확인
      const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];
      token = cookieToken || null;
    }
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

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

  startGame: async () => {
    const ws = await initializeWebSocket();
    if (ws) {
      ws.send(JSON.stringify({ action: WebSocketActions.START_GAME }));
      set(state => ({
        gameState: { ...state.gameState, isPlaying: true, phase: 'TRADING' }
      }));
    }
  },

  pauseGame: async () => {
    const ws = await initializeWebSocket();
    if (ws) {
      ws.send(JSON.stringify({ action: WebSocketActions.PAUSE_GAME }));
      set(state => ({
        gameState: { ...state.gameState, isPlaying: false }
      }));
    }
  },

  resumeGame: async () => {
    const ws = await initializeWebSocket();
    if (ws) {
      ws.send(JSON.stringify({ action: WebSocketActions.RESUME_GAME }));
      set(state => ({
        gameState: { ...state.gameState, isPlaying: true }
      }));
    }
  }
}));