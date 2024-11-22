export interface MidStock {
    mid_stock_id: number;
    mid_name: string;
  }
  
  export interface MidStockPrice {
    mid_stock_price_id: number;
    mid_list_id: number;
    high_price: number;
    low_price: number;
    avg_price: number;
    price_date: string;
  }
  export interface ChartData {
    x: number;
    y: [number, number, number, number];
  }
  export interface StockSlideData {
    id: number;
    name: string;
    basePrice: number;
    description: string;
  }
  