import { baseApi } from '@/shared/api/base';
import { UserSearchResponse } from '@/features/search/model/types';

export const userApi = {
  searchUsers: async (username: string): Promise<UserSearchResponse> => {
    const { data } = await baseApi.get(`/member/search`, {
      params: { username },
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
