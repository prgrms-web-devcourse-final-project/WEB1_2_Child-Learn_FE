// features/Intermediate_chat/model/types/stock.ts
export interface MidStock {
  midStockId: number;
  midName: string;
}

export interface TradeDetail {
  tradePoint: number;
  pricePerStock: number;
  tradeDate: string;
  tradeType: 'BUY' | 'SELL';
}

// StockWithDetails 인터페이스 수정
export interface StockWithDetails {
  midStockId: number;
  midName: string;
  details: TradeDetail[];
}

export interface StockPrice {
  highPrice: number;
  lowPrice: number;
  avgPrice: number;
  priceDate: string;
}

export interface TradeResponse {
  warning?: boolean;
  earnedPoints?: number;
}

export interface TradeAvailability {
  isPossibleBuy: boolean;
  isPossibleSell: boolean;
}

// ChartData 인터페이스도 필요하다면 추가
export interface ChartData {
  x: number;
  y: [number, number, number, number];  // [open, high, low, close]
}