import { http, HttpResponse } from 'msw';
import { WordQuizRequest, WordQuizResponse } from '@/features/minigame/wordquizgame/types/wordTypes';

let sessionGameState: WordQuizResponse | null = null;

// Mock 데이터: JSON에서 불러온 원본 데이터
const mockQuestions = [
    {
        word: "증권",
        explanation: "금전적 가치가 있는 문서로서 주식이나 채권 등 재산적 가치를 지닌 권리를 표시하는 이 용어는 무엇일까요?",
        hint: "앞글자 '증'"
      },
      {
        word: "주식",
        explanation: "기업의 자본을 이루는 균등한 단위로 회사의 소유권을 나타내는 증서이며 주주총회에서 의결권을 행사할 수 있게 하는 이 용어는 무엇일까요?",
        hint: "앞글자 '주'"
      },
      {
        word: "주가",
        explanation: "증권시장에서 주식이 거래되는 가격으로 기업의 가치와 시장의 수요공급에 따라 변동하는 이 용어는 무엇일까요?",
        hint: "앞글자 '주'"
      },
      {
        word: "상장",
        explanation: "기업이 발행한 주식을 증권거래소에 등록하여 일반 투자자들이 자유롭게 거래할 수 있도록 하는 이 절차는 무엇일까요?",
        hint: "앞글자 '상'"
      },
      {
        word: "배당",
        explanation: "기업이 영업활동을 통해 얻은 이익의 일부를 주주들에게 분배하는 이 행위는 무엇일까요?",
        hint: "앞글자 '배'"
      },
      {
        word: "주주",
        explanation: "주식을 보유하고 있어 회사의 소유권을 가지며 의결권을 행사할 수 있는 사람을 가리키는 이 용어는 무엇일까요?",
        hint: "앞글자 '주'"
      },
      {
        word: "저축",
        explanation: "미래를 위해 현재의 소비를 줄이고 돈을 모아두는 기본적인 재테크 방법으로 이자 수익을 얻을 수 있는 이것은 무엇일까요?",
        hint: "앞글자 '저'"
      },
      {
        word: "은행",
        explanation: "예금을 받고 대출을 해주며 금융 거래의 중심이 되는 기관으로 돈을 안전하게 보관하고 운용하는 이곳은 어디일까요?",
        hint: "앞글자 '은'"
      },
      {
        word: "적금",
        explanation: "매월 일정액을 정기적으로 납입하여 만기에 원금과 이자를 함께 받는 저축 상품으로 계획적인 저축이 가능한 이것은 무엇일까요?",
        hint: "앞글자 '적'"
      },
];

// Handlers
export const wordQuizGameHandlers = [
  // 난이도별 플레이 가능 여부 확인
  http.get('/api/v1/word-quiz/availability', () => {
    console.log('MSW: Checking word quiz availability');
    return HttpResponse.json({isEasyPlayAvailable: true,
        isNormalPlayAvailable: true,
        isHardPlayAvailable: true});
  }),

  // 게임 시작
  http.get('/api/v1/word-quiz/:difficulty', ({ params }) => {
    const difficulty = params.difficulty as 'EASY' | 'NORMAL' | 'HARD';

    // 난이도 유효성 검사
    if (!['EASY', 'NORMAL', 'HARD'].includes(difficulty)) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid difficulty' }),
        { status: 400 }
      );
    }

    
      const randomIndex = Math.floor(Math.random() * mockQuestions.length);
      const question = mockQuestions[randomIndex];

      sessionGameState = {
        word: question.word,
        explanation: question.explanation,
        hint: question.hint,
        currentPhase: 1,
        remainLife: 3,
        difficulty,
      };

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
