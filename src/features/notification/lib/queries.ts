import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/features/notification/api/notificationApi';
import { friendApi } from '@/features/freind/api/friendApi';

export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: (page: number) => [...NOTIFICATION_KEYS.all, 'list', page] as const,
  friendRequests: ['friendRequests', 'received'] as const, // 추가
};

interface FriendRequest {
  id: number;
  senderUsername: string;
  receiverUsername: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

// 알림 목록 조회
export const useNotifications = (page: number = 0) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(page),
    queryFn: () => notificationApi.getNotifications(page),
  });
};

// 받은 친구 요청 목록 조회
export const useReceivedFriendRequests = () => {
  return useQuery<FriendRequest[]>({
    queryKey: NOTIFICATION_KEYS.friendRequests,
    queryFn: friendApi.getReceivedFriendRequests,
  });
};

// 단일 알림 읽음 처리
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

// 전체 알림 읽음 처리
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

// 알림 삭제
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

// 친구 요청 응답 (수락/거절)
export const useRespondToFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: number;
      status: 'ACCEPTED' | 'REJECTED';
    }) => {
      await friendApi.respondToFriendRequest({ requestId, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.friendRequests,
      });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
    onError: () => {
      console.error('친구 요청 처리 실패');
    },
  });
};

// 친구 수락 알림 전송
export const useSendFriendAcceptNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // notificationId를 직접 requestId로 사용
    mutationFn: async (notificationId: number) => {
      await notificationApi.sendFriendAcceptNotification(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.friendRequests,
      });
    },
    onError: () => {
      console.error('친구 수락 알림 전송 실패');
    },
  });
};

// 친구 요청 알림 생성
export const useCreateFriendRequestNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.createFriendRequestNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
    onError: () => {
      console.error('친구 요청 알림 생성 실패');
    },
  });
};
