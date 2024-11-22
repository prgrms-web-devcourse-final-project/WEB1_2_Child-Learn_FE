import { ChartData, StockSlideData } from '../types/stock';

export const stockList: StockSlideData[] = [
    {
      id: 1,
      name: "",
      basePrice: 1168000,
      description: ""
    },
    {
      id: 2,
      name: "",
      basePrice: 12000,
      description: ""
    },
    {
      id: 3,
      name: "",
      basePrice: 2500000,
      description: ""
    }
  ];

export const generateStockData = (stockId: number): ChartData[] => {
    const basePrice = stockId === 1 ? 1268000 : stockId === 2 ? 50000 : 2500000;
    const volatility = 0.02;
    const data: ChartData[] = [];
  
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      
      const dayVolatility = (Math.random() - 0.5) * volatility * 2;
      const openPrice = Math.round(basePrice * (1 + dayVolatility));
      const closePrice = Math.round(basePrice * (1 + (Math.random() - 0.5) * volatility * 2));
      const highPrice = Math.max(openPrice, closePrice) + Math.round(Math.random() * basePrice * volatility);
      const lowPrice = Math.min(openPrice, closePrice) - Math.round(Math.random() * basePrice * volatility);
  
      data.push({
        x: date.getTime(),
        y: [openPrice, highPrice, lowPrice, closePrice]
      });
    }
    return data;
  };