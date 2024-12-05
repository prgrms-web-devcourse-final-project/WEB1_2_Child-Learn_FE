export interface Stock {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
}

export interface StockPrice {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export enum WebSocketActions {
  START_GAME = 'START_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  END_GAME = 'END_GAME',
  GET_REMAINING_TIME = 'GET_REMAINING_TIME',
  REFERENCE_DATA = 'REFERENCE_DATA',
  LIVE_DATA = 'LIVE_DATA'
}

export interface WebSocketMessage {
  action: WebSocketActions;
  advId?: number;
  data?: {
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