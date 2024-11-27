export interface AdvancedStock {
    id: number;
    symbol: string;
    name: string;
    currentPrice: number;
  }
  
  export interface StockPrice {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }