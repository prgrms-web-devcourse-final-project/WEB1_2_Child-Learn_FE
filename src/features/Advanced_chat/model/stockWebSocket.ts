interface WebSocketMessage {
  action: string;
  [key: string]: any;
}

type WebSocketActions = 'subscribe' | 'unsubscribe' | 'message';

export class StockWebSocket {
  // 배포된 서버의 wss URL로 변경
  private static readonly BASE_URL = 'wss://3.35.242.1:8080';
  private static readonly WS_PATH = '/ws/advanced-invest';
  
  private ws: WebSocket | null = null;
  private messageHandler?: (message: WebSocketMessage) => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      const url = `${StockWebSocket.BASE_URL}${StockWebSocket.WS_PATH}`;
      console.log('Attempting secure WebSocket connection:', url);
      
      this.ws = new WebSocket(url);
      
      // Connection timeout handler
      this.connectionTimeout = setTimeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout');
          this.ws?.close();
          this.handleReconnect();
        }
      }, 5000);

      this.ws.onopen = () => {
        console.log('Secure WebSocket connection established');
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
        }
        this.reconnectAttempts = 0;
      };

      this.ws.onclose = (event) => {
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
        }
        const reason = this.getCloseReason(event.code);
        console.log(`WebSocket closed: ${event.code} (${reason})`);
        this.handleClose();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', {
          error,
          readyState: this.ws?.readyState,
          url: url
        });
      };
      
      this.setupMessageHandler();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
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
    return reasons[code] || "Unknown";
  }

  private setupMessageHandler() {
    if (!this.ws) return;

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        this.messageHandler?.(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
  }

  private handleClose() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handleReconnect();
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.log(`Attempting to reconnect in ${timeout}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, timeout);
    } else {
      console.error('Maximum reconnection attempts reached');
    }
  }

  sendMessage(action: WebSocketActions, payload = {}) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ action, ...payload });
      console.log('Sending message:', message);
      this.ws.send(message);
    } else {
      console.warn(`Cannot send message, WebSocket state: ${this.ws?.readyState}`);
    }
  }

  onMessage(handler: (message: WebSocketMessage) => void) {
    this.messageHandler = handler;
  }

  disconnect() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
  }
}

export const webSocket = new StockWebSocket();