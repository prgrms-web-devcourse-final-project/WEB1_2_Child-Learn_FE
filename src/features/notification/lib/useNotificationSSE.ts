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
  const { isAuthenticated, accessToken } = useAuthStore(); // accessToken 추가

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

    // URL에서 인증 토큰을 쿼리 파라미터로 포함
    const eventSource = new EventSource(
      `/api/v1/notifications/subscribe?token=${accessToken}`,
      {
        withCredentials: true, // 인증 정보 포함
      }
    );

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
      // 인증된 상태일 때만 재연결 시도
      if (isAuthenticated) {
        setTimeout(connectSSE, 3000);
      }
    };

    return () => {
      console.log('SSE 연결 종료');
      eventSource.close();
    };
  }, [isAuthenticated, handleSSEEvent]);

  useEffect(() => {
    const cleanup = connectSSE();
    return () => {
      if (cleanup) {
        cleanup();
        console.log('SSE 연결 정상 종료');
      }
    };
  }, [connectSSE, isAuthenticated]); // isAuthenticated 의존성 추가
};
