import { baseApi } from "./base";

// TransactionType Enum
export type TransactionType = 'EARNED' | 'USED' | 'MAINTAINED' | 'EXCHANGED';

// PointType Enum
export type PointType = 'GAME' | 'STOCK' | 'EXCHANGE' | 'ATTENDANCE';

// GameType Enum
export type GameType = 'CARD_FLIP' | 'OX_QUIZ' | 'WORD_QUIZ';

// Wallet Interface
export interface Wallet {
  memberId: number;
  currentPoints: number;
  currentCoins: number;
}

// ExchangeRequest Interface
export interface ExchangeRequest {
  pointsExchanged: number;
}

// MiniGameTransaction Interface
export interface MiniGameTransaction {
  memberId: number;
  transactionType: TransactionType;
  gameType: GameType;
  points: number;
  isWin: boolean;
  createdAt: string; // ISO 8601 format
}

// Wallet API
export const walletApi = {
  // 현재 포인트 및 코인 조회
  getWallet: async (memberId: number): Promise<Wallet> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.get(`/wallet/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 설정
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
      throw error;
    }
  },

  // 환전 처리
  exchangePoints: async (request: ExchangeRequest): Promise<Wallet> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.post(`/wallet/exchange`, request, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 설정
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to exchange points:", error);
      throw error;
    }
  },

  // 미니게임 포인트 처리
  processMiniGamePoints: async (transaction: MiniGameTransaction): Promise<Wallet> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.post(`/wallet/minigame`, transaction, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 설정
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to process mini-game points:", error);
      throw error;
    }
  },
};

