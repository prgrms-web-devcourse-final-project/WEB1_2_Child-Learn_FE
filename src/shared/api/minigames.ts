import { Card } from "@/features/minigame/flipcardgame/types/cardTypes";

const BASE_URL = '/api/v1/flip-card';

// 반환 타입 정의
interface DifficultyAvailability {
  isBegin: boolean;
  isMid: boolean;
  isAdv: boolean;
}

// 반환 타입 정의
interface LastPlayTimeResponse {
  lastPlayTime: string;
}

export const flipCardApi = {
  // 카드 목록 조회
  getCardList: async (difficulty: string): Promise<Card[]> => {
    try {
      const response = await fetch(`${BASE_URL}?difficulty=${difficulty}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch card list:', error);
      throw error;
    }
  },


  // 난이도별 가능 여부 확인
  checkDifficultyAvailability: async (): Promise<DifficultyAvailability> => {
    try {
      const response = await fetch(`${BASE_URL}/available`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch difficulty availability');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch difficulty availability:', error);
      throw error;
    }
  },

  updateLastPlayTime: async (memberId: number, difficulty: string):Promise<LastPlayTimeResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/${memberId}?difficulty=${difficulty}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to update last play time');
      }
  
      const data = await response.json();
      console.log('Last play time updated:', data.lastPlayTime); // 마지막 플레이 타임 확인
      return data;
    } catch (error) {
      console.error('Failed to update last play time:', error);
      throw error;
    }
  },  
};