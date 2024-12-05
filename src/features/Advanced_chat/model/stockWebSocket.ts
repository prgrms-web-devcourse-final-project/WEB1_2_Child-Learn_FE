interface WebSocketMessage {
  action: string;
  [key: string]: any;
}

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
      1000: "Normal closure",
      1001: "Going away",
      1002: "Protocol error",
      1003: "Unsupported data",
      1005: "No status received",
      1006: "Abnormal closure",
      1007: "Invalid frame payload data",
      1008: "Policy violation",
      1009: "Message too big",
      1010: "Mandatory extension",
      1011: "Internal error",
      1015: "TLS handshake failure"
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