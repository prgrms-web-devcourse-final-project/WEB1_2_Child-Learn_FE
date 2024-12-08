
export interface BuyTradeResponse {
  warning: boolean; 
}


export interface SellTradeResponse {
  earnedPoints: number;  
}


export interface TradeResponse {
  earnedPoints?: number;  

}


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

export interface TradeData {
  stockId: number;
  tradePoint?: number;
  type: 'buy' | 'sell';
  tradeDate: string;
}