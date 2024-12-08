import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/User/model/store/authStore';

interface SSEEvent {
  event?: 'notification';
  id?: string;
  data: string;
}

interface NotificationStateEvent {
  type: 'READ' | 'READ_ALL' | 'DELETE';
  notificationId?: number;
  memberId?: number;
}

export const useNotificationSSE = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const handleSSEEvent = useCallback(
    (eventData: SSEEvent | NotificationStateEvent) => {
      if ('event' in eventData && eventData.event === 'notification') {
        // 새 알림이 오면 알림 목록 쿼리 갱신
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } else if ('type' in eventData) {
        // READ, DELETE 등 상태 변경 시에도 알림 목록 쿼리 갱신
        switch (eventData.type) {
          case 'READ':
          case 'READ_ALL':
          case 'DELETE':
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            break;
        }
      }
    },
    [queryClient]
  );

  const connectSSE = useCallback(() => {
    if (!isAuthenticated) return;

    const eventSource = new EventSource('/api/v1/notifications/subscribe', {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data);
        handleSSEEvent(eventData);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
      // 연결이 끊어지면 5초 후 재연결 시도
      setTimeout(connectSSE, 5000);
    };

    // cleanup function
    return () => {
      eventSource.close();
    };
  }, [isAuthenticated, handleSSEEvent]);

  useEffect(() => {
    const cleanup = connectSSE();
    return () => {
      cleanup?.();
    };
  }, [connectSSE]);
};
