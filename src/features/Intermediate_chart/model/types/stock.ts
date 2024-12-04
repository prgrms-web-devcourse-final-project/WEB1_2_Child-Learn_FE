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
  id: number;
  tradePoint: number;
  pricePerStock: number;
  tradeType: 'BUY' | 'SELL';
  createDate: string;
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