import { baseApi } from '@/shared/api/base';
import { Friend } from '@/features/freind/model/types';
import { API_CONFIG } from '@/shared/config';

export const friendApi = {
  // 친구 목록 조회
  getFriendsList: async (): Promise<Friend[]> => {
    try {
      const { data } = await baseApi.get(API_CONFIG.endpoints.friendList);
      return data;
    } catch (error) {
      throw new Error('친구 목록을 불러오는데 실패했습니다.');
    }
  },

  // 친구 삭제
  removeFriend: async (friendId: number): Promise<void> => {
    try {
      await baseApi.delete(`${API_CONFIG.endpoints.friendRemove}/${friendId}`);
    } catch (error) {
      throw new Error('친구 삭제에 실패했습니다.');
    }
  },
};