import { generateUUID } from '@/features/Advanced_chat/utils/uuid';

export enum WebSocketActions {
  START_GAME = 'START_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  END_GAME = 'END_GAME',
  REFERENCE_DATA = 'REFERENCE_DATA',
  LIVE_DATA = 'LIVE_DATA'
}

export interface Stock {
  id: number;
  symbol: string;
  title: string;
}

export interface WebSocketMessage {
  type: WebSocketActions;
  data?: {
    symbol: string;
    timestamp: number;
    closePrice: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    change?: number;
    volume?: number;
    stocks?: Stock[];
  };
  action?: WebSocketActions;
  connectionId?: string;
}

export interface WebSocketResponse {
  message?: string;
  type: WebSocketActions;
  data?: {
    stocks?: Stock[];
    gameStart?: boolean;
    gamePause?: boolean;
    gameEnd?: boolean;
    remainingTime?: number;
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
  private static instance: StockWebSocket | null = null;
  private ws: WebSocket | null = null;
  private messageHandler?: (message: WebSocketMessage) => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private connectionId: string;
  private connectionStatus: 'connecting' | 'connected' | 'disconnected' = 'disconnected';
  private static readonly BASE_URL = 'ws://43.202.106.45';
  private static readonly WS_PATH = '/api/v1/advanced-invest';
  private maxWaitTime = 30000;
  private checkInterval = 1000;

  private constructor() {
    this.connectionId = generateUUID();
    console.log('New WebSocket connection created with ID:', this.connectionId);
  }

  public static getInstance(): StockWebSocket {
    if (!StockWebSocket.instance) {
      StockWebSocket.instance = new StockWebSocket();
    }
    return StockWebSocket.instance;
  }

  private getToken(): string | null {
    // 1. localStorage 확인
    const localToken = localStorage.getItem('accessToken');
    if (localToken) {
      console.log('Token found in localStorage');
      return localToken;
    }

    // 2. sessionStorage 확인
    const sessionToken = sessionStorage.getItem('accessToken');
    if (sessionToken) {
      console.log('Token found in sessionStorage');
      return sessionToken;
    }

    // 3. Redux store 확인 (fallback)
    try {
      const store = (window as any).store;
      const state = store?.getState?.();
      const token = state?.state?.accessToken;
      if (token) {
        console.log('Token found in Redux store');
        return token;
      }
    } catch (error) {
      console.warn('Redux store access failed:', error);
    }

    console.error('JWT 토큰이 없습니다. 인증이 필요합니다.');
    return null;
  }

  private async waitForToken(): Promise<string | null> {
    console.log('Starting token wait cycle...');
    const startTime = Date.now();

    while (Date.now() - startTime < this.maxWaitTime) {
      const token = this.getToken();
      if (token) {
        console.log('Token successfully retrieved');
        return token;
      }
      await new Promise(resolve => setTimeout(resolve, this.checkInterval));
      console.log('Still waiting for token...');
    }

    console.error('Token waiting timeout after', this.maxWaitTime, 'ms');
    return null;
  }

  public getConnectionStatus() {
    return this.connectionStatus;
  }

  public async connect() {
    console.log('Attempting to connect WebSocket');
    
    if (!StockWebSocket.shouldInitialize()) {
      console.log('WebSocket initialization skipped - not on relevant page');
      return;
    }

    if (this.connectionStatus === 'connecting') {
      console.log('Connection already in progress');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.connectionStatus = 'connecting';

    try {
      const token = await this.waitForToken();
      if (!token) {
        this.connectionStatus = 'disconnected';
        console.error('Failed to obtain token for WebSocket connection');
        return;
      }

      const url = `${StockWebSocket.BASE_URL}${StockWebSocket.WS_PATH}?token=${token}`;
      console.log('Initiating WebSocket connection to:', url);

      this.ws = new WebSocket(url);
      this.setupWebSocketHandlers();
    } catch (error) {
      this.connectionStatus = 'disconnected';
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  public static shouldInitialize(): boolean {
    const path = window.location.pathname;
    const shouldInit = path.includes('/advanced') || path.includes('/chat');
    console.log('Checking initialization:', path, shouldInit);
    return shouldInit;
  }

  private setupWebSocketHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.connectionStatus = 'connected';
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
      }
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = (event) => {
      this.connectionStatus = 'disconnected';
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
      }
      if (StockWebSocket.shouldInitialize()) {
        const reason = this.getCloseReason(event.code);
        console.log(`WebSocket closed: ${event.code} (${reason})`);
        this.handleClose();
      }
    };

    this.ws.onerror = (error) => {
      this.connectionStatus = 'disconnected';
      console.error('WebSocket error occurred:', {
        error,
        readyState: this.ws?.readyState,
        url: this.ws?.url
      });
    };

    this.setupMessageHandler();
  }

  private setupMessageHandler() {
    if (!this.ws) return;

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const response = JSON.parse(event.data) as WebSocketResponse;
        console.log(`Received WebSocket message (${this.connectionId}):`, response);

        switch (response.type) {
          case WebSocketActions.START_GAME:
            console.log('Game started:', response.message);
            break;
          
          case WebSocketActions.PAUSE_GAME:
            console.log('Game paused:', response.message);
            break;

          case WebSocketActions.REFERENCE_DATA:
            if (response.data?.stocks) {
              console.log('Received initial stock data:', response.data.stocks);
            }
            break;

          case WebSocketActions.LIVE_DATA:
            if (response.data) {
              console.log('Received live stock data:', response.data);
            }
            break;

          case WebSocketActions.END_GAME:
            console.log('Game ended:', response.message);
            break;
        }

        const message: WebSocketMessage = {
          type: response.type,
          data: response.data,
          action: response.type
        };

        this.messageHandler?.(message);
      } catch (error) {
        console.error(`Failed to parse WebSocket message (${this.connectionId}):`, error);
      }
    };
  }

  public sendMessage(action: WebSocketActions, payload = {}) {
    if (!StockWebSocket.shouldInitialize()) {
      console.log('Message not sent - not on relevant page');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        action,
        ...payload,
        connectionId: this.connectionId
      });
      console.log(`Sending WebSocket message (${this.connectionId}):`, message);
      this.ws.send(message);
    } else {
      console.warn(`Cannot send message - WebSocket not ready (State: ${this.ws?.readyState}, Status: ${this.connectionStatus})`);
    }
  }

  private handleClose() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handleReconnect();
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && StockWebSocket.shouldInitialize()) {
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.log(`Scheduling reconnection (${this.connectionId}) in ${timeout}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, timeout);
    } else {
      console.error(`Maximum reconnection attempts (${this.maxReconnectAttempts}) reached for connection ${this.connectionId}`);
    }
  }

  private getCloseReason(code: number): string {
    const reasons: Record<number, string> = {
      1000: "정상 종료",
      1001: "연결 종료 중",
      1002: "프로토콜 오류",
      1003: "지원하지 않는 데이터 형식",
      1005: "상태 코드 없음",
      1006: "비정상 종료",
      1007: "잘못된 데이터 형식",
      1008: "정책 위반",
      1009: "메시지 크기 초과",
      1010: "필수 확장 기능 누락",
      1011: "내부 서버 오류",
      1015: "TLS 보안 연결 실패"
    };
    return reasons[code] || "알 수 없는 오류";
  }

  public onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandler = handler;
  }

  public disconnect() {
    console.log('Disconnecting WebSocket');
    this.connectionStatus = 'disconnected';
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    if (this.ws) {
      this.ws.close(1000, '정상 종료');
      this.ws = null;
    }
    StockWebSocket.instance = null;
  }
}

export const webSocket = StockWebSocket.getInstance();