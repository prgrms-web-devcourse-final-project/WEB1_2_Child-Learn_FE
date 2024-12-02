import { http, HttpResponse } from 'msw';

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

// Wallet Interface
export interface Wallet {
  memberId: number;
  currentPoints: number;
  currentCoins: number;
}

// Mock 데이터
let mockWallet: Wallet = {
  memberId: 1,
  currentPoints: 5000,
  currentCoins: 50,
};

let mockTransactions: MiniGameTransaction[] = [];

export const walletHandlers = [
  // 현재 포인트 및 코인 조회 핸들러
  http.get('/api/v1/wallet/:memberId', ({ params }) => {
    const memberId = Number(params.memberId);

    console.log(`MSW: Request to fetch wallet for member ID: ${memberId}`);

    if (mockWallet.memberId !== memberId) {
      return new HttpResponse(
        JSON.stringify({ error: 'Wallet not found' }),
        { status: 404 }
      );
    }

    return HttpResponse.json({
      memberId: mockWallet.memberId,
      currentPoints: mockWallet.currentPoints,
      currentCoins: mockWallet.currentCoins,
    });
  }),

  // 환전 처리 핸들러
  http.post('/api/v1/wallet/exchange', async ({ request }) => {
    const body = await request.json() as { pointsExchanged: number };

    console.log('MSW: Exchange request:', body);

    if (!body.pointsExchanged || body.pointsExchanged % 100 !== 0 || body.pointsExchanged < 100) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid exchange amount. Must be multiples of 100.' }),
        { status: 400 }
      );
    }

    if (mockWallet.currentPoints < body.pointsExchanged) {
      return new HttpResponse(
        JSON.stringify({ error: 'Insufficient points for exchange.' }),
        { status: 400 }
      );
    }

    // 환전 처리
    mockWallet.currentPoints -= body.pointsExchanged;
    mockWallet.currentCoins += body.pointsExchanged / 100;

    mockTransactions.push({
      memberId: mockWallet.memberId,
      transactionType: 'EXCHANGED',
      gameType: 'CARD_FLIP', // Placeholder as gameType is not applicable here
      points: body.pointsExchanged,
      isWin: false, // Placeholder as this is not a game transaction
      createdAt: new Date().toISOString(),
    });

    console.log('MSW: Exchange successful. Updated wallet:', mockWallet);

    return HttpResponse.json({
      memberId: mockWallet.memberId,
      currentPoints: mockWallet.currentPoints,
      currentCoins: mockWallet.currentCoins,
    });
  }),

  // 미니게임 포인트 처리 핸들러
  http.post('/api/v1/wallet/minigame', async ({ request }) => {
    const body = await request.json() as MiniGameTransaction;

    console.log('MSW: Mini-game request received:', body);

    if (!body.gameType || typeof body.isWin !== 'boolean' || body.points < 0) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid mini-game request.' }),
        { status: 400 }
      );
    }

    const transactionType: TransactionType = body.isWin ? 'EARNED' : 'MAINTAINED';

    if (transactionType === 'EARNED') {
      mockWallet.currentPoints += body.points;
    }

    mockTransactions.push({
      memberId: mockWallet.memberId,
      transactionType,
      gameType: body.gameType,
      points: body.points,
      isWin: body.isWin,
      createdAt: new Date().toISOString(),
    });

    console.log('MSW: Mini-game processed. Updated wallet:', mockWallet);

    return HttpResponse.json({
      memberId: mockWallet.memberId,
      currentPoints: mockWallet.currentPoints,
      currentCoins: mockWallet.currentCoins,
    });
  }),
];
