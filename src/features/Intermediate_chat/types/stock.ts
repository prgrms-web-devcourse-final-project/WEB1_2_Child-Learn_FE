// 중급 주식 종목 타입
export interface MidStock {
    mid_stock_id: number;
    mid_name: string;
  }
  
  // 중급 종목 가격 타입
  export interface MidStockPrice {
    mid_stock_price_id: number;
    mid_list_id: number;
    high_price: number;
    low_price: number;
    avg_price: number;
    price_date: string;
  }
  
  // 중급 보유주식 타입
  export interface MidStockTrade {
    mid_trade_id: number;
    mid_list_id: number;
    member_id: number;
    trade_point: number;
    price_per_stock: number;
    createDate: string;
    trade_type: 'buy' | 'sell';
  }
  
  // 차트 데이터용 인터페이스
  export interface CandlestickData {
    x: Date;
    y: [number, number, number, number]; // [open, high, low, close]
  }
  
  // 주식 차트 옵션 인터페이스
  export interface ChartOptions {
    chart: {
      type: string;
      height: number;
      toolbar: {
        show: boolean;
      };
      zoom: {
        enabled: boolean;
      };
    };
    plotOptions: {
      candlestick: {
        colors: {
          upward: string;
          downward: string;
        };
      };
    };
    xaxis: {
      type: string;
    };
    yaxis: {
      tooltip: {
        enabled: boolean;
      };
    };
  }