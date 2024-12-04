import { http, HttpResponse } from 'msw';

interface WordQuizQuestion {
  word: string;
  explanation: string;
  hint: string;
  currentPhase: number;
  remainLife: number;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
}

// Mock 데이터
const mockQuestions: Record<string, WordQuizQuestion[]> = {
    EASY: [
      {
        word: '매출',
        explanation: '기업이 상품이나 서비스를 판매하여 얻은 총수입으로 기업의 영업 규모를 나타내는 이것은 무엇일까요?',
        hint: '한 글자: 매',
        currentPhase: 1,
        remainLife: 3,
        difficulty: 'EASY',
      },
      {
        word: '시장',
        explanation: '상품과 서비스가 거래되는 장소나 공간을 뜻합니다.',
        hint: '한 글자: 시',
        currentPhase: 1,
        remainLife: 3,
        difficulty: 'EASY',
      },
      {
        word: '저축',
        explanation: '소득의 일부를 소비하지 않고 미래를 위해 모아두는 것을 뜻합니다.',
        hint: '한 글자: 저',
        currentPhase: 1,
        remainLife: 3,
        difficulty: 'EASY',
      },
    ],
    NORMAL: [
      {
        word: '자산',
        explanation: '기업이 소유한 모든 경제적 가치의 총합으로, 현금, 부동산, 상품 등이 이에 해당됩니다.',
        hint: '두 글자: 자산',
        currentPhase: 2,
        remainLife: 3,
        difficulty: 'NORMAL',
      },
      {
        word: '수익',
        explanation: '사업 활동을 통해 얻게 되는 순이익을 의미합니다.',
        hint: '두 글자: 수익',
        currentPhase: 2,
        remainLife: 3,
        difficulty: 'NORMAL',
      },
      {
        word: '주식',
        explanation: '기업의 지분을 나타내며, 투자자가 소유권을 가지게 되는 금융 상품입니다.',
        hint: '두 글자: 주식',
        currentPhase: 2,
        remainLife: 3,
        difficulty: 'NORMAL',
      },
    ],
    HARD: [
      {
        word: '유동자산',
        explanation: '1년 이내에 현금화가 가능한 자산으로, 재고, 현금 등이 포함됩니다.',
        hint: '세 글자: 유동',
        currentPhase: 3,
        remainLife: 3,
        difficulty: 'HARD',
      },
      {
        word: '재무제표',
        explanation: '기업의 재무 상태와 성과를 보여주는 문서로, 손익계산서와 대차대조표가 포함됩니다.',
        hint: '세 글자: 재무',
        currentPhase: 3,
        remainLife: 3,
        difficulty: 'HARD',
      },
      {
        word: '지급능력',
        explanation: '기업이 단기 부채를 상환할 수 있는 능력을 나타내는 지표입니다.',
        hint: '세 글자: 지급',
        currentPhase: 3,
        remainLife: 3,
        difficulty: 'HARD',
      },
    ],
  };  

// Handlers
export const wordQuizGameHandlers = [
  // 난이도별 플레이 가능 여부 확인
  http.get('/api/v1/word-quiz/availability', () => {
    console.log('MSW: Checking word quiz availability');
    return HttpResponse.json({
      isEasyPlayAvailable: true,
      isNormalPlayAvailable: false,
      isHardPlayAvailable: false,
    });
  }),

  // 난이도별 퀴즈 조회
  http.get('/api/v1/word-quiz/difficulty', async ({ request }) => {
    const url = new URL(request.url);
    const difficulty = new URL(url).searchParams.get('difficulty')?.toUpperCase();

    console.log(`MSW: Fetching word quiz for difficulty: ${difficulty}`);

    if (!difficulty || !['EASY', 'NORMAL', 'HARD'].includes(difficulty)) {
      return new HttpResponse(
        JSON.stringify({
          error: 'Invalid difficulty. Allowed values are EASY, NORMAL, HARD.',
        }),
        { status: 400 }
      );
    }

    const questions = mockQuestions[difficulty]; 
    return HttpResponse.json(questions);
  }),

  // 답안 제출
  http.post('/api/v1/word-quiz/submissions', async ({ request }) => {
    const body = await request.json() as { isCorrect: boolean };

    console.log(`MSW: Answer submission: isCorrect: ${body.isCorrect}`);

    if (typeof body.isCorrect !== 'boolean') {
      return new HttpResponse(
        JSON.stringify({ error: 'isCorrect field is required and must be a boolean.' }),
        { status: 400 }
      );
    }

    // Mock 응답 처리
    const question = mockQuestions.EASY[0]; // 임의로 EASY 데이터 사용

    if (body.isCorrect) {
      return HttpResponse.json({
        ...question,
        currentPhase: question.currentPhase + 1,
        remainLife: question.remainLife,
      });
    } else {
      return HttpResponse.json({
        ...question,
        remainLife: question.remainLife - 1,
      });
    }
  }),
];