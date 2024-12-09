import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { friendApi } from '@/features/freind/api/friendApi';
import { Friend } from '@/features/freind/model/types';
import showToast from '@/shared/lib/toast';
import { notificationApi } from '@/features/notification/api/notificationApi';
import { Notification } from '@/features/notification/model/types';

interface FriendListResponse {
  content: Friend[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;
  size: number;
  empty: boolean;
}

// NOTIFICATION_KEYS 상수 정의 추가
export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: (page: number) => ['notifications', 'list', page] as const,
  friendRequests: ['notifications', 'friendRequests', 'received'] as const,
};

export const FRIEND_KEYS = {
  all: ['friends'] as const,
  list: (page: number, searchKeyword?: string) =>
    [...FRIEND_KEYS.all, 'list', page, searchKeyword] as const,
};

export const useFriendList = (searchKeyword: string, page: number = 0) => {
  return useQuery<FriendListResponse>({
    queryKey: FRIEND_KEYS.list(page, searchKeyword),
    queryFn: () => friendApi.getFriendsList(page, 8, searchKeyword),
    // enabled 조건 제거 - 항상 쿼리 실행되도록
    staleTime: 1000 * 60,
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: friendApi.removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIEND_KEYS.all });
      showToast.success('친구가 삭제되었습니다.');
    },
    onError: () => {
      showToast.error('친구 삭제에 실패했습니다.');
    },
  });
};

// 새로 추가하는 친구 요청 응답 hook
export const useRespondToFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
      senderUsername,
    }: {
      requestId: number;
      status: 'ACCEPTED' | 'REJECTED';
      notificationId: number;
      senderUsername: string;
    }) => {
      await friendApi.respondToFriendRequest({ requestId, status });
      if (status === 'ACCEPTED') {
        await notificationApi.sendFriendAcceptNotification(senderUsername);
      }
    },
    onMutate: async ({ notificationId, status }) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.list(0) });
      const previousNotifications = queryClient.getQueryData(
        NOTIFICATION_KEYS.list(0)
      );

      queryClient.setQueryData(NOTIFICATION_KEYS.list(0), (old: any) => ({
        ...old,
        content: old.content.map((n: Notification) =>
          n.notificationId === notificationId ? { ...n, status } : n
        ),
      }));

      return { previousNotifications };
    },
    onError: (_, __, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATION_KEYS.list(0),
          context.previousNotifications
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'friends'],
      });
    },
  });
};
