import { http, delay } from 'msw';

// Mock 데이터
const mockCardList = {
  begin: [
    {
        "id": 131,
        "cardTitle": "탄소발자국",
        "cardContent": "우리가 환경에 미치는 영향이에요",
        "cardCategory": "ESG"
    },
    {
        "id": 249,
        "cardTitle": "저작권",
        "cardContent": "창작물의 권리를 보호하는 거예요",
        "cardCategory": "지식재산"
    },
    {
        "id": 230,
        "cardTitle": "멤버십",
        "cardContent": "회원이 되어 특별한 혜택을 받는 거예요",
        "cardCategory": "구독경제"
    },
    {
        "id": 176,
        "cardTitle": "교육비",
        "cardContent": "공부하는데 드는 돈이에요",
        "cardCategory": "교육지원"
    }
  ],
  mid: [
        {
            "id": 129,
            "cardTitle": "재활용",
            "cardContent": "쓰던 물건을 다시 사용하는 거예요",
            "cardCategory": "ESG"
        },
        {
            "id": 194,
            "cardTitle": "가계",
            "cardContent": "한 가족의 살림살이를 말해요",
            "cardCategory": "가족경제"
        },
        {
            "id": 230,
            "cardTitle": "멤버십",
            "cardContent": "회원이 되어 특별한 혜택을 받는 거예요",
            "cardCategory": "구독경제"
        },
        {
            "id": 252,
            "cardTitle": "콘텐츠",
            "cardContent": "영상이나 글 같은 창작물이에요",
            "cardCategory": "지식재산"
        },
        {
            "id": 207,
            "cardTitle": "숙박비",
            "cardContent": "여행가서 잠자는 곳에 내는 돈이에요",
            "cardCategory": "여행경제"
        },
        {
            "id": 234,
            "cardTitle": "Family",
            "cardContent": "가족을 영어로 하면 이거예요",
            "cardCategory": "영어"
        }
    ],
    advanced: [
        {
            "id": 127,
            "cardTitle": "QR코드",
            "cardContent": "카메라로 찍어서 돈을 내는 특별한 그림이에요",
            "cardCategory": "디지털금융"
        },
        {
            "id": 1,
            "cardTitle": "주식",
            "cardContent": "회사의 조그마한 조각을 가지고 있다는 종이예요",
            "cardCategory": "투자"
        },
        {
            "id": 12,
            "cardTitle": "신용",
            "cardContent": "약속을 잘 지키는 것이에요",
            "cardCategory": "금융"
        },
        {
            "id": 5,
            "cardTitle": "배당",
            "cardContent": "회사가 번 돈을 주식 가진 사람들에게 나눠주는 것이에요",
            "cardCategory": "투자"
        },
        {
            "id": 147,
            "cardTitle": "크리에이터",
            "cardContent": "영상이나 콘텐츠를 만들어서 돈을 버는 사람이에요",
            "cardCategory": "수익창출"
        },
        {
            "id": 19,
            "cardTitle": "곱하기",
            "cardContent": "같은 수를 여러 번 더하는 마법이에요",
            "cardCategory": "수학"
        },
        {
            "id": 188,
            "cardTitle": "할인앱",
            "cardContent": "싸게 살 수 있는 곳을 알려주는 앱이에요",
            "cardCategory": "금융앱"
        },
        {
            "id": 233,
            "cardTitle": "구독서비스",
            "cardContent": "계속해서 받아보는 서비스예요",
            "cardCategory": "구독경제"
        }
    ]
};

const mockDifficultyAvailability = {
  isBegin: true,
  isMid: true,
  isAdv: false,
};

// Handlers
export const flipCardGameHandlers = [
    // 카드 목록 조회
    http.get('/api/v1/flip-card/:level', async ({ params }) => {
      const difficulty = params.level as keyof typeof mockCardList; // Path parameter로 난이도 접근
      await delay(300);
  
      if (!difficulty || !mockCardList[difficulty]) {
        return new Response(
          JSON.stringify({
            message: 'Invalid difficulty parameter. Use "begin", "mid", or "adv".',
            error: 'INVALID_DIFFICULTY',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
  
      return new Response(JSON.stringify(mockCardList[difficulty]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }),
  ];
  
  // 난이도별 가능 여부 확인
  http.get('/api/v1/flip-card/available', async ({ request }) => {
    const authorization = request.headers.get('Authorization');
    await delay(200);

    if (!authorization || !authorization.startsWith('Bearer')) {
      return new Response(
        JSON.stringify({
          message: 'Unauthorized access.',
          error: 'UNAUTHORIZED',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(JSON.stringify(mockDifficultyAvailability), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // 난이도별 마지막 플레이 타임 갱신
  http.put('/api/v1/flip-card/:memberId/:difficulty', async ({ params }) => {
    const { memberId, difficulty } = params as { memberId: string; difficulty: string };
    await delay(200);
  
    if (!memberId || !difficulty) {
      return new Response(
        JSON.stringify({
          message: 'Member ID and difficulty are required.',
          error: 'MISSING_PARAMETERS',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  
    if (!['begin', 'mid', 'adv'].includes(difficulty)) {
      return new Response(
        JSON.stringify({
          message: 'Invalid difficulty. Use "begin", "mid", or "adv".',
          error: 'INVALID_DIFFICULTY',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  
    return new Response(
      JSON.stringify({
        message: `Last play time updated for member ${memberId} on difficulty ${difficulty}.`,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });  