// TransactionType Enum
export type TransactionType = 'EARNED' | 'USED' | 'MAINTAINED' | 'EXCHANGED';

// PointType Enum
export type PointType = 'GAME' | 'STOCK' | 'EXCHANGE' | 'ATTENDANCE';

// GameType Enum
export type GameType = 'CARD_FLIP' | 'OX_QUIZ' | 'WORD_QUIZ';

// MiniGame Transaction Interface
export interface MiniGameTransaction {
  memberId: number;
  points: number;
  pointType: 'GAME'; // 명세서에 따른 값 고정
  gameType: GameType;
  isWin: boolean;
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
