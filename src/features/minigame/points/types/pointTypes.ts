// TransactionType Enum
export type TransactionType = 'EARNED' | 'USED' | 'MAINTAINED' | 'EXCHANGED';

// PointType Enum
export type PointType = 'GAME' | 'STOCK' | 'EXCHANGE' | 'ATTENDANCE';

// GameType Enum
export type GameType = 'CARD_FLIP' | 'OX_QUIZ' | 'WORD_QUIZ';

// MiniGame Transaction Interface
export interface MiniGameTransaction {
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
  currentPoints: number;
  currentCoins: number;
}

export interface PointTransaction {
  id: number; // Java의 Long → TypeScript의 number
  transactionType: TransactionType; // ENUM 타입
  points: number; // 포인트 수량
  pointType: PointType; // ENUM 타입
  subType?: string; // 서브 타입 (Optional)
  description?: string; // 설명 (Optional)
  createdAt: string; // LocalDateTime → ISO 8601 형식의 string
}