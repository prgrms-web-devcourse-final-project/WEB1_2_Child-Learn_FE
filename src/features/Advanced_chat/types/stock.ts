export interface Stock {
  id: number;
  symbol: string;
  title: string;
}

export interface StockPrice {
  timestamp: string;
  price: string;
  open: string;
  high: string;
  low: string;
  close: string;
  change: number;
  volume: number;
}

export enum WebSocketActions {
  REFERENCE_DATA = 'REFERENCE_DATA',
  LIVE_DATA = 'LIVE_DATA',
  START_GAME = 'START_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  END_GAME = 'END_GAME',
  GET_VOLUMES = 'GET_VOLUMES',
  GET_REMAINING_TIME = 'GET_REMAINING_TIME',
  BUY_STOCK = 'BUY_STOCK',
  SELL_STOCK = 'SELL_STOCK'
}

export interface WebSocketMessage {
  action?: WebSocketActions;
  type: WebSocketActions;
  memberId?: number;
  advId?: number;
  stockSymbol?: string;
  quantity?: number;
  data?: {
    stocks?: Stock[];  // 주식 목록 데이터
    symbol: string;
    timestamp: number;
    closePrice: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volumes?: number[];  // 거래량 데이터
    change?: number;
    volume?: number;
  };
  message?: string;  // 서버 응답 메시지
}