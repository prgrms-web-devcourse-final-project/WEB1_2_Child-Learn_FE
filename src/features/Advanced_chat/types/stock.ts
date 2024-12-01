export interface StockResponseDto {
  symbol: string;
  name: string;
  openPrices: number[];
  highPrices: number[];
  lowPrices: number[];
  closePrices: number[];
  timestamps: number[];
}

export interface StockPrice {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Stock {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
}