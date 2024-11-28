// shared/api/advancedGame.ts
import { StockResponseDto } from '@/features/Advanced_chat/types/stock';

export const advancedGameApi = {
  getStocks: async () => {
    const response = await fetch('/api/v1/advanced-game/stocks');
    return response.json();
  },

  getStockData: async (symbol: string): Promise<StockResponseDto> => {
    const response = await fetch(`/api/v1/advanced-game/stocks/${symbol}`);
    return response.json();
  },

  executeTrade: async (tradeData: {
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
    price: number;
  }) => {
    const response = await fetch('/api/v1/advanced-game/trade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tradeData),
    });
    return response.json();
  }
};