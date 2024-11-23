export interface Stock {
    id: number;
    name: string;
    currentPrice: number;
    dailyChange: number;
    chartData?: StockChartData[];
  }
  
  export const stockList: Stock[] = [
    {
      id: 1,
      name: "삼성전자",
      basePrice: 1280000,
      currentPrice: 1275000,
      description: "대한민국 대표 IT 기업",
      dailyChange: -0.39,
      volume: 1234567
    },
    {
        id: 2,
        name: "현대자동차",
        basePrice: 1280000,
        currentPrice: 1275000,
        description: "대한민국 대표 자동차 기업",
        dailyChange: -0.39,
        volume: 1234567
      },
      {
        id: 2,
        name: "카카오",
        basePrice: 1280000,
        currentPrice: 1275000,
        description: "대한민국 대표 기업",
        dailyChange: -0.39,
        volume: 1234567
      },
];