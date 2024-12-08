import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/User/model/store/authStore';
import { NOTIFICATION_KEYS } from '@/features/notification/lib/queries';
import { baseApi } from '@/shared/api/base';

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
      console.log('SSE 이벤트 수신:', eventData); // 디버깅용 로그

      if ('event' in eventData && eventData.event === 'notification') {
        // 새 알림이 왔을 때
        console.log('새 알림 수신');
        queryClient.invalidateQueries({
          queryKey: NOTIFICATION_KEYS.list(0), // 실제 사용하는 쿼리 키로 변경
        });
      } else if ('type' in eventData) {
        // 알림 상태 변경됐을 때
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

    // baseApi의 baseURL 사용
    const baseURL = baseApi.defaults.baseURL;
    const eventSource = new EventSource(`${baseURL}/notifications/subscribe`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data);
        handleSSEEvent(eventData);
      } catch (error) {
        console.error('SSE 메시지 파싱 실패:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE 연결 에러:', error);
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
