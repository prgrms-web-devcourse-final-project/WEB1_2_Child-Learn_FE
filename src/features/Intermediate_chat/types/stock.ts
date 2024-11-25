// features/Intermediate_chat/types/stock.ts
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

// ChartData를 별도로 정의
export interface ChartData {
  x: number;
  y: [number, number, number, number];
}

export interface StockWithDetails {
  id: number;
  name: string;
  currentPrice: number;
  holdings?: number;
  // 필요한 다른 속성들 추가
}
export interface MidStock {
  midStockId: number;
  midName: string;
}