export enum WebSocketActions {
  START_GAME = 'START_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  END_GAME = 'END_GAME',
  REFERENCE_DATA = 'REFERENCE_DATA',
  LIVE_DATA = 'LIVE_DATA',
  BUY_STOCK = 'BUY_STOCK',
  SELL_STOCK = 'SELL_STOCK',
  GET_VOLUMES = 'GET_VOLUMES',
  GET_REMAINING_TIME = 'GET_REMAINING_TIME'
}

export interface Stock {
  id: number;
  symbol: string;
  title: string;
}

export interface StockPrice {
  timestamp: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  volume: number;
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

export interface TradeHistory {
  tradeId: number;
  stockSymbol: string;
  tradeType: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  tradeDate: string;
}

export interface StockQuantity {
  stockSymbol: string;
  quantity: number;
}