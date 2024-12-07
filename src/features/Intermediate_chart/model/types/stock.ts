export interface MidStock {
  midStockId: number;
  midName: string;
}

export interface StockPrice {
  highPrice: number;
  lowPrice: number;
  avgPrice: number;
  priceDate: string;
}

export interface TradeDetail {
  tradePoint: number;
  pricePerStock: number;
  tradeDate: string;
  tradeType: 'BUY' | 'SELL';
}

export interface StockWithDetails extends MidStock {
  details: TradeDetail[];
}

export interface TradeAvailability {
  isPossibleBuy: boolean;
  isPossibleSell: boolean;
}

export interface TradeResponse {
  warning?: boolean;
  earnedPoints?: number;
  success: boolean;
  message?: string;
}

export interface TradeResult {
  earnedPoints?: number;  // 매도 응답
  warning?: boolean;      // 매수 응답
}

