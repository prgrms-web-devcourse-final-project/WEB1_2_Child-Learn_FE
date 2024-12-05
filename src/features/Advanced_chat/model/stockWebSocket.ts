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

export type WebSocketActions = GameWebSocketActions | DataWebSocketActions;

export interface WebSocketMessage {
  type: DataWebSocketActions;
  data?: {
    symbol: string;
    timestamp: number;
    closePrice: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    change?: number;
    volume?: number;
  };
}

export class StockWebSocket {
  // WebSocket 설정을 클래스 상수로 정의
  private static readonly BASE_URL = 'ws://3.35.242.1:8080';
  private static readonly WS_PATH = '/ws/advanced-invest';
  
  private ws: WebSocket | null = null;
  private messageHandler?: (message: WebSocketMessage) => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.connect(this.getWebSocketUrl());
  }

  private getWebSocketUrl(): string {
    return `${StockWebSocket.BASE_URL}${StockWebSocket.WS_PATH}`;
  }

  private connect(url: string) {
    try {
      console.log('Connecting to WebSocket:', url);
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('WebSocket Connected successfully');
        this.reconnectAttempts = 0;
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.handleClose();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      this.setupMessageHandler();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private setupMessageHandler() {
    if (!this.ws) return;

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        this.messageHandler?.(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
  }

  private handleClose() {
    console.log('WebSocket connection closed');
    this.handleReconnect();
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect(this.getWebSocketUrl()); // 동일한 URL 사용
      }, timeout);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandler = handler;
  }

  sendMessage(action: WebSocketActions, payload = {}) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action, ...payload }));
    } else {
      console.warn('WebSocket is not open, current state:', this.ws?.readyState);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const webSocket = new StockWebSocket();