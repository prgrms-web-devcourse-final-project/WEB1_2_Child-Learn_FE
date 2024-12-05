import { http, HttpResponse } from 'msw';

let sessionGameState: WordQuizQuestion | null = null; // 세션 상태를 관리하는 변수

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
        currentPhase: 2,
        remainLife: 3,
        difficulty: 'EASY',
      },
      {
        word: '저축',
        explanation: '소득의 일부를 소비하지 않고 미래를 위해 모아두는 것을 뜻합니다.',
        hint: '한 글자: 저',
        currentPhase: 3,
        remainLife: 3,
        difficulty: 'EASY',
      },
    ],
    NORMAL: [
      {
        word: '자산',
        explanation: '기업이 소유한 모든 경제적 가치의 총합으로, 현금, 부동산, 상품 등이 이에 해당됩니다.',
        hint: '두 글자: 자산',
        currentPhase: 1,
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
        currentPhase: 3,
        remainLife: 3,
        difficulty: 'NORMAL',
      },
    ],
    HARD: [
      {
        word: '유동자산',
        explanation: '1년 이내에 현금화가 가능한 자산으로, 재고, 현금 등이 포함됩니다.',
        hint: '세 글자: 유동',
        currentPhase: 1,
        remainLife: 3,
        difficulty: 'HARD',
      },
      {
        word: '재무제표',
        explanation: '기업의 재무 상태와 성과를 보여주는 문서로, 손익계산서와 대차대조표가 포함됩니다.',
        hint: '세 글자: 재무',
        currentPhase: 2,
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
      isNormalPlayAvailable: true,
      isHardPlayAvailable: false,
    });
  }),

 // 난이도별 퀴즈 조회 및 게임 시작
 http.get('/api/v1/word-quiz/:difficulty', async ({ params }) => {
    const difficulty = params.difficulty as 'EASY' | 'NORMAL' | 'HARD';

    if (!['EASY', 'NORMAL', 'HARD'].includes(difficulty)) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid difficulty' }),
        { status: 400 }
      );
    }

    // 세션 초기화
    sessionGameState = {
      ...mockQuestions[difficulty][0], // 첫 번째 문제
      difficulty,
    };
    return HttpResponse.json(sessionGameState);
  }),

  // 답안 제출
  http.post('/api/v1/word-quiz/submissions', async ({ request }) => {
    const body = await request.json() as { isCorrect: boolean };

    if (!sessionGameState) {
      return new HttpResponse(
        JSON.stringify({ error: 'Game state not initialized.' }),
        { status: 400 }
      );
    }

    if (body.isCorrect) {
      if (sessionGameState.currentPhase < 3) {
        // 다음 단계로 진행
        const nextPhase = sessionGameState.currentPhase + 1;
        sessionGameState = {
          ...mockQuestions[sessionGameState.difficulty][nextPhase - 1],
          remainLife: sessionGameState.remainLife,
        };
      } else {
        // 마지막 문제 완료
        sessionGameState = null;
        return HttpResponse.json({ message: 'Game completed' });
      }
    } else {
      // 오답 처리
      sessionGameState = {
        ...sessionGameState,
        remainLife: sessionGameState.remainLife - 1,
      };

      if (sessionGameState.remainLife <= 0) {
        sessionGameState = null; // 게임 종료
        return HttpResponse.json({ message: 'Game over' });
      }
    }

    return HttpResponse.json(sessionGameState);
  }),
];