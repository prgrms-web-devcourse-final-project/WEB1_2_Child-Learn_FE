// 포인트 관련 데이터
export interface Point {
    pointId?: number; // 포인트 번호
    currentPoints: number; // 현재 포인트 잔액
    updatedAt?: string; // 업데이트 날짜
    memberId?: number; // 회원 번호
  }