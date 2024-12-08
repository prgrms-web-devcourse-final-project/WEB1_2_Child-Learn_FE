import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/features/search/api/userApi';
import { UserSearchResponse } from '@/features/search/model/types';
import showToast from '@/shared/lib/toast';
import { useCreateFriendRequestNotification } from '@/features/notification/lib/queries';

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
  const { mutateAsync: createNotification } =
    useCreateFriendRequestNotification();

  return useMutation({
    mutationFn: async ({
      receiverId,
      receiverUsername,
    }: {
      receiverId: number;
      receiverUsername: string;
    }) => {
      // 1. 친구 요청 처리 (receiverId 사용)
      await userApi.sendFriendRequest(receiverId);
      // 2. 알림 생성 (receiverUsername 사용)
      await createNotification(receiverUsername);
    },
    onSuccess(_, { receiverId }) {
      showToast.success('친구 요청을 보냈습니다.');

      // 검색 결과 업데이트
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
