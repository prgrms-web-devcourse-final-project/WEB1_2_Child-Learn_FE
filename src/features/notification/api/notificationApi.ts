import { baseApi } from '@/shared/api/base';

interface Notification {
  id: number;
  type: 'MESSAGE' | 'FRIEND_REQUEST' | 'FRIEND_ACCEPT';
  senderLoginId: number;
  senderUsername: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  profileImageUrl: string | null;
  elapsedTime: string;
}

interface NotificationResponse {
  content: Notification[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
}

export const notificationApi = {
  // SSE 연결
  subscribeToSSE: () => {
    return baseApi.get('/notifications/subscribe', {
      headers: {
        Accept: 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
      responseType: 'stream',
    });
  },

  // 알림 목록 조회
  getNotifications: async (
    page: number = 0,
    size: number = 20
  ): Promise<NotificationResponse> => {
    const response = await baseApi.get('/notifications', {
      params: { page, size },
    });
    return response.data;
  },

  // 단일 알림 읽음 처리
  markAsRead: async (notificationId: number) => {
    const response = await baseApi.patch(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // 모든 알림 읽음 처리
  markAllAsRead: async () => {
    const response = await baseApi.patch('/notifications/all/read');
    return response.data;
  },

  // 알림 삭제
  deleteNotification: async (notificationId: number) => {
    const response = await baseApi.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};
