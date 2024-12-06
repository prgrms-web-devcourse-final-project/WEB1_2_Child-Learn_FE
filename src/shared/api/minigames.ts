import { baseApi } from "./base";
import { Card } from "@/features/minigame/flipcardgame/types/cardTypes";
import { WordQuizResponse, WordQuizRequest } from "@/features/minigame/wordquizgame/types/wordTypes";

interface DifficultyAvailability {
  isBegin: boolean;
  isMid: boolean;
  isAdv: boolean;
}

interface LastPlayTimeResponse {
  lastPlayTime: string;
}

export const flipCardApi = {
  // 카드 목록 조회
  getCardList: async (difficulty: string): Promise<Card[]> => {
    try {
      const response = await baseApi.get(`/flip-card`, {
        params: { difficulty }, // 쿼리 파라미터로 전달
      });
      return response.data; // axios는 자동으로 JSON 데이터를 반환
    } catch (error) {
      console.error("Failed to fetch card list:", error);
      throw error;
    }
  },

  // 난이도별 가능 여부 확인
  checkDifficultyAvailability: async (): Promise<DifficultyAvailability> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.get(`/flip-card/available`, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 설정
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch difficulty availability:", error);
      throw error;
    }
  },

  // 마지막 플레이 시간 갱신
  updateLastPlayTime: async (
    memberId: number,
    difficulty: string
  ): Promise<LastPlayTimeResponse> => {
    try {
      const token = localStorage.getItem("token");
      const response = await baseApi.put(
        `/flip-card/${memberId}`,
        {}, // PUT 요청의 본문 (현재 비어 있음)
        {
          params: { difficulty }, // 쿼리 파라미터로 전달
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더 설정
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update last play time:", error);
      throw error;
    }
  },
};

export const wordQuizApi = {
  // 난이도별 플레이 가능 여부 확인
  checkAvailability: async (): Promise<{
    isEasyPlayAvailable: boolean;
    isNormalPlayAvailable: boolean;
    isHardPlayAvailable: boolean;
  }> => {
    const response = await baseApi.get('/word-quiz/availability', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT 인증
      },
    });
    return response.data;
  },

  // 난이도별 퀴즈 조회
  getQuizByDifficulty: async (difficulty: 'EASY' | 'NORMAL' | 'HARD'): Promise<WordQuizResponse> => {
    const response = await baseApi.get(`/word-quiz/${difficulty}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT 인증
      },
    });
    return response.data;
  },

  // 답안 제출
submitAnswer: async (
  isCorrect: boolean
): Promise<WordQuizResponse | null> => {
  const body: WordQuizRequest = { isCorrect };

  const response = await baseApi.post(
    `/word-quiz/submissions`,
    body,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT 인증
        'Content-Type': 'application/json',
      },
    }
  );

  // API가 null을 반환하면 게임 종료 상태임
  if (!response.data) {
    return null; // 게임 종료
  }

  // 게임 상태 업데이트
  return response.data as WordQuizResponse;
},
};