import { http, HttpResponse } from 'msw';
import { WordQuizRequest, WordQuizResponse } from '@/features/minigame/wordquizgame/types/wordTypes';

let sessionGameState: WordQuizResponse | null = null;

// Mock 데이터: JSON에서 불러온 원본 데이터
const mockQuestions = [
  {
    word: '증권',
    explanation: '금전적 가치가 있는 문서로서 주식이나 채권 등 재산적 가치를 지닌 권리를 표시하는 이 용어는 무엇일까요?',
    hint: "앞글자 '증'",
  },
  {
    word: '주식',
    explanation: '기업의 자본을 이루는 균등한 단위로 회사의 소유권을 나타내는 증서이며 주주총회에서 의결권을 행사할 수 있게 하는 이 용어는 무엇일까요?',
    hint: "앞글자 '주'",
  },
  // 추가 데이터...
];

// 난이도별 플레이 가능 여부
const playAvailability = {
  isEasyPlayAvailable: true,
  isNormalPlayAvailable: true,
  isHardPlayAvailable: false,
};

// Handlers
export const wordQuizGameHandlers = [
  // 난이도별 플레이 가능 여부 확인
  http.get('/api/v1/word-quiz/availability', () => {
    console.log('MSW: Checking word quiz availability');
    return HttpResponse.json(playAvailability);
  }),

  // 게임 시작 또는 이어하기
  http.get('/api/v1/word-quiz/:difficulty', ({ params }) => {
    const difficulty = params.difficulty as 'EASY' | 'NORMAL' | 'HARD';

    // 난이도 유효성 검사
    if (!['EASY', 'NORMAL', 'HARD'].includes(difficulty)) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid difficulty' }),
        { status: 400 }
      );
    }

    // 플레이 가능 여부 확인
    if (!playAvailability[`is${difficulty}PlayAvailable` as keyof typeof playAvailability]) {
      return new HttpResponse(
        JSON.stringify({ error: `Daily play limit exceeded for ${difficulty} difficulty` }),
        { status: 403 }
      );
    }

    // 세션 초기화 또는 기존 세션 반환
    if (!sessionGameState) {
      const randomIndex = Math.floor(Math.random() * mockQuestions.length);
      const question = mockQuestions[randomIndex];

      sessionGameState = {
        ...question,
        currentPhase: 1,
        remainLife: 3,
        difficulty,
      };
    }

    return HttpResponse.json(sessionGameState);
  }),

  // 답안 제출
  http.post('/api/v1/word-quiz/submissions', async ({ request }) => {
    const body = (await request.json()) as WordQuizRequest;


    if (!sessionGameState) {
      return new HttpResponse(
        JSON.stringify({ error: 'Game state not initialized.' }),
        { status: 400 }
      );
    }

    if (body.isCorrect) {
      if (sessionGameState.currentPhase < 3) {
        sessionGameState.currentPhase += 1;
      } else {
        // 게임 완료 시 세션 초기화
        sessionGameState = null;
        return HttpResponse.json({ message: 'Game completed' });
      }
    } else {
      sessionGameState.remainLife -= 1;
      if (sessionGameState.remainLife <= 0) {
        sessionGameState = null; // 생명 소진 시 게임 종료
        return HttpResponse.json({ message: 'Game over' });
      }
    }

    return HttpResponse.json(sessionGameState);
  }),
];
