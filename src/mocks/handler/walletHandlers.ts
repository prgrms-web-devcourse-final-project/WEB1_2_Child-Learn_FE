import { http, HttpResponse } from 'msw';
import { MiniGameTransaction, Wallet, PointType, PointTransaction } from '@/features/minigame/points/types/pointTypes';
// Mock 데이터
let mockWallet: Wallet = {
  memberId: 3,
  currentPoints: 5000,
  currentCoins: 50,
};

export const mockPointDetails: PointTransaction[] = [
  {
    id: 1,
    memberId: 3,
    transactionType: 'EARNED',
    points: 100,
    pointType: 'GAME',
    subType: 'MINIGAME',
    description: '카드 뒤집기 성공',
    createdAt: '2024-12-04T10:00:00',
  },
  {
    id: 2,
    memberId: 3,
    transactionType: 'EARNED',
    points: 50,
    pointType: 'GAME',
    subType: 'MINIGAME',
    description: 'OX 퀴즈 성공',
    createdAt: '2024-12-04T12:00:00',
  },
];

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
    const body = await request.json() as { memberId: number; pointsExchanged: number };

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

    console.log('MSW: Exchange successful. Updated wallet:', mockWallet);

    return HttpResponse.json({
      memberId: mockWallet.memberId,
      currentPoints: mockWallet.currentPoints,
      currentCoins: mockWallet.currentCoins,
    });
  }),

  // 미니게임 포인트 처리 핸들러
  http.post('/api/v1/wallet/game', async ({ request }) => {
    const body = await request.json() as MiniGameTransaction;
  
    console.log('MSW: Mini-game request received:', body);
  
    if (!body.gameType || typeof body.isWin !== 'boolean' || body.points < 0) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid mini-game request.' }),
        { status: 400 }
      );
    }
  
    if (body.isWin) {
      mockWallet.currentPoints += body.points;
    }
  
    mockTransactions.push({
      memberId: mockWallet.memberId,
      gameType: body.gameType,
      points: body.points,
      pointType: 'GAME',
      isWin: body.isWin,
    });
  
    console.log('MSW: Mini-game processed. Updated wallet:', mockWallet);
  
    return HttpResponse.json({
      currentPoints: mockWallet.currentPoints,
      currentCoins: mockWallet.currentCoins,
    });
  }),  

  // 포인트 유형별 기록 조회 핸들러
  http.post('/api/v1/wallet/history/point-type', async ({ request }) => {
    const body = await request.json() as { memberId: number; pointType: PointType };

    console.log('MSW: Point type history request received:', body);

    // 요청 데이터 유효성 검사
    if (!body.memberId || !body.pointType) {
      return new HttpResponse(
        JSON.stringify({ error: 'Member ID and pointType are required.' }),
        { status: 400 }
      );
    }

    const filteredData = mockPointDetails.filter(
      (item) => item.memberId === body.memberId && item.pointType === body.pointType
    );  

    console.log('MSW: Filtered point type history:', filteredData);

    return HttpResponse.json(filteredData);
  }),
];
