// src/features/Advanced_game/model/stockWebSocket.ts

interface WebSocketMessage {
  type: string;
  advId?: number;
  stockSymbol?: string;
  quantity?: number;
  memberId?: number;
  data?: any;
}

export const createStockWebSocket = () => {
  let ws: WebSocket | null = null;
  let messageHandler: ((message: any) => void) | null = null;

  const connect = (onMessage: (message: any) => void) => {
    messageHandler = onMessage;
    
    try {
      // 개발 환경에서는 mock 서버 URL 사용
      const wsUrl = process.env.NODE_ENV === 'development' 
        ? 'ws://localhost/api/v1/advanced-invest'
        : `ws://${window.location.host}/api/v1/advanced-invest`;

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('웹소켓 연결됨');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (messageHandler) {
            messageHandler(message);
          }
        } catch (error) {
          console.error('메시지 파싱 에러:', error);
        }
      };

      ws.onclose = () => {
        console.log('웹소켓 연결 종료');
        ws = null;
      };

      ws.onerror = (error) => {
        console.error('웹소켓 에러:', error);
      };
    } catch (error) {
      console.error('웹소켓 연결 실패:', error);
    }
  };

  const sendMessage = (type: string, data: Partial<WebSocketMessage> = {}) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    
    const message = {
      action: type,
      ...data
    };
    
    ws.send(JSON.stringify(message));
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
      ws = null;
    }
  };

  return {
    connect,
    sendMessage,
    disconnect
  };
};