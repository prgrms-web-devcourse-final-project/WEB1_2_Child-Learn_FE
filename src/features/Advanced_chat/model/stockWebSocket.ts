class StockWebSocket {
  private ws: WebSocket | null = null;
  private messageHandler: ((message: WebSocketMessage) => void) | null = null;

  connect(onMessage: (message: WebSocketMessage) => void) {
    this.messageHandler = onMessage;

    // Vite 환경 변수 사용
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandler?.(message);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };
  }

  sendMessage(type: string, data?: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}

export const createStockWebSocket = () => new StockWebSocket();