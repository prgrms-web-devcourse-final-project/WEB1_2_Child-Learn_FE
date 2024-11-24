// shared/api/stock.ts
import { MidStock, StockWithDetails, StockPrice, TradeResponse, TradeAvailability, TradeDetail } from '@/features/Intermediate_chat/types/stock';
const BASE_URL = '/api/v1/mid-stocks';

export const stockApi = {
    getStockList: async (): Promise<MidStock[]> => {
      try {
        const response = await fetch(`${BASE_URL}/list`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
        throw error;
      }
    },

  // 특정 종목의 보유 주식 확인
  getStockHoldings: async (midStockId: number): Promise<TradeDetail[]> => {
    const response = await fetch(`${BASE_URL}/${midStockId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch stock holdings');
    return response.json();
  },

  // 모든 보유 주식 리스트 확인
  getAllHoldings: async (): Promise<StockWithDetails[]> => {
    const response = await fetch(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch all holdings');
    return response.json();
  },

  // 종목별 차트 정보 조회
  getStockPrices: async (midStockId: number): Promise<StockPrice[]> => {
    const response = await fetch(`${BASE_URL}/${midStockId}/price`);
    if (!response.ok) throw new Error('Failed to fetch stock prices');
    return response.json();
  },

  // 매수 주문
  buyStock: async (midStockId: number, tradePoint: number): Promise<TradeResponse> => {
    const response = await fetch(`${BASE_URL}/${midStockId}/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ tradePoint }),
    });
    if (response.status === 400) throw new Error('Insufficient balance');
    if (!response.ok) throw new Error('Failed to buy stock');
    return response.json();
  },

  // 매도 주문
  sellStock: async (midStockId: number): Promise<TradeResponse> => {
    const response = await fetch(`${BASE_URL}/${midStockId}/sell`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to sell stock');
    return response.json();
  },

  // 거래 가능 여부 확인
  checkTradeAvailability: async (midStockId: number): Promise<TradeAvailability> => {
    const response = await fetch(`${BASE_URL}/${midStockId}/available`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to check trade availability');
    return response.json();
  },
};