// 코인 관련 데이터
export interface Coin {
    coinId?: number; // 코인 번호
    currentCoins: number; // 현재 코인 잔액
    updatedAt?: string; // 업데이트 날짜
    memberId?: number; // 회원 번호
  }