import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/features/search/api/userApi';
import { UserSearchResponse } from '@/features/search/model/types';
import showToast from '@/shared/lib/toast';

export const useSearchUsers = (
  username: string,
  page: number = 0,
  pageSize: number = 8
) => {
  return useQuery({
    queryKey: ['userSearch', username, page, pageSize],
    queryFn: () => userApi.searchUsers(username, page, pageSize),
    enabled: username.trim().length >= 2,
    staleTime: 1000 * 60,
    retry: false,
    throwOnError: false,
    networkMode: 'always',
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: number) => userApi.sendFriendRequest(receiverId),
    onSuccess(_, receiverId) {
      showToast.success('친구 요청을 보냈습니다.');

      const queries = queryClient.getQueriesData<UserSearchResponse>({
        queryKey: ['userSearch'],
      });

      queries.forEach(([queryKey, queryData]) => {
        if (!queryData) return;

        queryClient.setQueryData<UserSearchResponse>(queryKey, {
          ...queryData,
          content: queryData.content.map((user) =>
            user.id === receiverId
              ? { ...user, friendshipStatus: 'PENDING' }
              : user
          ),
        });
      });
    },
    onError() {
      showToast.error('친구 요청에 실패했습니다.');
    },
  });
};
