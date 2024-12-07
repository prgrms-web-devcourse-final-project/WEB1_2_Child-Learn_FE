import { baseApi } from '@/shared/api/base';

interface Notification {
  notificationId: number;
  senderLoginId: number;
  senderUsername: string;
  title: string;
  content: string;
  type: 'MESSAGE' | 'FRIEND_REQUEST' | 'FRIEND_ACCEPT';
  isRead: boolean;
  createdAt: string;
  profileImageUrl: string | null;
  elapsedTime: string;
}

interface NotificationResponse {
  content: Notification[];
  pageable: {
    last: boolean;
    number: number;
    size: number;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
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
    size: number = 20,
    sort: string = 'createdAt,DESC'
  ): Promise<NotificationResponse> => {
    const response = await baseApi.get('/notifications', {
      params: { page, size, sort },
    });
    return response.data;
  },

  // 단일 알림 읽음 처리
  markAsRead: async (notificationId: number): Promise<string> => {
    const response = await baseApi.patch(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // 모든 알림 읽음 처리
  markAllAsRead: async (): Promise<string> => {
    const response = await baseApi.patch('/notifications/all/read');
    return response.data;
  },

  // 알림 삭제
  deleteNotification: async (notificationId: number): Promise<string> => {
    const response = await baseApi.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};
