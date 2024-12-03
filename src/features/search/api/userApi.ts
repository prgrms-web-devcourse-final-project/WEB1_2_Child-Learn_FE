import { baseApi } from '@/shared/api/base';
import { UserSearchResponse } from '@/features/search/model/types';

export const userApi = {
  searchUsers: async (
    username: string,
    page: number = 0, // 페이지 번호 (기본값 0)
    size: number = 10 // 페이지 크기 (기본값 10)
  ): Promise<UserSearchResponse> => {
    const { data } = await baseApi.get(`/member/search`, {
      params: {
        username,
        page, // 페이지 파라미터 추가
        size, // 사이즈 파라미터 추가
      },
    });
    return data;
  },

  sendFriendRequest: async (receiverId: string) => {
    const { data } = await baseApi.post('/friends/request', {
      receiverId,
    });
    return data;
  },
};
