import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/features/search/api/userApi';
import {
  SearchedUser,
  UserSearchResponse,
} from '@/features/search/model/types';
import showToast from '@/shared/lib/toast';

export const useSearchUsers = (
  username: string,
  page: number = 0,
  pageSize: number = 8
) => {
  return useQuery<UserSearchResponse, Error>({
    queryKey: ['userSearch', username, page, pageSize],
    queryFn: () => userApi.searchUsers(username, page, pageSize),
    enabled: !!username,
    staleTime: 1000 * 60,
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: number) => {
      // string -> number
      return userApi.sendFriendRequest(receiverId);
    },
    onSuccess: (_, variables) => {
      showToast.success('친구 요청을 보냈습니다.');

      // 모든 userSearch 쿼리 찾기
      const queries = queryClient.getQueriesData<UserSearchResponse>({
        queryKey: ['userSearch'],
      });

      // 각 쿼리 데이터 업데이트
      queries.forEach(([queryKey, queryData]) => {
        queryClient.setQueryData<UserSearchResponse>(queryKey, () => {
          if (!queryData) return queryData;

          return {
            ...queryData,
            content: queryData.content.map((user: SearchedUser) =>
              user.id === variables // loginId -> id로 변경
                ? { ...user, friendshipStatus: 'PENDING' } // requestStatus -> friendshipStatus
                : user
            ),
          };
        });
      });
    },
    onError: (error) => {
      console.error('Friend request error:', error);
      showToast.error('친구 요청에 실패했습니다.');
    },
  });
};
