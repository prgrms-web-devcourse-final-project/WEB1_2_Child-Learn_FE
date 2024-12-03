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
  success: boolean;
  message: string;
  // 필요한 다른 필드들 추가
}
 