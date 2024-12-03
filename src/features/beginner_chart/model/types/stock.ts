import { BeginQuiz } from '@/features/beginner_chart/model/types/quiz';

export interface BeginStockPriceResponse {
  tradeDay: string;  // "월", "화", "수", "목", "금", "토", "일"
  price: number;     // 주식 가격
}

export interface BeginStockResponse {
  stockData: BeginStockPriceResponse[];
  quiz: BeginQuiz[];
}