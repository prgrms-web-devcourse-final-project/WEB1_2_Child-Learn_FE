import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/features/notification/api/notificationApi';

export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: (page: number) => [...NOTIFICATION_KEYS.all, 'list', page] as const,
};

// 알림 목록 조회
export const useNotifications = (page: number = 0) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(page),
    queryFn: () => notificationApi.getNotifications(page),
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

export const useSendFriendAcceptNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.sendFriendAcceptNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
