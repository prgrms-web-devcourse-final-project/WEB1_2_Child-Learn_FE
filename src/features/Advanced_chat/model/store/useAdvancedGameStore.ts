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
 startGame: () => void;
 pauseGame: () => void;
 resumeGame: () => void;
}

const WebSocketActions = {
 START_GAME: 'START_GAME', 
 PAUSE_GAME: 'PAUSE_GAME',
 RESUME_GAME: 'RESUME_GAME'
} as const;

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

export const useAdvancedGameStore = create<AdvancedGameStore>((set, get) => ({
 gameState: {
   phase: 'BEFORE',
   isPlaying: false,
   elapsedTime: 0,
   playedToday: false
 },
 stockPrices: {},
 websocket: null,

 initializeWebSocket: async () => {
   const { websocket } = get();
   if (websocket?.readyState === WebSocket.OPEN) {
     return websocket;
   }

   const token = getAuthToken();
   if (!token) {
     console.error('Authentication token not found');
     return null;
   }

   const url = `ws://43.202.106.45/api/v1/advanced-invest?authorization=${encodeURIComponent(`Bearer ${token}`)}`;

   try {
     const ws = new WebSocket(url);
     await new Promise((resolve, reject) => {
       ws.onopen = () => {
         console.log('WebSocket Connected');
         resolve(true);
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

     set({ websocket: ws });
     return ws;
   } catch (error) {
     console.error('Failed to initialize WebSocket:', error);
     return null;
   }
 },

 setGameState: (state) => set(prev => ({
   gameState: { ...prev.gameState, ...state }
 })),

 startGame: async () => {
   const ws = await get().initializeWebSocket();
   if (ws) {
     ws.send(JSON.stringify({ action: WebSocketActions.START_GAME }));
     set(state => ({
       gameState: { ...state.gameState, isPlaying: true, phase: 'TRADING' }
     }));
   }
 },

 pauseGame: async () => {
   const ws = await get().initializeWebSocket();
   if (ws) {
     ws.send(JSON.stringify({ action: WebSocketActions.PAUSE_GAME }));
     set(state => ({
       gameState: { ...state.gameState, isPlaying: false }
     }));
   }
 },

 resumeGame: async () => {
   const ws = await get().initializeWebSocket();
   if (ws) {
     ws.send(JSON.stringify({ action: WebSocketActions.RESUME_GAME }));
     set(state => ({
       gameState: { ...state.gameState, isPlaying: true }
     }));
   }
 }
}));