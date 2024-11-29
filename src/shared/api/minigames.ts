const BASE_URL = '/api/v1/flip-card';

export const flipCardApi = {
  // 카드 목록 조회
  getCardList: async (difficulty: string) => {
    try {
      const response = await fetch(`${BASE_URL}/${difficulty}`);
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
  checkDifficultyAvailability: async () => {
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

  // 난이도별 마지막 플레이 타임 갱신
  updateLastPlayTime: async (memberId: string, difficulty: string) => {
    try {
      const response = await fetch(`${BASE_URL}/${memberId}/${difficulty}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to update last play time');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to update last play time:', error);
      throw error;
    }
  },
};