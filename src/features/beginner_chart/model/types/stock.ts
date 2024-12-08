import { BeginQuiz } from './quiz';

export interface BeginStockPriceResponse {
  tradeDay: string;  // "월", "화", "수", "목", "금", "토", "일"
  price: number;     // 주식 가격
}

export interface BeginStockResponse {
  stockData: BeginStockPriceResponse[];
  quiz: BeginQuiz[];
}

// 포인트 관련 타입 추가
export interface PointRequest {
  transactionType: 'BEGIN' | 'MID' | 'ADVANCE';
  points: number;
  pointType: 'STOCK';
  stockType: 'BEGIN' | 'MID' | 'ADVANCE';
  stockName: string;
}

export interface PointResponse {
  memberId: number;
  currentPoints: number;
  currentCoins: number;
}
