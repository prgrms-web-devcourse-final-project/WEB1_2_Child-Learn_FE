import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { NOTIFICATION_KEYS } from '@/features/notification/lib/queries';

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
      console.log('SSE 이벤트 수신:', eventData);

      if ('event' in eventData && eventData.event === 'notification') {
        console.log('새 알림 수신');
        queryClient.invalidateQueries({
          queryKey: NOTIFICATION_KEYS.list(0),
        });
      } else if ('type' in eventData) {
        console.log('알림 상태 변경:', eventData.type);
        switch (eventData.type) {
          case 'READ':
          case 'READ_ALL':
          case 'DELETE':
            queryClient.invalidateQueries({
              queryKey: NOTIFICATION_KEYS.list(0),
            });
            break;
        }
      }
    },
    [queryClient]
  );

  const connectSSE = useCallback(() => {
    if (!isAuthenticated) return;

    const eventSource = new EventSource('/notifications/subscribe', {
      withCredentials: true,
    });

    console.log('SSE 연결 시도');

    // 연결 성공 시
    eventSource.onopen = () => {
      console.log('SSE 연결 성공');
    };

    // notification 이벤트 리스너
    eventSource.addEventListener('notification', (event) => {
      try {
        const eventData = JSON.parse(event.data);
        console.log('알림 이벤트 수신:', eventData);
        handleSSEEvent(eventData);
      } catch (error) {
        console.error('SSE 메시지 파싱 실패:', error);
      }
    });

    // 재연결 이벤트 리스너
    eventSource.addEventListener('retry', () => {
      console.log('SSE 재연결 시도');
    });

    eventSource.onerror = (error) => {
      console.error('SSE 연결 에러:', error);
      eventSource.close();
      setTimeout(connectSSE, 1000); // 백엔드의 RECONNECTION_TIMEOUT과 맞춤
    };

    return () => {
      console.log('SSE 연결 종료');
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
