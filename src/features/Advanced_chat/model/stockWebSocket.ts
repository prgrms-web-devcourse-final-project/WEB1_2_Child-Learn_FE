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

export class StockWebSocket {
  private static instance: StockWebSocket | null = null;
  private ws: WebSocket | null = null;
  private messageHandler?: (message: WebSocketMessage) => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionId: string;
  private connectionStatus: 'connecting' | 'connected' | 'disconnected' = 'disconnected';
  private static readonly BASE_URL = 'ws://43.202.106.45';
  private static readonly WS_PATH = '/api/v1/advanced-invest';
  private connectPromise: Promise<void> | null = null;

  private constructor() {
    this.connectionId = generateUUID();
    console.log('WebSocket instance created:', this.connectionId);
  }

  public static getInstance(): StockWebSocket {
    if (!StockWebSocket.instance) {
      StockWebSocket.instance = new StockWebSocket();
    }
    return StockWebSocket.instance;
  }

  private getAuthToken(): string | null {
    try {
      const authStorageStr = localStorage.getItem('auth-storage');
      console.log('Raw auth storage:', authStorageStr);  // 디버깅을 위한 로그
      
      if (!authStorageStr) {
        console.warn('No auth-storage found in localStorage');
        return null;
      }

      const authStorage = JSON.parse(authStorageStr);
      console.log('Parsed auth storage:', authStorage);  // 디버깅을 위한 로그
      
      const token = authStorage?.state?.accessToken;
      console.log('Extracted token:', token);  // 디버깅을 위한 로그
      
      if (!token) {
        console.warn('No token found in auth-storage state');
        return null;
      }

      return token;
    } catch (error) {
      console.error('Error parsing auth-storage:', error);
      return null;
    }
  }

  public getConnectionStatus() {
    return this.connectionStatus;
  }

  public async connect() {
    if (this.connectPromise) {
      return this.connectPromise;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return Promise.resolve();
    }

    this.connectPromise = new Promise<void>((resolve, reject) => {
      const token = this.getAuthToken();
      if (!token) {
        this.connectionStatus = 'disconnected';
        reject(new Error('No authentication token available'));
        this.connectPromise = null;
        return;
      }

      this.connectionStatus = 'connecting';

      try {
        const url = new URL(`${StockWebSocket.BASE_URL}${StockWebSocket.WS_PATH}`);
        // 'access_token' 파라미터로 변경
        url.searchParams.append('access_token', token);

        console.log('Connecting to WebSocket:', url.toString());
        this.ws = new WebSocket(url.toString());

        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
          this.connectPromise = null;
          this.ws?.close();
        }, 5000);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          this.connectionStatus = 'connected';
          this.reconnectAttempts = 0;
          console.log('WebSocket connected successfully');
          this.setupWebSocketHandlers();
          resolve();
          this.connectPromise = null;
        };

        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          this.connectionStatus = 'disconnected';
          console.error('WebSocket error:', error);
          reject(error);
          this.connectPromise = null;
          this.handleReconnect();
        };

      } catch (error) {
        this.connectionStatus = 'disconnected';
        reject(error);
        this.connectPromise = null;
        this.handleReconnect();
      }
    });

    return this.connectPromise;
  }

  private setupWebSocketHandlers() {
    if (!this.ws) return;

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        console.log('Received message:', message);
        
        if (this.messageHandler) {
          this.messageHandler(message);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    this.ws.onclose = (event) => {
      this.connectionStatus = 'disconnected';
      this.connectPromise = null;
      console.log(`WebSocket closed: ${event.code} (${this.getCloseReason(event.code)})`);
      
      if (event.code === 1006) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      this.connectionStatus = 'disconnected';
      console.error('WebSocket error:', error);
    };
  }

  private async handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      return;
    }

    const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    console.log(`Reconnecting in ${timeout}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    await new Promise(resolve => setTimeout(resolve, timeout));
    
    this.reconnectAttempts++;
    try {
      await this.connect();
      if (this.ws?.readyState === WebSocket.OPEN) {
        await this.sendMessage(WebSocketActions.REFERENCE_DATA);
      }
    } catch (error) {
      console.error('Reconnection failed:', error);
    }
  }

  public async sendMessage(type: WebSocketActions, data?: any) {
    try {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        await this.connect();
      }

      if (this.ws?.readyState === WebSocket.OPEN) {
        const message: WebSocketMessage = {
          type,
          data,
          connectionId: this.connectionId
        };
        console.log('Sending message:', message);
        this.ws.send(JSON.stringify(message));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
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
    this.connectPromise = null;
    
    if (this.ws) {
      this.ws.close(1000, '정상 종료');
      this.ws = null;
    }
    
    StockWebSocket.instance = null;
  }
}

export const webSocket = StockWebSocket.getInstance();