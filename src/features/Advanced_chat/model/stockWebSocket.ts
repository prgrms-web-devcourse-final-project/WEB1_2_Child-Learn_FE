import SockJS from 'sockjs-client';

export enum GameWebSocketActions {
  START_GAME = 'START_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  END_GAME = 'END_GAME',
  GET_REMAINING_TIME = 'GET_REMAINING_TIME'
}

export enum DataWebSocketActions {
  REFERENCE_DATA = 'REFERENCE_DATA',
  LIVE_DATA = 'LIVE_DATA'
}

type WebSocketActions = GameWebSocketActions | DataWebSocketActions;

interface WebSocketRequest {
  action: WebSocketActions;
  advId?: number;
  memberId?: number;
}

interface WebSocketMessage {
  type: string;
  data: any;
}

export class StockWebSocket {
  private sockjs: any;
  private messageHandler?: (message: WebSocketMessage) => void;

  constructor() {
    const baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
    this.sockjs = new SockJS(`${baseUrl}/ws/advanced-invest`);
    this.setupMessageHandler();
  }

  private setupMessageHandler() {
    this.sockjs.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as WebSocketMessage;
      this.messageHandler?.(message);
    };
  }

  onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandler = handler;
  }

  sendMessage(action: WebSocketActions, payload: Partial<WebSocketMessage> = {}) {
    if (this.sockjs.readyState === SockJS.OPEN) {
      this.sockjs.send(JSON.stringify({ action, ...payload }));
    }
  }

  disconnect() {
    this.sockjs?.close();
  }
}

export const webSocket = new StockWebSocket();