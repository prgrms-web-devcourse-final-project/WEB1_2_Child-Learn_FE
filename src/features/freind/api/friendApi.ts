import { baseApi } from '@/shared/api/base';
import { Friend } from '@/features/freind/model/types';
import { API_CONFIG } from '@/shared/config';

export interface FriendListResponse {
  content: Friend[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

interface RespondToFriendRequestParams {
  requestId: number;
  status: 'ACCEPTED' | 'REJECTED';
}

export const friendApi = {
  getFriendsList: async (
    page: number = 0,
    size: number = 8,
    searchKeyword?: string
  ): Promise<FriendListResponse> => {
    const { data } = await baseApi.get(API_CONFIG.endpoints.friendList, {
      params: {
        page,
        size,
        searchKeyword: searchKeyword?.trim(),
      },
    });
    return data;
  },

  removeFriend: async (friendId: number): Promise<void> => {
    await baseApi.delete(`${API_CONFIG.endpoints.friendRemove}/${friendId}`);
  },

  // 친구 요청 수락/거절
  respondToFriendRequest: async ({
    requestId,
    status,
  }: RespondToFriendRequestParams): Promise<void> => {
    await baseApi.post(`${API_CONFIG.endpoints.friendRequest}/${requestId}`, {
      status: status,
    });
  },

  // 보낸 친구 요청 목록 조회
  getSentFriendRequests: async () => {
    const response = await baseApi.get(API_CONFIG.endpoints.friendRequestSent);
    return response.data;
  },

  // 받은 친구 요청 목록 조회
  getReceivedFriendRequests: async () => {
    const response = await baseApi.get(
      API_CONFIG.endpoints.friendRequestReceived
    );
    return response.data;
  },
};
