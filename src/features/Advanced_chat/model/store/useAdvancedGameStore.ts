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
  websocket: WebSocket | null;
  setGameState: (state: Partial<GameState>) => void;
  initializeWebSocket: () => Promise<WebSocket | null>;
}

const getAuthToken = (): string | null => {
  try {
    const authStorageStr = localStorage.getItem('auth-storage');
    if (!authStorageStr) {
      console.error('No auth-storage found in localStorage');
      return null;
    }

    const authStorage = JSON.parse(authStorageStr);
    const token = authStorage?.state?.accessToken;
    
    if (!token) {
      console.error('No token found in auth-storage state');
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error parsing auth-storage:', error);
    return null;
  }
};

const getMemberId = (): number | null => {
  try {
    const authStorageStr = localStorage.getItem('auth-storage');
    if (!authStorageStr) {
      console.warn('No auth-storage found in localStorage');
      return null;
    }

    const authStorage = JSON.parse(authStorageStr);
    const memberId = authStorage?.state?.user?.id;
    
    if (!memberId) {
      console.warn('No memberId found in auth-storage state');
      return null;
    }

    return parseInt(memberId);
  } catch (error) {
    console.error('Error getting memberId:', error);
    return null;
  }
};

export const useAdvancedGameStore = create<AdvancedGameStore>((set, get) => ({
  gameState: {
    phase: 'BEFORE',
    isPlaying: false,
    elapsedTime: 0,
    playedToday: false
  },
  stockPrices: {},
  websocket: null,

  setGameState: (state) => set(prev => ({
    gameState: { ...prev.gameState, ...state }
  })),

  initializeWebSocket: async () => {
    const { websocket } = get();
    if (websocket?.readyState === WebSocket.OPEN) {
      return websocket;
    }

    const token = getAuthToken();
    const memberId = getMemberId();
    
    if (!token || !memberId) {
      console.error('Authentication token or memberId not found');
      return null;
    }

    const url = `ws://43.202.106.45/api/v1/advanced-invest?authorization=${encodeURIComponent(`Bearer ${token}`)}`;
    
    try {
      const ws = new WebSocket(url);
      
      await new Promise((resolve, reject) => {
        ws.onopen = () => {
          console.log('WebSocket Connected');
          // 연결 즉시 START_GAME 메시지 전송
          const message = {
            action: "START_GAME",
            memberId
          };
          console.log('Sending message:', message);
          ws.send(JSON.stringify(message));
          resolve(true);
        };

        ws.onmessage = (event) => {
          console.log('Received message:', event.data);
        };

        ws.onerror = (error) => {
          console.error('WebSocket Error:', error);
          reject(error);
        };

        ws.onclose = () => {
          console.log('WebSocket Disconnected');
          set({ websocket: null });
        };
      });

      set({ 
        websocket: ws,
        gameState: { 
          ...get().gameState, 
          isPlaying: true, 
          phase: 'TRADING',
          memberId
        }
      });
      
      return ws;
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      return null;
    }
  }
}));