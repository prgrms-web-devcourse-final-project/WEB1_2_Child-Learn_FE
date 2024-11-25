// 환전 내역 관련 데이터
export interface ExchangeDetails {
    exchangeId: number; // 환전 기록 번호
    memberId: number; // 회원 번호
    pointsExchanged: number; // 환전한 포인트
    coinsReceived: number; // 받은 코인
    createdAt: string; // 환전 일시
  }