import { baseApi } from "./base";
import { Card } from "@/features/minigame/flipcardgame/types/cardTypes";
import { WordQuizResponse, WordQuizRequest } from "@/features/minigame/wordquizgame/types/wordTypes";
import { QuizRequestDto, QuizResponseDto, QuizAnswerRequestDto, QuizAnswerResponseDto } from '@/features/minigame/oxquizgame/types/oxTypes';

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

  // 게임 상태 업데이트
  return response.data as WordQuizResponse;
},
};

export const oxQuizApi = {
  // 퀴즈 시작 (난이도별 퀴즈 조회)
  startQuiz: async (difficulty: 'EASY' | 'MEDIUM' | 'HARD'): Promise<QuizResponseDto[]> => {
    const response = await baseApi.post(
      `/ox-quiz/start`,
      { difficulty },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT 인증
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // QuizResponseDto[] 반환
  },

  // 답안 제출
  submitAnswer: async (
    oxQuizDataId: number,
    userAnswer: 'O' | 'X'
  ): Promise<QuizAnswerResponseDto> => {
    const body = { userAnswer };

    const response = await baseApi.post(
      `/ox-quiz/${oxQuizDataId}/answer`,
      body,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT 인증
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // QuizAnswerResponseDto 반환
  },

  // 사용자 진행 상태 확인
  checkProgress: async (): Promise<{
    completed: number; // 완료된 퀴즈 수
    total: number; // 총 퀴즈 수
    isQuizAvailable: boolean; // 퀴즈 시작 가능 여부
  }> => {
    const response = await baseApi.get(`/ox-quiz/progress`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT 인증
      },
    });

    return response.data; // 진행 상태 정보 반환
  },
};