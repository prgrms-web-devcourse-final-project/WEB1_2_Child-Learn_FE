// TransactionType Enum
export type TransactionType = 'EARNED' | 'USED' | 'MAINTAINED' | 'EXCHANGED';

// PointType Enum
export type PointType = 'GAME' | 'STOCK' | 'EXCHANGE' | 'ATTENDANCE';

// GameType Enum
export type GameType = 'CARD_FLIP' | 'OX_QUIZ' | 'WORD_QUIZ';

// MiniGame Transaction Interface
export interface MiniGameTransaction {
  memberId: number;
  transactionType: TransactionType;
  gameType: GameType;
  points: number;
  isWin: boolean;
  createdAt: string; // ISO 8601 format
}

// ExchangeRequest Interface
export interface ExchangeRequest {
    pointsExchanged: number;
  }

// Wallet Interface
export interface Wallet {
  memberId: number;
  currentPoints: number;
  currentCoins: number;
}
