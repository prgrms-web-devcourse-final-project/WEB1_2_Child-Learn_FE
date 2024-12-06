function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
        // auth-storage에서 데이터 가져오기
        const authStorageStr = localStorage.getItem('auth-storage');
        if (!authStorageStr) {
            console.error('No auth-storage found in localStorage');
            return null;
        }

        // JSON 파싱
        const authStorage = JSON.parse(authStorageStr);
        
        // state.accessToken 접근
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
}

  public getConnectionStatus() {
    return this.connectionStatus;
  }

  public async connect() {
    if (this.connectionStatus === 'connecting') {
      console.log('Connection already in progress');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const token = this.getAuthToken();
    if (!token) {
      this.connectionStatus = 'disconnected';
      console.error('Cannot connect: No authentication token available');
      return;
    }

    this.connectionStatus = 'connecting';

    try {
      const url = new URL(`${StockWebSocket.BASE_URL}${StockWebSocket.WS_PATH}`);
      url.searchParams.append('authorization', `Bearer ${token}`);
      
      console.log('Connecting to WebSocket:', url.toString());
      this.ws = new WebSocket(url.toString());
      
      this.setupWebSocketHandlers();
    } catch (error) {
      this.connectionStatus = 'disconnected';
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private setupWebSocketHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected successfully');
      this.connectionStatus = 'connected';
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = (event) => {
      this.connectionStatus = 'disconnected';
      console.log(`WebSocket closed: ${event.code} (${this.getCloseReason(event.code)})`);
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus = 'disconnected';
    };

    this.setupMessageHandler();
  }

  private setupMessageHandler() {
    if (!this.ws) return;

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const response = JSON.parse(event.data);
        console.log(`Received message (${this.connectionId}):`, response);

        if (response.type) {
          const message: WebSocketMessage = {
            type: response.type,
            data: response.data,
            action: response.type
          };
          this.messageHandler?.(message);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
  }

  public sendMessage(action: WebSocketActions, payload = {}) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        action,
        ...payload,
        connectionId: this.connectionId
      });
      
      console.log(`Sending message:`, message);
      this.ws.send(message);
    } else {
      console.warn('Cannot send message: WebSocket not connected');
      this.connect().then(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({
            action,
            ...payload,
            connectionId: this.connectionId
          });
          this.ws.send(message);
        }
      });
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.log(`Reconnecting in ${timeout}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, timeout);
    } else {
      console.error('Maximum reconnection attempts reached');
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
    
    if (this.ws) {
      this.ws.close(1000, '정상 종료');
      this.ws = null;
    }
    
    StockWebSocket.instance = null;
  }
}

export const webSocket = StockWebSocket.getInstance();

