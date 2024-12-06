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

  private async connect() {
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
        // 토큰을 헤더로 전달
        const ws = new WebSocket(
            `${StockWebSocket.BASE_URL}${StockWebSocket.WS_PATH}`,
            [`Bearer ${token}`]  // 토큰을 프로토콜로 전달
        );

        // 연결 성공 대기
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Connection timeout'));
            }, 5000);

            ws.onopen = () => {
                clearTimeout(timeout);
                resolve(true);
            };

            ws.onerror = (error) => {
                clearTimeout(timeout);
                reject(error);
            };
        });

        this.ws = ws;
        this.setupWebSocketHandlers();
        this.connectionStatus = 'connected';
        this.reconnectAttempts = 0;
        console.log('WebSocket connected successfully');

    } catch (error) {
        this.connectionStatus = 'disconnected';
        console.error('WebSocket connection failed:', error);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.handleReconnect();
        }
    }
}

private setupWebSocketHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.connectionStatus = 'connected';
        this.reconnectAttempts = 0;
        
        // 연결 성공 시 바로 REFERENCE_DATA 요청
        this.sendMessage(WebSocketActions.REFERENCE_DATA);
    };

    this.ws.onclose = async (event) => {
        this.connectionStatus = 'disconnected';
        console.log(`WebSocket closed: ${event.code} (${this.getCloseReason(event.code)})`);
        
        if (event.code === 1006) {
            // 비정상 종료인 경우 재연결 시도
            await this.handleReconnect();
        }
    };

    this.ws.onerror = (error) => {
        this.connectionStatus = 'disconnected';
        console.error('WebSocket error:', error);
    };

    this.setupMessageHandler();
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
    await this.connect();
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

