import { http, HttpResponse } from 'msw';
import { QuizRequestDto, QuizResponseDto, QuizAnswerRequestDto, QuizAnswerResponseDto } from '@/features/minigame/oxquizgame/types/oxTypes';

const mockQuizzes = [
    {
      id: 1,
      question: '사과를 사고팔 때 사용하는 돈을 화폐라고 한다.',
      answer: 'O',
      explanation: '화폐는 물건을 사고팔 때 사용하는 공식적인 돈입니다.',
      difficulty: 'easy',
    },
    {
      id: 2,
      question: '저금통에 돈을 모으는 것은 소비라고 한다.',
      answer: 'X',
      explanation: '저금통에 돈을 모으는 것은 소비가 아니라 저축입니다.',
      difficulty: 'easy',
    },
    {
      id: 3,
      question: '은행에 돈을 맡기면 이자를 받을 수 있다.',
      answer: 'O',
      explanation: '은행은 맡긴 돈에 대해 약속된 이자를 지급합니다.',
      difficulty: 'easy',
    },
    {
      id: 4,
      question: '돈은 나무에서 자란다.',
      answer: 'X',
      explanation: '돈은 나무에서 자라는 것이 아니라 중앙은행에서 만들어집니다.',
      difficulty: 'easy',
    },
    {
      id: 5,
      question: '가게에서 물건을 파는 사람은 판매자라고 부른다.',
      answer: 'O',
      explanation: '물건을 파는 사람은 판매자, 사는 사람은 소비자라고 합니다.',
      difficulty: 'easy',
    },
    {
      id: 6,
      question: '물건의 가격은 항상 변하지 않는다.',
      answer: 'X',
      explanation: '물건의 가격은 수요와 공급에 따라 변할 수 있습니다.',
      difficulty: 'medium',
    },
    {
      id: 7,
      question: '사람들이 물건을 많이 사면 물건의 가격이 떨어진다.',
      answer: 'X',
      explanation: '사람들이 많이 사면 수요가 증가하여 가격이 오를 가능성이 큽니다.',
      difficulty: 'medium',
    },
    {
      id: 8,
      question: '주식은 회사의 조각을 소유한다는 의미이다.',
      answer: 'O',
      explanation: '주식은 회사의 소유권 일부를 나타냅니다.',
      difficulty: 'medium',
    },
    {
      id: 9,
      question: '카드로 결제하면 항상 이자가 붙는다.',
      answer: 'X',
      explanation: '일부 카드 결제는 이자가 붙지 않지만, 신용카드 연체 시 이자가 발생합니다.',
      difficulty: 'medium',
    },
    {
      id: 10,
      question: '화폐는 항상 금속으로 만들어져야 한다.',
      answer: 'X',
      explanation: '화폐는 금속, 종이, 디지털 형태로 존재할 수 있습니다.',
      difficulty: 'medium',
    },
    {
      id: 11,
      question: '가계부는 수입과 지출을 기록하는 도구이다.',
      answer: 'O',
      explanation: '가계부는 가정의 재정을 관리하기 위해 사용됩니다.',
      difficulty: 'hard',
    },
    {
      id: 12,
      question: '대출은 돈을 빌리는 것을 의미한다.',
      answer: 'O',
      explanation: '대출은 금융 기관으로부터 돈을 빌리는 행위를 뜻합니다.',
      difficulty: 'hard',
    },
    {
      id: 13,
      question: '이자는 빌린 돈에 대해 추가로 지불해야 하는 금액이다.',
      answer: 'O',
      explanation: '이자는 빌린 돈에 대해 지불하는 대가입니다.',
      difficulty: 'hard',
    },
    {
      id: 14,
      question: '금융 시장은 항상 안정적이다.',
      answer: 'X',
      explanation: '금융 시장은 경제 상황과 다양한 요인에 따라 변동합니다.',
      difficulty: 'hard',
    },
    {
      id: 15,
      question: '보험은 미래의 불확실한 위험에 대비하는 것이다.',
      answer: 'O',
      explanation: '보험은 예기치 못한 사건에 대비하는 재정적 도구입니다.',
      difficulty: 'hard',
    },
    {
      id: 16,
      question: '소비는 돈을 벌 때 사용하는 활동을 의미한다.',
      answer: 'X',
      explanation: '소비는 재화나 서비스를 구매하는 행위를 뜻합니다.',
      difficulty: 'easy',
    },
    {
      id: 17,
      question: '금융 기관은 항상 무료로 서비스를 제공한다.',
      answer: 'X',
      explanation: '금융 기관은 보통 수수료나 이자 형태로 비용을 부과합니다.',
      difficulty: 'medium',
    },
    {
      id: 18,
      question: '복리 이자는 단리 이자보다 더 빨리 증가한다.',
      answer: 'O',
      explanation: '복리 이자는 원금과 이자가 함께 이자를 발생시켜 더 빠르게 증가합니다.',
      difficulty: 'hard',
    },
  ];  

// Handlers
export const oxQuizHandlers = [
  // 퀴즈 시작 핸들러
  http.post('/api/v1/ox-quiz-progression/start', async ({ request }) => {
    const { memberId, difficulty } = (await request.json()) as QuizRequestDto;
    console.log(`Received quiz start request: memberId=${memberId}, difficulty=${difficulty}`);

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return HttpResponse.json(
        {
          message: 'Invalid difficulty parameter. Use "easy", "medium", or "hard".',
        },
        { status: 400 }
      );
    }

    const filteredQuizzes = mockQuizzes.filter((quiz) => quiz.difficulty === difficulty);
    const selectedQuizzes = filteredQuizzes.slice(0, 3).map((quiz) => ({
      oxQuizDataId: quiz.id,
      question: quiz.question,
      difficulty: quiz.difficulty,
    }));

    return HttpResponse.json(selectedQuizzes, { status: 200 });
  }),

  // 답안 제출 핸들러
  http.post('/api/v1/ox-quiz-progression/:oxQuizDataId', async ({ params, request }) => {
    const { oxQuizDataId } = params;
    const { userAnswer } = (await request.json()) as QuizAnswerRequestDto;

    const quiz = mockQuizzes.find((q) => q.id === Number(oxQuizDataId));
    if (!quiz) {
      return HttpResponse.json(
        {
          message: 'Quiz not found.',
        },
        { status: 404 }
      );
    }

    if (!['O', 'X'].includes(userAnswer)) {
      return HttpResponse.json(
        {
          message: 'Invalid answer. Only "O" or "X" is allowed.',
        },
        { status: 400 }
      );
    }

    const isCorrect = quiz.answer === userAnswer;
    const response: QuizAnswerResponseDto = {
      oxQuizDataId: quiz.id,
      explanation: quiz.explanation,
      isCorrect,
    };

    return HttpResponse.json(response, { status: 200 });
  }),
];
