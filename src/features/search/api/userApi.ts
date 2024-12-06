import { baseApi } from '@/shared/api/base';
import { UserSearchResponse } from '@/features/search/model/types';

export const userApi = {
  searchUsers: async (
    username: string,
    page: number = 0,
    size: number = 8
  ): Promise<UserSearchResponse> => {
    const { data } = await baseApi.get('/member/search', {
      params: {
        username: username.trim(),
        page,
        size,
      },
    });
    return data;
  },

  sendFriendRequest: async (receiverId: number): Promise<string> => {
    const { data } = await baseApi.post('/friends/request', {
      receiverId,
    });
    return data;
  },
};
