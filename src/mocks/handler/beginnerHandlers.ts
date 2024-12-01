// mocks/handler/beginUserHandlers.ts
import { http } from 'msw';

const BASE_URL = '/api/v1';

// 초기 모의 데이터
const mockStockData = {
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

// 요청 본문 타입 정의
interface SubmissionBody {
  answer: string;
}

export const beginUserHandlers = [
  // GET: 초급 그래프 데이터 조회
  http.get(`${BASE_URL}/begin-stocks`, () => {
    return new Response(
      JSON.stringify(mockStockData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }),

  // POST: 사용자 답변 제출
  http.post(`${BASE_URL}/begin-stocks/submissions`, async ({ request }) => {
    const { answer } = await request.json() as SubmissionBody;
    
    const isCorrect = answer === mockStockData.quiz[0].answer;
    
    return new Response(
      JSON.stringify({
        success: true,
        message: isCorrect ? '정답입니다!' : '틀렸습니다.',
        correct: isCorrect
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  })
];