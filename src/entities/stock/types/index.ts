// StockChartData 인터페이스 정의
export interface StockChartData {
    x: number;
    y: [number, number, number, number];  // [open, high, low, close]
  }