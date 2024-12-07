// 매수 응답
export interface BuyTradeResponse {
  warning: boolean;  // required로 변경
}

// 매도 응답
export interface SellTradeResponse {
  earnedPoints: number;  // required로 변경
}

// 통합 응답 타입 (기존 코드와의 호환성을 위해 필요한 경우)
export type TradeResponse = BuyTradeResponse | SellTradeResponse;

// 나머지 인터페이스들은 API 문서와 일치하므로 그대로 유지
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