import { http, delay } from 'msw';
import { Card } from '@/features/minigame/flipcardgame/types/cardTypes';

// 변환 로직
const convertCardData = (data: any[]): Card[] => {
  return data.map(item => ({
    card_id: item.id, // JSON 데이터의 "id"를 "card_id"로 매핑
    card_title: item.cardTitle,
    card_content: item.cardContent,
    card_category: item.cardCategory,
  }));
};

// 배열을 섞는 유틸리티 함수
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

// JSON 데이터
const jsonData = [
  {
    id: 127,
    cardTitle: "QR코드",
    cardContent: "카메라로 찍어서 돈을 내는 특별한 그림이에요",
    cardCategory: "디지털금융",
  },
  {
    id: 1,
    cardTitle: "주식",
    cardContent: "회사의 조그마한 조각을 가지고 있다는 종이예요",
    cardCategory: "투자",
  },
  {
    id: 12,
    cardTitle: "신용",
    cardContent: "약속을 잘 지키는 것이에요",
    cardCategory: "금융",
  },
  {
    id: 5,
    cardTitle: "배당",
    cardContent: "회사가 번 돈을 주식 가진 사람들에게 나눠주는 것이에요",
    cardCategory: "투자",
  },
  {
    id: 147,
    cardTitle: "크리에이터",
    cardContent: "영상이나 콘텐츠를 만들어서 돈을 버는 사람이에요",
    cardCategory: "수익창출",
  },
  {
    id: 19,
    cardTitle: "곱하기",
    cardContent: "같은 수를 여러 번 더하는 마법이에요",
    cardCategory: "수학",
  },
  {
    id: 188,
    cardTitle: "할인앱",
    cardContent: "싸게 살 수 있는 곳을 알려주는 앱이에요",
    cardCategory: "금융앱",
  },
  {
    id: 233,
    cardTitle: "구독서비스",
    cardContent: "계속해서 받아보는 서비스예요",
    cardCategory: "구독경제",
  },
];

// 변환된 데이터 가져오기
const convertedData = convertCardData(jsonData);
  // 데이터를 랜덤으로 섞음
const shuffledCards = shuffleArray(convertedData);

// 난이도별 가능 여부 Mock 데이터
const mockDifficultyAvailability = {
  isBegin: true,
  isMid: true,
  isAdv: true,
};

// 난이도별 마지막 플레이 타임 Mock 데이터
const loadLastPlayTimesFromStorage = (): Record<string, Record<string, string | null>> => {
  const data = localStorage.getItem('lastPlayTimes');
  return data ? JSON.parse(data) : {};
};

const saveLastPlayTimesToStorage = (lastPlayTimes: Record<string, Record<string, string | null>>) => {
  localStorage.setItem('lastPlayTimes', JSON.stringify(lastPlayTimes));
};

let lastPlayTimes = loadLastPlayTimesFromStorage();

// 마지막 초기화 날짜
let lastResetDate = localStorage.getItem('lastResetDate') || new Date().toISOString().split('T')[0];

// 날짜 기반 초기화 함수
const resetAvailabilityIfNeeded = () => {
  const today = new Date().toISOString().split('T')[0];
  if (lastResetDate !== today) {
    // 새 날이 되면 초기화
    mockDifficultyAvailability.isBegin = true;
    mockDifficultyAvailability.isMid = true;
    mockDifficultyAvailability.isAdv = true;

    // 초기화 후 마지막 초기화 날짜 갱신
    lastResetDate = today;
    localStorage.setItem('lastResetDate', today);

    // 마지막 플레이 타임 초기화
    lastPlayTimes = {};
    saveLastPlayTimesToStorage(lastPlayTimes);
  }
};

// 난이도별 가능 여부 계산 함수
const calculateAvailability = (memberId: string): Record<string, boolean> => {
  const today = new Date().toISOString().split('T')[0];
  const memberLastPlayTimes = lastPlayTimes[memberId] || { begin: null, mid: null, adv: null };

  return {
    isBegin: !(memberLastPlayTimes.begin && memberLastPlayTimes.begin.startsWith(today)),
    isMid: !(memberLastPlayTimes.mid && memberLastPlayTimes.mid.startsWith(today)),
    isAdv: !(memberLastPlayTimes.adv && memberLastPlayTimes.adv.startsWith(today)),
  };
};

// Handlers
export const flipCardGameHandlers = [
http.get('/api/v1/flip-card', async ({ request }) => {
  const url = new URL(request.url);
  const difficulty = url.searchParams.get('difficulty');

  console.log('Full URL:', url.href); 
  console.log('Requested difficulty:', difficulty);

  if (!difficulty || !['begin', 'mid', 'adv'].includes(difficulty)) {
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

  let filteredCards: Card[] = [];
    if (difficulty === 'begin') {
      filteredCards = shuffledCards.slice(0, 4); // 쉬운 난이도
    } else if (difficulty === 'mid') {
      filteredCards = shuffledCards.slice(0, 6); // 중간 난이도
    } else if (difficulty === 'adv') {
      filteredCards = shuffledCards.slice(0, 8); // 어려운 난이도
    }

  return new Response(JSON.stringify(filteredCards), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}),

 // 난이도별 가능 여부 확인
 http.get('/api/v1/flip-card/available', async ({ request }) => {
  resetAvailabilityIfNeeded(); // 매 요청 시 초기화 필요 여부 확인

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

    // 사용자 ID를 기반으로 동적으로 계산
    const memberId = '3'; // 예: 현재 로그인한 사용자의 ID
    const dynamicAvailability = calculateAvailability(memberId);
  
    return new Response(JSON.stringify(dynamicAvailability), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

// 난이도별 마지막 플레이 타임 갱신
http.put('/api/v1/flip-card/:memberId', async ({ params, request }) => {
  resetAvailabilityIfNeeded(); // 매 요청 시 초기화 필요 여부 확인

  const url = new URL(request.url);
  const difficulty = url.searchParams.get('difficulty'); // 쿼리 파라미터에서 난이도 확인
  const memberIdString = Array.isArray(params.memberId)
    ? params.memberId[0]
    : params.memberId; // params에서 문자열로 가져오기

  // memberId를 숫자로 변환
  const memberId = Number(memberIdString);

  await delay(200);

  // 파라미터 유효성 검사
  if (isNaN(memberId) || !difficulty || !['begin', 'mid', 'adv'].includes(difficulty)) {
    return new Response(
      JSON.stringify({
        message: 'Valid Member ID (number) and difficulty are required.',
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

  // 난이도별 가능 여부 확인
  if (
    (difficulty === 'begin' && !mockDifficultyAvailability.isBegin) ||
    (difficulty === 'mid' && !mockDifficultyAvailability.isMid) ||
    (difficulty === 'adv' && !mockDifficultyAvailability.isAdv)
  ) {
    return new Response(
      JSON.stringify({
        message: `Difficulty ${difficulty} is not playable today.`,
        error: 'DIFFICULTY_NOT_PLAYABLE',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // 같은 날에 이미 플레이했는지 확인
  const today = new Date().toISOString().split('T')[0]; // 현재 날짜 (YYYY-MM-DD)
  const lastPlayTime = lastPlayTimes[memberIdString]?.[difficulty] || null;

  if (lastPlayTime && lastPlayTime.startsWith(today)) {
    return new Response(
      JSON.stringify({
        message: `You have already played difficulty "${difficulty}" today.`,
        error: 'ALREADY_PLAYED_TODAY',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // 마지막 플레이 타임 갱신
  const newLastPlayTime = new Date().toISOString();
  lastPlayTimes[memberIdString] = {
    ...lastPlayTimes[memberIdString],
    [difficulty]: newLastPlayTime,
  };
  saveLastPlayTimesToStorage(lastPlayTimes); // 로컬 스토리지에 저장

  // 난이도 가능 여부를 false로 설정
  if (difficulty === 'begin') mockDifficultyAvailability.isBegin = false;
  if (difficulty === 'mid') mockDifficultyAvailability.isMid = false;
  if (difficulty === 'adv') mockDifficultyAvailability.isAdv = false;

  return new Response(
    JSON.stringify({
      message: `Last play time updated for member ${memberId} on difficulty ${difficulty}.`,
      lastPlayTime: newLastPlayTime, // 갱신된 마지막 플레이 타임 반환
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}),
];