// types/stock.ts
export interface AdvancedStock {
    id: number;
    symbol: string;
    name: string;
    currentPrice: number;
    gameDate: string;
  }
  
  export interface StockPrice {
    time: string;         // HH:mm 형식
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }
  
  export interface GameState {
    isPlaying: boolean;
    currentTime: number;  // 진행 시간 (초)
    marketPhase: 'BEFORE' | 'TRADING' | 'AFTER';
    playedToday: boolean;
  }
  
  export interface TradeInfo {
    stockId: number;
    type: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    timestamp: string;
  }