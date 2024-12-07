import { baseApi } from '@/shared/api/base';

// WebSocket connection
let ws: WebSocket | null = null;

// Interfaces
interface ReferenceData {
  [key: string]: any;  // Concrete structure to be defined based on actual data
}

interface LiveData {
  [key: string]: any;  // Concrete structure to be defined based on actual data
}

interface TradeHistory {
  tradeId: number;
  stockSymbol: string;
  tradeType: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  tradeDate: string;
}

interface StockQuantity {
  stockSymbol: string;
  quantity: number;
}

interface StockQuantities {
  [symbol: string]: number;
}

// WebSocket message types
interface WSMessage {
  action: string;
  [key: string]: any;
}

// Stock API implementation
export const stockApi = {
  // WebSocket Methods
  connectWebSocket: (token: string) => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      // URL에 Authorization 파라미터로 토큰 전달
      const wsUrl = new URL(`${process.env.WS_BASE_URL}/api/v1/advanced-invest`);
      wsUrl.searchParams.append('Authorization', `Bearer ${token}`);
      
      ws = new WebSocket(wsUrl.toString());
      
      ws.onopen = () => {
        console.log('WebSocket Connected');
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      // 연결 실패 시 재연결 로직 추가
      ws.addEventListener('close', (event) => {
        if (event.code === 1006) {
          console.log('Abnormal closure, attempting to reconnect...');
          setTimeout(() => stockApi.connectWebSocket(token), 3000);
        }
      });
    }
    return ws;
  },

  // Game Control Methods
  startGame: (memberId: number) => {
    const message: WSMessage = {
      action: 'START_GAME',
      memberId
    };
    ws?.send(JSON.stringify(message));
  },

  pauseGame: (advId: number) => {
    const message: WSMessage = {
      action: 'PAUSE_GAME',
      advId
    };
    ws?.send(JSON.stringify(message));
  },

  resumeGame: (advId: number) => {
    const message: WSMessage = {
      action: 'RESUME_GAME',
      advId
    };
    ws?.send(JSON.stringify(message));
  },

  endGame: (advId: number) => {
    const message: WSMessage = {
      action: 'END_GAME',
      advId
    };
    ws?.send(JSON.stringify(message));
  },

  // Trading Methods
  buyStock: (advId: number, stockSymbol: string, quantity: number, memberId: number) => {
    const message: WSMessage = {
      action: 'BUY_STOCK',
      advId,
      stockSymbol,
      quantity,
      memberId
    };
    ws?.send(JSON.stringify(message));
  },

  sellStock: (advId: number, stockSymbol: string, quantity: number, memberId: number) => {
    const message: WSMessage = {
      action: 'SELL_STOCK',
      advId,
      stockSymbol,
      quantity,
      memberId
    };
    ws?.send(JSON.stringify(message));
  },

  // Volume and Time Methods
  getVolumes: (advId: number, stockSymbol: string) => {
    const message: WSMessage = {
      action: 'GET_VOLUMES',
      advId,
      stockSymbol
    };
    ws?.send(JSON.stringify(message));
  },

  getRemainingTime: (advId: number) => {
    const message: WSMessage = {
      action: 'GET_REMAINING_TIME',
      advId
    };
    ws?.send(JSON.stringify(message));
  },

  // REST API Methods
  getReferenceData: async (): Promise<ReferenceData> => {
    const response = await baseApi.get('/advanced-invest/reference');
    return response.data;
  },

  getLiveData: async (): Promise<LiveData> => {
    const response = await baseApi.get('/advanced-invest/live');
    return response.data;
  },

  getTradeHistory: async (memberId: number): Promise<TradeHistory[]> => {
    const response = await baseApi.get(`/advanced-invest/${memberId}`);
    return response.data;
  },

  getStockQuantity: async (memberId: number, stockSymbol: string): Promise<StockQuantity> => {
    const response = await baseApi.get(`/advanced-invest/${memberId}/${stockSymbol}/quantity`);
    return response.data;
  },

  getAllStockQuantities: async (memberId: number): Promise<StockQuantities> => {
    const response = await baseApi.get(`/advanced-invest/${memberId}/quantities`);
    return response.data;
  },

  triggerScheduler: async (): Promise<void> => {
    await baseApi.post('/advanced-invest/trigger-scheduler');
  }
};

export default stockApi;