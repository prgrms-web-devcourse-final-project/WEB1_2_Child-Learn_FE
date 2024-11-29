
export type WebSocketMessageType = 
  | 'START_GAME' 
  | 'PAUSE_GAME' 
  | 'RESUME_GAME' 
  | 'END_GAME' 
  | 'LIVE_DATA' 
  | 'REFERENCE_DATA'
  | 'GET_REMAINING_TIME'
  | 'GET_VOLUMES'
  | 'BUY_STOCK'
  | 'SELL_STOCK';

interface WebSocketMessage {
  type: WebSocketMessageType;
  data: StockData | StockData[] | RemainingTimeData | GameEndMessage | VolumeData;
}

export interface StockData {
  symbol: string;
  name: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  timestamp: number;
  dataType: 'REFERENCE' | 'LIVE';
}

export interface StockPrice {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

// 데이터 변환 유틸리티 함수
export const transformStockData = (data: StockData): StockPrice => {
  return {
    timestamp: data.timestamp,
    open: data.openPrice,
    high: data.highPrice,
    low: data.lowPrice,
    close: data.closePrice
  };
};

interface RemainingTimeData {
  remainingTime: number;
}

interface GameEndMessage {
  message: string;
}

interface VolumeData {
  volumes: number[];
}

// StockData 타입 가드 함수 추가
function isStockData(data: any): data is StockData {
  return 'symbol' in data && 'openPrice' in data;
}

export class StockWebSocket {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private stockDataCallback?: (data: StockPrice) => void;
  private volumeCallback?: (volumes: number[]) => void;

  constructor(url: string) {
    this.url = url;
  }

  connect(onMessage: (data: any) => void) {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('웹소켓 연결됨');
      this.sendMessage('START_GAME');
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (Array.isArray(message)) {
          onMessage({
            type: 'LIVE_DATA',
            data: message
          });
        } else {
          onMessage(message);
        }
      } catch (error) {
        console.error('웹소켓 메시지 파싱 오류:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('웹소켓 에러:', error);
    };

    this.ws.onclose = () => {
      console.log('웹소켓 연결 종료');
    };
  }

  sendMessage(type: WebSocketMessageType, data?: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  disconnect() {
    this.ws?.close();
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  handleMessage(event: MessageEvent) {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'LIVE_DATA':
        case 'REFERENCE_DATA':
          const stockData = Array.isArray(message.data) 
            ? message.data.filter(isStockData)
            : isStockData(message.data) ? [message.data] : [];
          stockData.forEach(data => {
            const price = transformStockData(data);
            this.stockDataCallback?.(price);
          });
          break;
        
        case 'END_GAME':
          console.log('게임이 종료되었습니다');
          this.disconnect();
          break;
        
        case 'GET_VOLUMES':
          const volumeData = message.data as VolumeData;
          this.volumeCallback?.(volumeData.volumes);
          break;
      }
    } catch (error) {
      console.error('웹소켓 메시지 파싱 오류:', error);
    }
  }

  sendTradeRequest(type: 'BUY_STOCK' | 'SELL_STOCK', symbol: string, quantity: number) {
    this.sendMessage(type, { symbol, quantity });
  }

  getRemainingTime() {
    this.sendMessage('GET_REMAINING_TIME');
  }

  // 콜백 설정을 위한 메서드 추가
  setStockDataCallback(callback: (data: StockPrice) => void) {
    this.stockDataCallback = callback;
  }

  // 거래량 요청 메서드
  getVolumes() {
    this.sendMessage('GET_VOLUMES');
  }

  // 거래량 콜백 설정
  setVolumeCallback(callback: (volumes: number[]) => void) {
    this.volumeCallback = callback;
  }
}

export const createStockWebSocket = () => {
  return new StockWebSocket('ws://localhost/api/v1/advanced-game/stocks');
}; 