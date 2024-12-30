// src/mocks/handlers/beginnerHandlers.ts
import { http, HttpResponse, delay } from 'msw';
import { API_CONFIG } from '@/shared/config';

// 타입 정의
interface StockData {
  tradeDay: string;
  price: number;
}

interface Quiz {
  content: string;
  oContent: string;
  xContent: string;
  answer: string;
}

interface BeginStockResponse {
  stockData: StockData[];
  quiz: Quiz[];
}

interface SubmissionRequest {
  answer: string;
}

interface PointRequest {
  memberId: number;
  transactionType: string;
  points: number;
  pointType: string;
  stockType: string;
  stockName: string;
}

interface SubmissionResponse {
  success: boolean;
  message: string;
  isCorrect: boolean;
  points?: number;
}

interface PointResponse {
  id: number;
  currentPoints: number;
  currentCoins: number;
  success: boolean;
  message: string;
}

// Mock 데이터
const mockStockData: BeginStockResponse = {
  stockData: [
    { tradeDay: "화", price: 600 },
    { tradeDay: "수", price: 500 },
    { tradeDay: "목", price: 400 },
    { tradeDay: "금", price: 300 },
    { tradeDay: "토", price: 400 },
    { tradeDay: "일", price: 300 },
    { tradeDay: "월", price: 600 }
  ],
  quiz: [
    {
      content: "이 주식은 일주일 동안 가격이 일정하게 유지되었는가?",
      oContent: "O: 금요일과 일요일의 가격이 같다.",
      xContent: "X: 수요일과 토요일의 가격이 같다.",
      answer: "X"
    }
  ]
};

// 사용자 포인트 저장소
let userPoints: { [key: number]: number } = {};

export const beginUserHandlers = [
  // GET: 초급 그래프 데이터 및 퀴즈 조회
  http.get(`${API_CONFIG.baseURL}/begin-stocks`, async () => {
    await delay(300);
    return HttpResponse.json(mockStockData);
  }),

  // POST: 퀴즈 답변 제출
  http.post(`${API_CONFIG.baseURL}/begin-stocks/submissions`, async ({ request }) => {
    await delay(500);
    const { answer } = await request.json() as SubmissionRequest;
    const correctAnswer = mockStockData.quiz[0].answer;
    const isCorrect = answer === correctAnswer;
    
    console.log('Answer submitted:', { answer, correctAnswer, isCorrect }); // 디버깅용
    
    const response: SubmissionResponse = {
      success: true,
      message: isCorrect 
        ? '정답입니다!' // 정답인 경우
        : '오답입니다! 내일 다시 도전해 주세요', // 오답인 경우
      isCorrect,
      points: isCorrect ? 100 : 0
    };
    
    return HttpResponse.json(response);
  }),

  // POST: 포인트 적립
  http.post(`${API_CONFIG.baseURL}/wallet/stock`, async ({ request }) => {
    await delay(300);
    const body = await request.json() as PointRequest;
    const { memberId, points } = body;
    
    userPoints[memberId] = (userPoints[memberId] || 0) + points;

    const response: PointResponse = {
      id: memberId,
      currentPoints: userPoints[memberId],
      currentCoins: 35,
      success: true,
      message: '포인트가 성공적으로 적립되었습니다.'
    };

    return HttpResponse.json(response);
  }),

  // GET: 포인트 조회
  http.get(`${API_CONFIG.baseURL}/wallet/stock`, async () => {
    await delay(200);
    const memberId = Number(localStorage.getItem('memberId')) || 1;
    
    return HttpResponse.json({
      id: memberId,
      currentPoints: userPoints[memberId] || 0,
      currentCoins: 35
    });
  })
];

// 테스트를 위한 포인트 초기화 함수
export const resetPoints = () => {
  userPoints = {};
};