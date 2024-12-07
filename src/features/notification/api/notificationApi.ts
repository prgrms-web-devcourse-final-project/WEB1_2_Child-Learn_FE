import { baseApi } from '@/shared/api/base';
import { NotificationResponse } from '@/features/notification/model/types';

export const notificationApi = {
  // SSE 연결
  subscribeToSSE: () => {
    return baseApi.get('/notifications/subscribe', {
      headers: {
        Accept: 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
      responseType: 'text',
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
